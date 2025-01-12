import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Image as LucideImage } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ThreadPostProps {
  id: string;
  content: string;
  author?: string;
  timestamp?: string;
  onCopy?: (id: string) => void;
  onGenerateImage?: (id: string) => void;
}

export const ThreadPost: React.FC<ThreadPostProps> = ({
  id,
  content,
  author = 'AI Assistant',
  timestamp = new Date().toLocaleString(),
  onCopy,
  onGenerateImage
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    onCopy?.(id);
    
    // Reset copied state after 2 seconds
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 relative"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{author}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{timestamp}</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleCopy}
            className={`
              ${isCopied ? 'text-green-500' : 'text-gray-500'}
              hover:bg-gray-100 dark:hover:bg-gray-700
            `}
            aria-label="Copy thread content"
          >
            <Copy className="h-4 w-4" />
          </Button>
          {onGenerateImage && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => onGenerateImage(id)}
              className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Generate image for thread"
            >
              <LucideImage className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {content}
      </p>
    </motion.div>
  );
};
