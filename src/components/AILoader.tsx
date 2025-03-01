import React from 'react';
import { motion } from 'framer-motion';

interface AILoaderProps {
  isLoading: boolean;
  disabled?: boolean;
  onClick?: () => Promise<void>;
  children?: React.ReactNode;
  message?: string;
  loadingOnly?: boolean;
}

const AILoader: React.FC<AILoaderProps> = ({ 
  isLoading, 
  disabled = false, 
  onClick, 
  children, 
  message = 'Generating IntelliSync AI Magic...',
  loadingOnly = false
}) => {
  const handleClick = async () => {
    if (onClick && !disabled) {
      await onClick();
    }
  };

  return (
    <>
      {!loadingOnly && (
        <button 
          onClick={handleClick}
          disabled={disabled || isLoading}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-medium hover:opacity-90 transition-all dark:shadow-[0_0_15px_rgba(0,0,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {children}
        </button>
      )}

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <motion.div 
              className="mx-auto mb-4 w-16 h-16"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 100 100" 
                className="w-full h-full"
              >
                <defs>
                  <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#6a11cb', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#2575fc', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="url(#aiGradient)" 
                  strokeWidth="10"
                  strokeDasharray="280"
                  strokeDashoffset="280"
                  className="animate-spin-slow origin-center"
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="35" 
                  fill="url(#aiGradient)"
                  className="animate-pulse"
                />
              </svg>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-white text-xl font-medium"
            >
              {message}
            </motion.div>
            
            <motion.div 
              className="mt-4 w-64 h-2 bg-gray-700 rounded-full overflow-hidden"
              initial={{ scaleX: 0 }}
              animate={{ 
                scaleX: [0, 0.5, 0.7, 1, 0.8, 1],
                transition: { 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }
              }}
            >
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transform origin-left"
              />
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
};

export default AILoader;
