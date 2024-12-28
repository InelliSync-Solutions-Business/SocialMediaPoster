import React, { useState, useEffect } from 'react';
import { Twitter, Linkedin, Facebook, Copy, Share2, Check, Trash2, RefreshCw } from 'lucide-react';
import { countTokens, truncateToMaxTokens } from '../utils/tokenUtils';

interface GeneratedContentProps {
  activeTab: string;
  content?: string;
  onClear?: () => void;
  onRegenerate?: () => void;
}

export const GeneratedContent: React.FC<GeneratedContentProps> = ({ 
  activeTab, 
  content, 
  onClear, 
  onRegenerate 
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [tokenCount, setTokenCount] = useState(0);
  const [truncatedContent, setTruncatedContent] = useState('');

  const dummyContent = content || "Your generated content will appear here. Fill out the form and click generate to create new content.";

  useEffect(() => {
    if (dummyContent) {
      const tokens = countTokens(dummyContent);
      setTokenCount(tokens);

      // Adjust max tokens based on content type
      const maxTokens = activeTab === 'long-form' ? 500 : 100; // Increased for long-form
      const truncated = truncateToMaxTokens(dummyContent, maxTokens);
      setTruncatedContent(truncated);
    }
  }, [dummyContent, activeTab]);

  const handleShare = async (platform: string) => {
    setSelectedPlatform(platform);
    
    const shareText = encodeURIComponent(dummyContent);
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}&summary=${shareText}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${shareText}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(dummyContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Generated {activeTab === 'short-form' ? 'Posts' : activeTab === 'long-form' ? 'Long Form Post' : 'Thread'}
      </h2>

      <div className="bg-secondary/20 dark:bg-[#1a1b26] rounded-lg p-6 border border-border/50 backdrop-blur-sm shadow-soft dark:shadow-[0_0_15px_rgba(0,0,0,0.1)]">
        <p className="text-foreground/60 dark:text-foreground/50 whitespace-pre-wrap mb-4">{truncatedContent || dummyContent}</p>
        
        <div className="flex space-x-2 items-center">
          {tokenCount > 0 && (
            <div className="text-xs text-foreground/50 mr-4">
              Tokens: {tokenCount}
            </div>
          )}
          <button 
            onClick={() => handleShare('twitter')}
            className={`
              p-2 rounded-full 
              ${selectedPlatform === 'twitter' ? 'bg-[#1DA1F2] text-white' : 'hover:bg-secondary/50 dark:hover:bg-secondary/20'}
              transition-colors duration-300
            `}
          >
            <Twitter size={20} />
          </button>
          
          <button 
            onClick={() => handleShare('linkedin')}
            className={`
              p-2 rounded-full 
              ${selectedPlatform === 'linkedin' ? 'bg-[#0A66C2] text-white' : 'hover:bg-secondary/50 dark:hover:bg-secondary/20'}
              transition-colors duration-300
            `}
          >
            <Linkedin size={20} />
          </button>
          
          <button 
            onClick={() => handleShare('facebook')}
            className={`
              p-2 rounded-full 
              ${selectedPlatform === 'facebook' ? 'bg-[#1877F2] text-white' : 'hover:bg-secondary/50 dark:hover:bg-secondary/20'}
              transition-colors duration-300
            `}
          >
            <Facebook size={20} />
          </button>
          
          <button 
            onClick={copyToClipboard}
            className={`
              p-2 rounded-full 
              ${copied ? 'bg-green-500 text-white' : 'hover:bg-secondary/50 dark:hover:bg-secondary/20'}
              transition-colors duration-300
              flex items-center justify-center
            `}
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>

          {/* Clear Button */}
          <button 
            onClick={handleClear}
            className={`
              p-2 rounded-full 
              hover:bg-secondary/50 dark:hover:bg-secondary/20
              transition-colors duration-300
            `}
            title="Clear Content"
          >
            <Trash2 size={20} />
          </button>

          {/* Regenerate Button */}
          <button 
            onClick={handleRegenerate}
            className={`
              p-2 rounded-full 
              hover:bg-secondary/50 dark:hover:bg-secondary/20
              transition-colors duration-300
            `}
            title="Regenerate Content"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {selectedPlatform && (
        <div className="flex items-center gap-2 text-sm text-foreground/60">
          <Share2 className="w-4 h-4" />
          <span>Opening share dialog for {selectedPlatform}...</span>
        </div>
      )}
    </div>
  );
};

export default GeneratedContent;
