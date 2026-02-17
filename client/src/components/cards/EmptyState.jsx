import React from 'react';
import { motion } from 'framer-motion';
import { PrimaryButton } from '../buttons/PrimaryButton';

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className = '' 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`text-center py-16 px-4 ${className}`}
    >
      {Icon && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-tea-100 to-premium-100 flex items-center justify-center">
            <Icon className="w-10 h-10 text-tea-600" />
          </div>
        </motion.div>
      )}
      
      {title && (
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl font-bold text-gray-900 mb-3"
        >
          {title}
        </motion.h3>
      )}
      
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-gray-600 max-w-md mx-auto mb-6"
        >
          {description}
        </motion.p>
      )}
      
      {actionLabel && onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <PrimaryButton onClick={onAction}>
            {actionLabel}
          </PrimaryButton>
        </motion.div>
      )}
    </motion.div>
  );
}
