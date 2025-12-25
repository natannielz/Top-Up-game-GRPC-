import { createContext, useContext, useState, useCallback, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Helper functions
  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <ToastItem key={t.id} {...t} onClose={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = forwardRef(({ message, type, onClose }, ref) => {
  const icons = {
    success: <Check size={18} className="text-white" />,
    error: <X size={18} className="text-white" />,
    info: <Info size={18} className="text-white" />,
    warning: <AlertTriangle size={18} className="text-white" />
  };

  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-amber-500'
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      className={`${colors[type]} p-4 rounded-xl shadow-lg shadow-black/10 flex items-center gap-3 min-w-[300px] pointer-events-auto backdrop-blur-md`}
    >
      <div className="p-1 rounded-full bg-white/20">
        {icons[type]}
      </div>
      <p className="flex-1 text-white font-medium text-sm">{message}</p>
      <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
        <X size={14} />
      </button>
    </motion.div>
  );
});
