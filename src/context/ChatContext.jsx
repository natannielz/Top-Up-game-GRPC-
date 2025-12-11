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

      // We need to know which session this belongs to. 
      // For simplicity, we assume the current user's session or find it if Admin.
      // If Sender is BOT/ADMIN -> It goes to the relevant User Session.
      // Since we are Client-Side logic here, 'user.id' is the session key usually.

      // const targetSessionId = "1"; // HARDCODED for Demo: "admin1" is ID 1 in AuthContext.
      // In reality, msg should contain receiver_id.

      // Update Session
      setSessions(prev => {
        // Find session to update (assume user ID 1 for now if we don't have receiver info)
        // If we are User, we update our own session.
        // If we are Admin, we update the Sender's session.
        const activeUserId = msg.sender_id === 'bot-001' ? (user?.id || 1) : msg.sender_id;

        // Fix: If I am User, Bot replies to Me.
        const sessionKey = user?.role === 'ADMIN' ? msg.sender_id : user?.id;

        const current = prev[sessionKey] || { messages: [] };
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
            unread: (current.unread || 0) + 1
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

  // Bot Auto-Reply Logic
  const handleBotReply = (userId, message) => {
    setTimeout(() => {
      let reply = "Hello! Admin is currently offline. How can I help you?";
      const lowerMsg = message.toLowerCase();

      if (lowerMsg.includes('top up') || lowerMsg.includes('buy')) {
        reply = "To Top Up: Select a game -> Choose an item -> Enter ID -> Pay!";
      } else if (lowerMsg.includes('status') || lowerMsg.includes('pending')) {
        reply = "You can check your order status in the 'Transactions' menu.";
      } else if (lowerMsg.includes('payment') || lowerMsg.includes('failed')) {
        reply = "If your payment failed, please ensure your balance is sufficient or try another method.";
      }

      const botMsg = {
        id: Date.now(),
        sender: 'BOT',
        text: reply,
        timestamp: new Date().toISOString()
      };

      setSessions(prev => {
        const userSession = prev[userId] || { messages: [] };
        return {
          ...prev,
          [userId]: {
            ...userSession,
            messages: [...userSession.messages, botMsg],
            lastMessage: botMsg.text,
            timestamp: botMsg.timestamp,
            unread: (userSession.unread || 0) + 1
          }
        };
      });
    }, 1500);
  };

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
    const sessionId = isAdmin ? targetUserId || senderId : senderId;

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
    });

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
