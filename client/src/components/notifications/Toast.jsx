import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    bgClass: 'bg-green-50 border-green-200',
    iconColor: 'text-green-600',
    textColor: 'text-green-900'
  },
  error: {
    icon: AlertCircle,
    bgClass: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600',
    textColor: 'text-red-900'
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-yellow-50 border-yellow-200',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-900'
  },
  info: {
    icon: Info,
    bgClass: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-900'
  }
};

export function Toast({ notification, onRemove }) {
  const type = notification.type || 'info';
  const config = TOAST_TYPES[type] || TOAST_TYPES.info;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(notification.id);
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [notification.id, notification.duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`glass-card ${config.bgClass} border p-4 rounded-lg shadow-lg max-w-md w-full relative overflow-hidden`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${config.bgClass} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>

        <div className="flex-1 min-w-0">
          {notification.title && (
            <h4 className={`font-semibold ${config.textColor} mb-1`}>
              {notification.title}
            </h4>
          )}
          <p className={`text-sm ${config.textColor}`}>
            {notification.text || notification.message}
          </p>
        </div>

        <button
          onClick={() => onRemove(notification.id)}
          className="flex-shrink-0 w-6 h-6 rounded-lg hover:bg-black/5 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Progress bar */}
      <motion.div
        className={`absolute bottom-0 left-0 h-1 ${config.iconColor.replace('text-', 'bg-')} rounded-b-lg`}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: (notification.duration || 5000) / 1000, ease: 'linear' }}
      />
    </motion.div>
  );
}

export function ToastContainer({ notifications, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      <div className="pointer-events-auto">
        <AnimatePresence>
          {notifications.map(notification => (
            <Toast
              key={notification.id}
              notification={notification}
              onRemove={onRemove}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
