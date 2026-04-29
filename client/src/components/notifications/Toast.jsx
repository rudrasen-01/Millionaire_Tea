import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
  const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
  const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
  const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer notifications={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const ToastContainer = ({ notifications, onRemove }) => {
  if (!notifications || notifications.length === 0) return null;

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'rgba(16, 185, 129, 0.95)',
          border: 'border-emerald-400',
          icon: CheckCircle,
          iconColor: 'text-white'
        };
      case 'error':
        return {
          bg: 'rgba(239, 68, 68, 0.95)',
          border: 'border-red-400',
          icon: XCircle,
          iconColor: 'text-white'
        };
      case 'warning':
        return {
          bg: 'rgba(245, 158, 11, 0.95)',
          border: 'border-amber-400',
          icon: AlertCircle,
          iconColor: 'text-white'
        };
      default:
        return {
          bg: 'rgba(59, 130, 246, 0.95)',
          border: 'border-blue-400',
          icon: Info,
          iconColor: 'text-white'
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => {
          const styles = getToastStyles(notification.type);
          const Icon = styles.icon;

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border ${styles.border} backdrop-blur-md pointer-events-auto min-w-[320px] max-w-md`}
              style={{ 
                background: styles.bg,
              }}
            >
              <Icon className={`w-6 h-6 flex-shrink-0 ${styles.iconColor}`} />
              <p className="text-white font-medium text-sm flex-1 leading-relaxed">{notification.message}</p>
              <button
                onClick={() => onRemove(notification.id)}
                className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
