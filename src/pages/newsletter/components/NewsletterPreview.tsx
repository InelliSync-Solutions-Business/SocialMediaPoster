import React, { useState, useRef } from 'react';
import { Newsletter, GeneratedNewsletter } from '../types/newsletter';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Copy, 
  Send, 
  RefreshCw, 
  Trash2,
  MailIcon,
  Share2,
  Info
} from 'lucide-react';
import { Tooltip } from '@mui/material';
import { countTokens } from '@/utils/tokenUtils';

interface NewsletterPreviewProps {
  newsletter?: Newsletter;
  generatedContent?: GeneratedNewsletter;
  isLoading?: boolean;
  onRegenerate?: () => void;
  onClear?: () => void;
  onUpdateContent?: (content: string) => void;
  streamingState?: {
    content: string;
    isDone: boolean;
  };
}

export const NewsletterPreview: React.FC<NewsletterPreviewProps> = ({
  newsletter,
  generatedContent,
  isLoading,
  onRegenerate,
  onClear,
  onUpdateContent,
  streamingState
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'email' | null>(null);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    const contentToCopy = streamingState?.content || generatedContent?.content;
    if (contentToCopy) {
      navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    const contentToShare = streamingState?.content || generatedContent?.content;
    if (contentToShare) {
      setSelectedPlatform('email');
      const mailtoLink = `mailto:?subject=Newsletter Content&body=${encodeURIComponent(contentToShare)}`;
      window.open(mailtoLink, '_blank');
      setTimeout(() => setSelectedPlatform(null), 2000);
    }
  };

  const handleContentEdit = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.textContent || '';
    if (onUpdateContent) {
      onUpdateContent(newContent);
    }
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Focus the contentEditable div when entering edit mode
      setTimeout(() => contentEditableRef.current?.focus(), 0);
    }
  };

  // Utility component to wrap disabled buttons
  const TooltipWrapper: React.FC<{ 
    children: React.ReactElement; 
    title: string; 
    disabled?: boolean; 
  }> = ({ children, title, disabled }) => {
    return disabled ? (
      <Tooltip title={title}>
        <span style={{ cursor: 'not-allowed', display: 'inline-block' }}>
          {React.cloneElement(children, { 
            style: { 
              ...children.props.style, 
              pointerEvents: 'none', 
              opacity: 0.5 
            } 
          })}
        </span>
      </Tooltip>
    ) : (
      <Tooltip title={title}>
        {children}
      </Tooltip>
    );
  };

  if (!newsletter && !generatedContent && !isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <p>Fill out the form to generate your newsletter content</p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!generatedContent) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <p>Generated content will appear here</p>
        </div>
      </Card>
    );
  }

  const characterCount = generatedContent.content.length;
  const tokenCount = countTokens(generatedContent.content);

  return (
    <Card className="p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">
          {characterCount} / 5000 characters • {tokenCount} tokens
        </div>
        <div className="flex items-center space-x-2">
          <TooltipWrapper title={copied ? 'Copied!' : 'Copy'} disabled={isLoading}>
            <button 
              onClick={handleCopy}
              disabled={isLoading}
              className={`
                p-2 rounded-full 
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary/50 dark:hover:bg-secondary/20'}
                transition-colors duration-300
              `}
            >
              <Copy size={20} />
            </button>
          </TooltipWrapper>

          <TooltipWrapper title="Share via Email" disabled={isLoading}>
            <button 
              onClick={handleShare}
              disabled={isLoading}
              className={`
                p-2 rounded-full 
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary/50 dark:hover:bg-secondary/20'}
                transition-colors duration-300
              `}
            >
              <Send size={20} />
            </button>
          </TooltipWrapper>

          {onRegenerate && (
            <TooltipWrapper title="Regenerate" disabled={isLoading}>
              <button 
                onClick={onRegenerate}
                disabled={isLoading}
                className={`
                  p-2 rounded-full 
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary/50 dark:hover:bg-secondary/20'}
                  transition-colors duration-300
                `}
              >
                <RefreshCw size={20} />
              </button>
            </TooltipWrapper>
          )}

          {onClear && (
            <TooltipWrapper title="Clear" disabled={isLoading}>
              <button 
                onClick={onClear}
                disabled={isLoading}
                className={`
                  p-2 rounded-full 
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary/50 dark:hover:bg-secondary/20'}
                  transition-colors duration-300
                `}
              >
                <Trash2 size={20} />
              </button>
            </TooltipWrapper>
          )}

          <TooltipWrapper title="Token Information" disabled={isLoading}>
            <div 
              onMouseEnter={() => setShowInfoTooltip(true)}
              onMouseLeave={() => setShowInfoTooltip(false)}
              className="p-2 rounded-full hover:bg-secondary/50 dark:hover:bg-secondary/20 transition-colors duration-300 cursor-help"
            >
              <Info size={20} />
            </div>
          </TooltipWrapper>
        </div>
      </div>

      <div className="prose max-w-none">
        <div
          ref={contentEditableRef}
          contentEditable={isEditing}
          onInput={handleContentEdit}
          suppressContentEditableWarning
          className={`whitespace-pre-wrap text-sm ${isEditing ? 'border border-blue-500 rounded p-2 focus:outline-none' : ''}`}
        >
          {streamingState?.content || generatedContent?.content}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500 flex items-center justify-between">
        <div className="flex items-center">
          <MailIcon size={16} className="mr-2" />
          Newsletter Preview
        </div>
        {selectedPlatform && (
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            <span>Opening email client...</span>
          </div>
        )}
      </div>
    </Card>
  );
};
