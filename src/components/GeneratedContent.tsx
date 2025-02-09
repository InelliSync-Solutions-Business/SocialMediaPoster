import React, { useState, useEffect, useRef } from 'react';
import { 
  TwitterIcon, 
  LinkedinIcon, 
  FacebookIcon, 
  InstagramIcon,
  MessageSquare,
  Share2,
  Copy,
  RefreshCw,
  Trash2,
  Loader2,
  Send,
  Info,
  MailIcon
} from 'lucide-react';
import { countTokens, getPlatformTokenLimit } from '../utils/tokenUtils';
import AILoader from './AILoader';
import { Tooltip } from '@mui/material'; 
import { ThreadList } from './threads/ThreadList';
import { ThreadPostProps } from './threads/ThreadPost';
import { UserPreferences, PlatformFormats } from '../types/preferences';
import { generateImagePrompt } from '@/utils/prompts/imagePrompt';
import { Platform } from '../utils/platformLimits';

interface GeneratedContentProps {
  activeTab: string;
  content?: string;
  onClear?: () => void;
  onRegenerate?: () => void;
  isLoading?: boolean;
  preferences?: UserPreferences;
  templateTargetAudience?: string;
  templateWritingStyle?: string;
  templateAdditionalGuidelines?: string;
}

type PlatformKey = 'instagram' | 'linkedin' | 'twitter' | 'tiktok' | 'facebook' | 'discord' | 'newsletter';

export interface ThreadPost {
  id: string;
  content: string;
  characterCount: number;
}

export const GeneratedContent: React.FC<GeneratedContentProps> = ({ 
  activeTab, 
  content, 
  onClear, 
  onRegenerate,
  isLoading = false,
  preferences,
  templateTargetAudience,
  templateWritingStyle,
  templateAdditionalGuidelines
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformKey | null>(null);
  const [tokenCount, setTokenCount] = useState(0);
  const [truncatedContent, setTruncatedContent] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const [threads, setThreads] = useState<ThreadPost[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);

  const contentEditableRef = useRef<HTMLDivElement>(null);
  const infoIconRef = useRef<HTMLDivElement>(null);

  const dummyContent = content || "Your generated content will appear here. Fill out the form and click generate to create new content.";
  const platformLimit = activeTab === 'thread-form' ? 280 : getPlatformTokenLimit(activeTab);

  // Format content based on platform preferences
  const formatContentForPlatform = (content: string, platform: PlatformKey): string => {
    if (!content) return '';
    let formattedContent = content;
    const platformFormat = preferences?.platformFormats?.[platform];

    const hasCharacterLimitOptimization = (format: any): format is { characterLimitOptimization: boolean } => 
      format && 'characterLimitOptimization' in format;

    const hasProfessionalTone = (format: any): format is { professionalTone: boolean } => 
      format && 'professionalTone' in format;

    // Don't apply character limit optimization for threads
    if (platform === 'twitter' && activeTab !== 'Threads' && hasCharacterLimitOptimization(platformFormat) && platformFormat.characterLimitOptimization) {
      formattedContent = formattedContent.slice(0, 280);
    }

    if (platform === 'linkedin' && hasProfessionalTone(platformFormat) && platformFormat.professionalTone) {
      formattedContent = formattedContent.split('\n').filter(Boolean).join('\n\n');
    }

    // Only format as threads if the active tab is specifically for threads
    if (activeTab === 'Threads') {
      const threads = formatThreadedPost(formattedContent);
      formattedContent = threads.join('\n\n');
    }

    return formattedContent;
  };

  // New method to parse and format content with HTML tags
  const parseContentWithHTMLTags = (content: string): string => {
    if (!content) return '';

    // Split content into sections, handling both numbered lists and paragraphs
    const sections = content.split(/\n\n/);
    
    let htmlContent = '';
    let headingCount = 0;

    sections.forEach((section, index) => {
      // Check if the section starts with a number (for numbered lists)
      const numberMatch = section.match(/^(\d+)\.\s*(.+)/);
      
      if (numberMatch) {
        // If it's a numbered list item, create an <h3> for the first few items
        if (headingCount < 3) {
          htmlContent += `<h3>${numberMatch[1]}. ${numberMatch[2]}</h3>`;
          headingCount++;
        } else {
          // After the first 3 headings, use <p> tags
          htmlContent += `<p>${section}</p>`;
        }
      } else {
        // For regular paragraphs, use <p> tags
        htmlContent += `<p>${section}</p>`;
      }
    });

    return htmlContent;
  };

  // Thread-specific methods
  const formatThreadedPost = (content: string): string[] => {
    if (!content) return [];
    
    // If content already contains thread separators, use them
    if (content.includes('---')) {
      return content.split('---')
        .map((tweet, index) => tweet.trim())
        .filter(tweet => tweet.length > 0)
        .map((tweet, index) => `${index + 1}/${content.split('---').filter(t => t.trim().length > 0).length} ${tweet}`);
    }
    
    // Otherwise, intelligently split the content into threads
    const MAX_CHARS = 280; // Twitter's character limit
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
    const threads: string[] = [];
    let currentThread = '';
    
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      // Account for thread number in character count (e.g., "1/4 ")
      const threadNumberLength = (threads.length + 2).toString().length * 2 + 2; // "X/Y "
      const potentialThread = currentThread ? `${currentThread} ${trimmedSentence}` : trimmedSentence;
      
      // If adding this sentence would exceed the limit (including thread number), start a new thread
      if ((potentialThread.length + threadNumberLength) > MAX_CHARS && currentThread) {
        threads.push(currentThread.trim());
        currentThread = trimmedSentence;
      } else {
        currentThread = potentialThread;
      }
    }
    
    // Add the last thread if there's content
    if (currentThread) {
      threads.push(currentThread.trim());
    }
    
    // Add thread numbers to each thread
    return threads.map((thread, index) => `${index + 1}/${threads.length} ${thread}`);
  };

  const parseThreads = (content: string): ThreadPost[] => {
    // Split content by numbered points (1., 2., 3., etc)
    const parts = content.split(/\d+\.\s+/);
    
    // Get the introduction (everything before the first number)
    const intro = parts[0];
    
    // Get the numbered points (excluding the intro)
    const points = parts.slice(1);
    
    const threads: ThreadPost[] = [];
    
    // Add intro as the first thread if it's not empty
    if (intro.trim()) {
      threads.push({
        id: `thread-${0}`,
        content: intro.trim(),
        characterCount: intro.trim().length
      });
    }
    
    // Add each point as a separate thread
    points.forEach((point, index) => {
      if (point.trim()) {
        threads.push({
          id: `thread-${index + 1}`,
          content: `${index + 1}. ${point.trim()}`,
          characterCount: point.trim().length
        });
      }
    });
    
    return threads;
  };

  useEffect(() => {
    if (dummyContent) {
      const tokens = countTokens(dummyContent);
      setTokenCount(tokens);
      setEditableContent(dummyContent);
      setCharacterCount(dummyContent.length);

      // Generate hashtags for Instagram if enabled
      if (preferences?.platformFormats?.instagram?.hashtagSuggestions) {
        // This would typically call an API to generate relevant hashtags
        setHashtags(['#content', '#socialmedia', '#digital']);
      }

      if (tokens > platformLimit) {
        console.warn(`Content exceeds recommended token limit for ${activeTab} (${tokens} > ${platformLimit})`);
      }

      // Format content based on selected platform
      const formattedContent = selectedPlatform 
        ? formatContentForPlatform(dummyContent, selectedPlatform)
        : dummyContent;

      setTruncatedContent(formattedContent);
    }
  }, [dummyContent, activeTab, selectedPlatform, preferences]);

  useEffect(() => {
    if (!content) {
      setEditableContent('');
      setCharacterCount(0);
      setThreads([]);
      return;
    }

    if (activeTab === 'thread-form' && Array.isArray(content)) {
      // Handle thread format
      const threadPosts = content.map((post, index) => ({
        id: `thread-${index}`,
        content: post.content,
        characterCount: post.characterCount
      }));
      setThreads(threadPosts);
      setEditableContent(''); // Clear editable content when showing threads
    } else {
      // Handle single post format
      setEditableContent(content);
      setCharacterCount(content.length);
      setThreads([]); // Clear threads when showing single post
    }
  }, [content, activeTab]);

  useEffect(() => {
    // Convert content to threads when content changes
    if (content && activeTab === 'Threads') {
      const threadContent = formatThreadedPost(content);
      const newThreads: ThreadPostProps[] = threadContent.map((content, index) => ({
        id: `thread-${index + 1}`,
        content: content,
        characterCount: content.length,
        likes: 0,
        retweets: 0
      }));

      setThreads(newThreads);
    }
  }, [content, activeTab]);

  const handleContentEdit = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.textContent || '';
    
    // Check character limit
    if (newContent.length > platformLimit) {
      // Prevent typing beyond limit
      e.preventDefault();
      return;
    }

    setEditableContent(newContent);
    setCharacterCount(newContent.length);
  };

  const getCharacterCountColor = () => {
    const percentageFilled = (characterCount / platformLimit) * 100;
    if (percentageFilled < 50) return 'text-green-500';
    if (percentageFilled < 90) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleShare = async (platform: PlatformKey) => {
    // Check if platform is enabled in preferences
    if (platform === 'newsletter') {
      if (preferences?.platformFormats?.newsletter && !preferences.platformFormats.newsletter.emailOptimization) {
        console.warn(`Newsletter is disabled in preferences`);
        return;
      }
    } else {
      if (preferences?.platforms && !preferences.platforms[platform]) {
        console.warn(`Platform ${platform} is disabled in preferences`);
        return;
      }
    }

    setSelectedPlatform(platform);
    
    // Format content with platform-specific preferences
    const formattedContent = formatContentForPlatform(dummyContent, platform);
    const shareText = encodeURIComponent(formattedContent);
    
    // Get platform-specific token limit
    const maxTokens = getPlatformTokenLimit(platform);
    const tokens = countTokens(formattedContent);

    if (tokens > maxTokens) {
      console.warn(`Content exceeds ${platform} token limit (${tokens} > ${maxTokens})`);
    }

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?text=${shareText}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?quote=${shareText}`;
        break;
      case 'instagram':
        shareUrl = `https://www.instagram.com/direct/new/?text=${shareText}`;
        break;
      case 'tiktok':
        shareUrl = `https://www.tiktok.com/create/react?text=${shareText}`;
        break;
      case 'newsletter':
        shareUrl = `mailto:?subject=Newsletter&body=${shareText}`;
        break;
      default:
        console.warn(`Unsupported sharing platform: ${platform}`);
        return;
    }

    // Open share URL in a new window
    window.open(shareUrl, '_blank');
  };

  const handleGenerateImage = async () => {
    // Check if image generation is enabled for Instagram
    if (!preferences?.platformFormats?.instagram?.imageGeneration) {
      setImageError('Image generation is disabled in preferences');
      return;
    }

    if (!content) {
      console.error('No content available for image generation');
      return;
    }

    setIsGeneratingImage(true);
    setImageError(null);
    setImageLoadError(false);
    setGeneratedImageUrl(null);

    try {
      console.log('Starting image generation request...');
      const apiEndpoint = import.meta.env.PROD 
        ? '/api/generateImage'
        : 'http://localhost:3000/api/generateImage';
        
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: generateImagePrompt({ content }),
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      if (!data.success || !data.imageUrl) {
        throw new Error('Invalid response from image generation service');
      }

      setGeneratedImageUrl(data.imageUrl);
      setImageLoadError(false);
    } catch (error: unknown) {
      console.error('Image generation error:', error);
      setImageError(error instanceof Error ? error.message : 'Failed to generate image. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const proxyImageUrl = async (originalUrl: string) => {
    try {
      const response = await fetch(`/api/imageProxy?url=${encodeURIComponent(originalUrl)}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to proxy image');
      }

      const imageBlob = await response.blob();
      return URL.createObjectURL(imageBlob);
    } catch (error) {
      console.error('Error proxying image:', error);
      return null;
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(dummyContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Failed to copy text:', err.message);
      } else {
        console.error('An unknown error occurred');
      }
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

  const handleImageError = () => {
    setImageLoadError(true);
    console.error('Failed to load generated image');
  };

  // Thread-specific methods
  const handleCopyThread = (threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      navigator.clipboard.writeText(thread.content);
      console.log(`Thread ${threadId} copied to clipboard`);
    }
  };

  const handleGenerateThreadImage = async (threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (!thread) return;

    setSelectedThreadId(threadId);
    setIsGeneratingImage(true);
    setImageError(null);
    setImageLoadError(false);
    setGeneratedImageUrl(null);

    try {
      const response = await fetch('/api/generateImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Create an image that visually represents the following social media thread: ${thread.content}`,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImageUrl(data.imageUrl);
    } catch (error) {
      console.error('Thread image generation error:', error);
      setImageError(error instanceof Error ? error.message : 'Failed to generate image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  useEffect(() => {
    // Convert content to threads when content changes
    if (content && activeTab === 'Threads') {
      const threadContent = formatThreadedPost(content);
      const newThreads: ThreadPostProps[] = threadContent.map((content, index) => ({
        id: `thread-${index + 1}`,
        content: content,
        characterCount: content.length,
        likes: 0,
        retweets: 0
      }));

      setThreads(newThreads);
    }
  }, [content, activeTab]);

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

  const renderContent = () => {
    const contentToRender = truncatedContent || dummyContent;
    const htmlFormattedContent = parseContentWithHTMLTags(contentToRender);

    return (
      <div 
        ref={contentEditableRef}
        className={`w-full p-4 bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700 ${isEditing ? 'cursor-text' : 'cursor-default'}`}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        dangerouslySetInnerHTML={{ __html: htmlFormattedContent }}
        onClick={() => setIsEditing(true)}
        onInput={(e) => {
          // Extract plain text content for editing and tracking
          const newContent = e.currentTarget.textContent || '';
          setEditableContent(newContent);
          setCharacterCount(newContent.length);
          
          // Re-parse the edited content to maintain HTML formatting
          const updatedHtmlContent = parseContentWithHTMLTags(newContent);
          e.currentTarget.innerHTML = updatedHtmlContent;
        }}
        onBlur={() => {
          setIsEditing(false);
          // Optional: You can add additional logic here if needed when editing ends
        }}
      />
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Generated {activeTab === 'short-form' ? 'Posts' : activeTab === 'long-form' ? 'Long Form Post' : activeTab === 'image' ? 'Image' : activeTab === 'Threads' ? 'Thread' : activeTab === 'Templates' ? 'Template' : 'Content'}
      </h2>

      <div className="bg-secondary/20 dark:bg-[#1a1b26] rounded-lg p-6 border border-border/50 backdrop-blur-sm shadow-soft dark:shadow-[0_0_15px_rgba(0,0,0,0.1)]">
        {activeTab === 'thread-form' && threads.length > 0 ? (
          <ThreadList 
            threads={threads} 
            onCopyThread={(id) => {
              const thread = threads.find(t => t.id === id);
              if (thread) {
                navigator.clipboard.writeText(thread.content);
              }
            }}
            onGenerateThreadImage={handleGenerateThreadImage}
          />
        ) : (
          renderContent()
        )}
        
        <div className="flex justify-between items-center">
          <div className={`text-sm ${getCharacterCountColor()}`}>
            {characterCount} / {platformLimit} characters
          </div>
          {tokenCount > 0 && (
            <div className="text-xs text-foreground/50 mr-4">
              Tokens: {tokenCount}
            </div>
          )}
          <TooltipWrapper title="Share on Twitter" disabled={isLoading}>
            <button 
              onClick={() => handleShare('twitter')}
              className={`
                p-2 rounded-full 
                ${selectedPlatform === 'twitter' ? 'bg-[#1DA1F2] text-white' : 'hover:bg-secondary/50 dark:hover:bg-secondary/20'}
                transition-colors duration-300
              `}
            >
              <TwitterIcon size={20} />
            </button>
          </TooltipWrapper>
          
          <TooltipWrapper title="Share on LinkedIn" disabled={isLoading}>
            <button 
              onClick={() => handleShare('linkedin')}
              className={`
                p-2 rounded-full 
                ${selectedPlatform === 'linkedin' ? 'bg-[#0A66C2] text-white' : 'hover:bg-secondary/50 dark:hover:bg-secondary/20'}
                transition-colors duration-300
              `}
            >
              <LinkedinIcon size={20} />
            </button>
          </TooltipWrapper>
          
          <TooltipWrapper title="Share on Facebook" disabled={isLoading}>
            <button 
              onClick={() => handleShare('facebook')}
              className={`p-2 rounded-lg transition-colors duration-200
              ${selectedPlatform === 'facebook' ? 'bg-[#1877F2] text-white' : 'hover:bg-secondary/50 dark:hover:bg-secondary/20'}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              <FacebookIcon size={20} />
            </button>
          </TooltipWrapper>
          
          <TooltipWrapper title="Share on Instagram" disabled={isLoading}>
            <button 
              onClick={() => handleShare('instagram')}
              className={`
                p-2 rounded-full 
                ${selectedPlatform === 'instagram' ? 'bg-[#E1306C] text-white' : 'hover:bg-secondary/50 dark:hover:bg-secondary/20'}
                transition-colors duration-300
              `}
            >
              <InstagramIcon size={20} />
            </button>
          </TooltipWrapper>
          
        
          
          <TooltipWrapper title="Share on Newsletter" disabled={isLoading}>
            <button 
              onClick={() => handleShare('newsletter')}
              className={`
                p-2 rounded-full 
                ${selectedPlatform === 'newsletter' ? 'bg-[#4a90e2] text-white' : 'hover:bg-secondary/50 dark:hover:bg-secondary/20'}
                transition-colors duration-300
              `}
            >
              <MailIcon size={20} />
            </button>
          </TooltipWrapper>

          <TooltipWrapper title="Copy Content" disabled={isLoading}>
            <button 
              onClick={copyToClipboard}
              className={`
                p-2 rounded-full 
                ${copied ? 'bg-green-500 text-white' : 'hover:bg-secondary/50 dark:hover:bg-secondary/20'}
                transition-colors duration-300
              `}
            >
              {copied ? <Send size={20} /> : <Copy size={20} />}
            </button>
          </TooltipWrapper>

          <TooltipWrapper title="Clear Content" disabled={isLoading}>
            <button 
              onClick={handleClear}
              className="p-2 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors duration-300"
            >
              <Trash2 size={20} />
            </button>
          </TooltipWrapper>

          <TooltipWrapper title="Regenerate Content" disabled={isLoading}>
            <button 
              onClick={handleRegenerate}
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

          <TooltipWrapper title="Generate Image" disabled={isLoading || !content}>
            <button 
              onClick={handleGenerateImage}
              disabled={isGeneratingImage || !content}
              className={`
                p-2 rounded-full 
                ${isGeneratingImage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary/50 dark:hover:bg-secondary/20'}
                transition-colors duration-300
              `}
            >
              <Loader2 size={20} />
            </button>
          </TooltipWrapper>

          <TooltipWrapper title="Token Information" disabled={isLoading}>
            <div 
              ref={infoIconRef}
              onMouseEnter={() => setShowInfoTooltip(true)}
              onMouseLeave={() => setShowInfoTooltip(false)}
              className="p-2 rounded-full hover:bg-secondary/50 dark:hover:bg-secondary/20 transition-colors duration-300 cursor-help"
            >
              <Info size={20} />
            </div>
          </TooltipWrapper>
        </div>
      </div>

      {(generatedImageUrl || isGeneratingImage) && (
        <div className="w-full flex flex-col items-center justify-center gap-4 mt-4">
          {isGeneratingImage ? (
            <div className="w-full max-w-md">
              <AILoader 
                isLoading={true}
                message="Generating your image with AI..."
                disabled={true}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4">
              {generatedImageUrl && (
                <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={generatedImageUrl}
                    alt="Generated content"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', {
                        url: generatedImageUrl,
                        error: e
                      });
                      setImageLoadError(true);
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', generatedImageUrl);
                      setImageLoadError(false);
                    }}
                  />
                  {imageLoadError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <div className="text-center p-4">
                        <p className="text-sm text-gray-500 mb-2">Failed to load image.</p>
                        <button
                          onClick={handleGenerateImage}
                          className="text-sm text-primary hover:text-primary/80"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
