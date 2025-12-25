import { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User as UserIcon } from 'lucide-react'; // Changed Robot to Bot
import './ChatWidget.css';

const ChatWidget = () => {
  const { user } = useAuth();
  const { sessions, sendMessage, adminStatus, isWidgetOpen, setIsWidgetOpen, connectionStatus } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Handle safe data access before conditional return
  const userId = user ? user.id : null;
  const mySession = (userId && sessions[userId]) ? sessions[userId] : { messages: [] };
  const messages = mySession.messages || []; // Ensure it's always an array

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isWidgetOpen]);

  // Don't show for Admin or if not logged in (optional)
  // MOVED AFTER HOOKS to prevent "Rendered more hooks than previous render" error
  if (!user || user.role === 'ADMIN') return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(user.id, input);
    setInput('');
  };

  // Get connection status display
  const getStatusDisplay = () => {
    switch (connectionStatus) {
      case 'connected':
        return { text: adminStatus === 'Online' ? 'Admin Online' : 'Bot Support', dot: 'status-connected', icon: '🟢' };
      case 'connecting':
        return { text: 'Connecting...', dot: 'status-connecting', icon: '🟡' };
      case 'reconnecting':
        return { text: 'Reconnecting...', dot: 'status-error', icon: '🔴' };
      case 'error':
        return { text: 'Connection Lost', dot: 'status-error', icon: '🔴' };
      default:
        return { text: 'Offline', dot: 'status-error', icon: '⚪' };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <div className="chat-widget-container">

      <AnimatePresence>
        {isWidgetOpen && (
          <motion.div
            className="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            {/* Header */}
            <div className="chat-header">
              <div className="chat-status">
                <div className={`w-3 h-3 rounded-full ${statusInfo.dot}`} />
                <div>
                  <h4>Support {statusInfo.icon}</h4>
                  <span>{statusInfo.text}</span>
                </div>
              </div>
              <button onClick={() => setIsWidgetOpen(false)}><X size={18} /></button>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.length === 0 && (
                <div className="empty-chat">
                  <p>👋 Hi {user.username}! How can we help you today?</p>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`msg-row ${msg.sender === 'USER' ? 'my-msg' : 'other-msg'}`}>
                  {msg.sender !== 'USER' && (
                    <div className="msg-avatar">
                      {msg.sender === 'ADMIN' ? '🛡️' : '🤖'}
                    </div>
                  )}
                  <div className="msg-bubble">
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className="chat-input-area" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit"><Send size={18} /></button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="chat-fab"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsWidgetOpen(!isWidgetOpen)}
      >
        {isWidgetOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
};

export default ChatWidget;
