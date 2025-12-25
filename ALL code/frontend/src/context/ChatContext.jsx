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

  // Load chats from local storage and SANITIZE duplicate IDs
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);

        // Sanitize: Remove messages with duplicate IDs
        const sanitized = {};
        Object.keys(parsed).forEach(userId => {
          const session = parsed[userId];
          const seenIds = new Set();
          const uniqueMessages = [];

          if (session.messages && Array.isArray(session.messages)) {
            session.messages.forEach(msg => {
              // Ensure ID exists and is unique
              const msgId = msg.id || `restored-${Date.now()}-${Math.random()}`;
              if (!seenIds.has(msgId)) {
                seenIds.add(msgId);
                uniqueMessages.push({ ...msg, id: msgId });
              }
            });
          }

          sanitized[userId] = { ...session, messages: uniqueMessages };
        });

        setSessions(sanitized);
      } catch (e) {
        console.error("Failed to parse chat sessions", e);
        localStorage.removeItem('chatSessions');
      }
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
        let sessionKey;

        if (user.role === 'ADMIN') {
          sessionKey = msg.sender_type === 'USER' ? msg.sender_id : 'system';
        } else {
          sessionKey = user.id;
        }

        const current = prev[sessionKey] || { messages: [] };

        // ROBUST DUPLICATE CHECK
        // 1. Check if we already have a message with this exact ID
        if (current.messages.some(m => m.id === msg.id)) {
          return prev;
        }

        // 2. Filter out own messages to prevent optimistic duplication
        if (String(msg.sender_id) === String(user.id)) {
          return prev;
        }

        // 3. Prevent Duplicate Bot Greetings (Content-based check)
        // If it's a system greeting and we already have one in the list, ignore it
        if (msg.sender_type === 'BOT' && msg.content.includes('Connected to GamerZone Secure Chat')) {
          const hasGreeting = current.messages.some(m => m.text === msg.content);
          if (hasGreeting) return prev;
        }

        return {
          ...prev,
          [sessionKey]: {
            ...current,
            messages: [...current.messages, {
              id: msg.id || `grpc-${Date.now()}-${Math.random()}`, // Ensure ID exists
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
      chatClient.disconnect();
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
