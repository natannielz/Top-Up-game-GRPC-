import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { chatClient } from '../api/grpcClient';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  // Admin Status: 'Online' | 'Offline'
  const [adminStatus, setAdminStatus] = useState('Online');

  // Chat Sessions: { [userId]: { messages: [], unread: 0, lastMessage: '', timestamp: Date } }
  const [sessions, setSessions] = useState({});

  // Current user's chat visible state (for widget)
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  // gRPC Connection Status
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Load chats from local storage
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Persist chats
  useEffect(() => {
    if (Object.keys(sessions).length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Initialize gRPC Listener
  useEffect(() => {
    if (!user) return; // Wait for user login

    const listener = chatClient.joinChat({
      id: user.id,
      username: user.username,
      role: user.role
    });

    listener.onMessage((msg) => {
      // Handle incoming message (e.g. from Bot or Admin)
      console.log("Context Received gRPC Msg:", msg);

      setSessions(prev => {
        // DERIVE SESSION KEY
        // 1. If I am an ADMIN, the key is the SENDER (the User ID).
        // 2. If I am a USER, the key is MYSELF (my own User ID).
        //    (Because different admins might reply, but they all appear in my one 'Support' chat).

        let sessionKey;

        if (user.role === 'ADMIN') {
          // If message is from another Admin (unlikely in this flow) or System, handle gracefully
          sessionKey = msg.sender_type === 'USER' ? msg.sender_id : 'system';
        } else {
          // I am a User. All messages (from Admin, Bot) go to my session state.
          sessionKey = user.id;
        }

        const current = prev[sessionKey] || { messages: [] };

        // Prevent duplicate messages if optimistic update already added it (check by ID if possible, but IDs might differ)
        // For now, checks if we just sent this (sender_id == user.id) are handled by optimistic update, 
        // but this callback receives ALL messages from stream, so we should filter out our own messages if the server echoes them back.
        // The server currently echoes to admins if User sends, and echoes to User if Admin sends.

        // If I am the sender, ignore (Assumes optimistic update handled it)
        if (String(msg.sender_id) === String(user.id)) return prev;

        return {
          ...prev,
          [sessionKey]: {
            ...current,
            messages: [...current.messages, {
              id: msg.id,
              sender: msg.sender_type,
              text: msg.content,
              timestamp: msg.timestamp
            }],
            unread: (current.unread || 0) + 1,
            lastMessage: msg.content,
            timestamp: msg.timestamp
          }
        };
      });
    });

    // Subscribe to connection status changes
    const unsubscribe = chatClient.onStatusChange((status) => {
      setConnectionStatus(status);
    });

    // Cleanup on unmount or user change
    return () => {
      unsubscribe();
    };
  }, [user]); // Re-subscribe if user changes

  const sendMessage = async (senderId, text, isAdmin = false, targetUserId = null) => {
    // 1. Optimistic Update (Show immediately)
    const tempId = Date.now();
    const message = {
      id: tempId,
      sender: isAdmin ? 'ADMIN' : 'USER',
      text,
      timestamp: new Date().toISOString()
    };

    // Determine which session to update
    // If Admin sending to a specific user, update that user's session
    // If User sending, update their own session (their conversation)
    const sessionId = isAdmin ? targetUserId : senderId;

    setSessions(prev => {
      const currentSession = prev[sessionId] || { messages: [], unread: 0 };
      return {
        ...prev,
        [sessionId]: {
          ...currentSession,
          messages: [...currentSession.messages, message],
          lastMessage: text,
          timestamp: message.timestamp,
        }
      };
    });  // Bot Auto-Reply Logic REMOVED (Server handles it)

    // 2. Send via gRPC
    try {
      await chatClient.sendMessage({
        sender_id: String(senderId),
        sender_type: isAdmin ? 'ADMIN' : 'USER',
        receiver_id: isAdmin ? String(targetUserId || senderId) : 'admin', // Target user or admin
        content: text
      });
      // Success
    } catch (error) {
      console.error("Failed to send gRPC message", error);
    }
  };

  const markAsRead = (userId) => {
    setSessions(prev => ({
      ...prev,
      [userId]: { ...prev[userId], unread: 0 }
    }));
  };

  const clearChat = (userId) => {
    setSessions(prev => {
      const newState = { ...prev };
      delete newState[userId];
      return newState;
    });
  };

  return (
    <ChatContext.Provider value={{
      sessions,
      sendMessage,
      adminStatus,
      setAdminStatus,
      markAsRead,
      clearChat,
      isWidgetOpen,
      setIsWidgetOpen,
      connectionStatus
    }}>
      {children}
    </ChatContext.Provider>
  );
};
