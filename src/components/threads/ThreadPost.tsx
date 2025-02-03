import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Image as LucideImage, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ThreadPostProps {
  id: string;
  content: string;
  characterCount: number;
  author?: string;
  timestamp?: string;
  onCopy?: (id: string) => void;
  onGenerateImage?: (id: string) => void;
}

export const ThreadPost: React.FC<ThreadPostProps> = ({
  id,
  content,
  characterCount,
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
              transition-colors duration-200
              ${isCopied ? 'bg-green-100 dark:bg-green-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
            `}
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-gray-500" />
            )}
          </Button>
          {onGenerateImage && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onGenerateImage(id)}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LucideImage className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{content}</p>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {characterCount}/280 characters
      </div>
    </motion.div>
  );
};
