import React from 'react';
import { motion } from 'framer-motion';

export function PrimaryButton({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  tooltipText = null,
  className = "",
  ...props 
}) {
  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      title={tooltipText}
      className={`
        tea-button
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${loading ? 'animate-pulse' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
}

export function SecondaryButton({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  className = "",
  ...props 
}) {
  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        glass-card px-6 py-3 rounded-xl font-semibold text-gray-700
        transition-all duration-300 hover:shadow-lg hover:bg-white/90
        active:scale-95
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${loading ? 'animate-pulse' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
}

export function IconButton({ 
  children, 
  onClick, 
  disabled = false,
  tooltipText = null,
  className = "",
  ...props 
}) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.9 } : {}}
      onClick={onClick}
      disabled={disabled}
      title={tooltipText}
      className={`
        glass-card p-2 rounded-full
        transition-all duration-300 hover:shadow-lg hover:bg-white/90
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}
