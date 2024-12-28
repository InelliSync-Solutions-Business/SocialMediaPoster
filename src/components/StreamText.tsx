import React, { useState, useEffect } from 'react';

interface StreamTextProps {
  text: string;
  speed?: number;
  className?: string;
}

const StreamText: React.FC<StreamTextProps> = ({ 
  text, 
  speed = 100, // Default to 100ms between characters
  className = '' 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset state if text changes
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    // If we haven't displayed the full text
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        // Add next character
        setDisplayedText(prev => prev + text[currentIndex]);
        // Move to next index
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      // Text is fully displayed
      setIsComplete(true);
    }
  }, [currentIndex, text, speed]);

  return (
    <span 
      className={`${className} ${isComplete ? 'cursor-default' : 'typing-cursor'}`}
      aria-label={text}
    >
      {displayedText}
    </span>
  );
};

export default StreamText;
