import React, { useState, useEffect, useRef } from 'react';
import { 
  TwitterIcon, 
  LinkedinIcon, 
  FacebookIcon, 
  InstagramIcon,
 
  Share2,
  Copy,
  RefreshCw,
  Trash2,
  Loader2,
  Send,
  Info,
  MailIcon,
  Image
} from 'lucide-react';
import { countTokens, getPlatformTokenLimit } from '../utils/tokenUtils';
import AILoader from './AILoader';
import { Tooltip } from '@mui/material'; 
import { ThreadList } from './threads/ThreadList';
import { ThreadPostProps } from './threads/ThreadPost';
import { UserPreferences, PlatformFormats } from '../types/preferences';
import { generateImagePrompt } from '@/utils/prompts/promptManager';
import { formatContentForPlatform } from '@/utils/platformFormatters';
import { parseContentWithHTMLTags, formatThreadedPost, parseThreads } from '@/utils/textFormatters';

import { PlatformKey } from '../types/platforms';
import PlatformPreview from './PlatformPreview';

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
  const [showPreview, setShowPreview] = useState(false);

  const contentEditableRef = useRef<HTMLDivElement>(null);
  const infoIconRef = useRef<HTMLDivElement>(null);

  const dummyContent = content || "Your generated content will appear here. Fill out the form and click generate to create new content.";
  const platformLimit = activeTab === 'thread-form' ? 280 : getPlatformTokenLimit(activeTab);

  useEffect(() => {
    if (dummyContent) {
      const tokens = countTokens(dummyContent);
      setTokenCount(tokens);
      setEditableContent(dummyContent);
      setCharacterCount(dummyContent.length);

      // Generate hashtags for Instagram if enabled
      if (preferences?.platforms?.instagram?.hashtagSuggestions) {
        // This would typically call an API to generate relevant hashtags
        setHashtags(['#content', '#socialmedia', '#digital']);
      }

      if (tokens > platformLimit) {
        console.warn(`Content exceeds recommended token limit for ${activeTab} (${tokens} > ${platformLimit})`);
      }

      // Format content based on selected platform
      const formattedContent = selectedPlatform 
        ? formatContentForPlatform(dummyContent, selectedPlatform, preferences?.platformPreferences)
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
      if (preferences?.platforms?.newsletter && !preferences.platforms.newsletter.templateCustomization) {
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
    const formattedContent = formatContentForPlatform(dummyContent, platform, preferences?.platformPreferences);
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
    if (!preferences?.platforms?.instagram?.imageFormat) {
      setImageError('Image generation is disabled in preferences');
      return;
    }

    if (isGeneratingImage) {
      return;
    }

    setIsGeneratingImage(true);
    setImageError(null);
    setImageLoadError(false);

    try {
      // Generate an image prompt based on the content
      const imagePromptParams = {
        content: content || '',
        style: preferences?.platforms?.instagram?.style || 'realistic',
        format: 'social-media',
        platform: activeTab.toLowerCase().replace('-form', '') as 'twitter' | 'linkedin' | 'facebook' | 'instagram',
        topic: content?.substring(0, 100) || '',
        audience: preferences?.targetAudience || 'general audience',
        mood: 'neutral',
        aspectRatio: preferences?.platforms?.instagram?.imageFormat || '1:1'
      };
      
      // Get the string prompt from the prompt builder
      const imagePrompt = generateImagePrompt(imagePromptParams);

      console.log('Generated image prompt:', imagePrompt);

      // Call the real API endpoint
      const response = await fetch('/api/generateImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: typeof imagePrompt === 'string' ? imagePrompt : JSON.stringify(imagePrompt),
          content: content || '',
          style: 'professional',
          format: 'social-media',
          platform: activeTab.toLowerCase().replace('-form', '') as 'twitter' | 'linkedin' | 'facebook' | 'instagram',
          model: 'dall-e-3' // Default to DALL-E 3 for better quality images
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Image generation failed:', errorData);
        throw new Error(errorData.error || `Image generation failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate image');
      }
      
      setGeneratedImageUrl(data.imageUrl);
      setIsGeneratingImage(false);
    } catch (error) {
      console.error('Error generating image:', error);
      setImageError('Failed to generate image. Please try again.');
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
          content: thread.content,
          style: 'professional',
          format: 'social-media',
          platform: 'twitter',
          model: 'dall-e-3' // Default to DALL-E 3 for better quality images
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Image generation failed:', errorData);
        throw new Error(errorData.error || `Image generation failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate image');
      }
      
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
            },
            disabled: true
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
    // Handle case where content is not yet available
    if (!dummyContent || dummyContent === "Your generated content will appear here. Fill out the form and click generate to create new content.") {
      return (
        <div className="w-full p-4 bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700 text-muted-foreground">
          <p>Your generated content will appear here. Fill out the form and click generate to create new content.</p>
        </div>
      );
    }

    // Check if content is an error message from the AI
    if (dummyContent.includes("Could you please provide the details") || 
        dummyContent.includes("missing") || 
        dummyContent.startsWith("It seems like")) {
      return (
        <div className="w-full p-4 bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700 text-foreground">
          <div className="p-4 border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-yellow-800 dark:text-yellow-200">
            <h3 className="font-medium mb-2">Additional Information Needed</h3>
            <p>{dummyContent}</p>
          </div>
        </div>
      );
    }

    // Normal content display
    const contentToRender = truncatedContent || dummyContent;
    const htmlFormattedContent = parseContentWithHTMLTags(contentToRender);

    return (
      <div 
        ref={contentEditableRef}
        className={`w-full p-4 bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700 ${isEditing ? 'cursor-text' : 'cursor-default'} formatted-content`}
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
        style={{
          lineHeight: '1.6',
          fontSize: '1rem',
        }}
      />
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold gradient-text">
        Generated {activeTab === 'short-form' ? 'Posts' : activeTab === 'long-form' ? 'Long Form Post' : activeTab === 'image' ? 'Image' : activeTab === 'Threads' ? 'Thread' : activeTab === 'Templates' ? 'Template' : 'Content'}
      </h2>

      <div className="bg-card-gradient rounded-lg p-6 border border-border/50 backdrop-blur-sm shadow-primary/10 dark:shadow-[0_0_15px_rgba(0,0,0,0.1)]">
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
        
        <div className="flex justify-between items-center mt-4">
          <div className={`text-sm ${getCharacterCountColor()} font-medium`}>
            {characterCount} / {platformLimit} characters
          </div>
          {tokenCount > 0 && (
            <div className="text-xs text-foreground/60 mr-4">
              Tokens: {tokenCount}
            </div>
          )}
          <div className="flex items-center gap-2">
            <TooltipWrapper title="Share on Twitter" disabled={isLoading}>
              <button 
                onClick={() => handleShare('twitter')}
                className={`
                  p-2 rounded-full 
                  ${selectedPlatform === 'twitter' ? 'bg-gradient-primary text-white shadow-primary' : 'hover:bg-card-hover-gradient hover:shadow-soft'}
                  transition-all duration-300
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
                  ${selectedPlatform === 'linkedin' ? 'bg-gradient-primary text-white shadow-primary' : 'hover:bg-card-hover-gradient hover:shadow-soft'}
                  transition-all duration-300
                `}
              >
                <LinkedinIcon size={20} />
              </button>
            </TooltipWrapper>
            
            <TooltipWrapper title="Share on Facebook" disabled={isLoading}>
              <button 
                onClick={() => handleShare('facebook')}
                className={`p-2 rounded-full transition-all duration-300
                ${selectedPlatform === 'facebook' ? 'bg-gradient-primary text-white shadow-primary' : 'hover:bg-card-hover-gradient hover:shadow-soft'}
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
                  ${selectedPlatform === 'instagram' ? 'bg-gradient-primary text-white shadow-primary' : 'hover:bg-card-hover-gradient hover:shadow-soft'}
                  transition-all duration-300
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
                  ${selectedPlatform === 'newsletter' ? 'bg-gradient-primary text-white shadow-primary' : 'hover:bg-card-hover-gradient hover:shadow-soft'}
                  transition-all duration-300
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
                  ${copied ? 'bg-gradient-success text-white shadow-success' : 'hover:bg-card-hover-gradient hover:shadow-soft'}
                  transition-all duration-300
                `}
              >
                {copied ? <Send size={20} /> : <Copy size={20} />}
              </button>
            </TooltipWrapper>

            <TooltipWrapper title="Clear Content" disabled={isLoading}>
              <button 
                onClick={handleClear}
                className="p-2 rounded-full hover:bg-gradient-destructive hover:text-white hover:shadow-destructive transition-all duration-300"
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
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-card-hover-gradient hover:shadow-soft'}
                  transition-all duration-300
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
                  ${isGeneratingImage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-card-hover-gradient hover:shadow-soft'}
                  transition-all duration-300
                `}
              >
                {isGeneratingImage ? <Loader2 className="animate-spin" size={20} /> : <Image size={20} />}
              </button>
            </TooltipWrapper>

            <TooltipWrapper title="Toggle Preview" disabled={isLoading}>
              <button 
                onClick={() => setShowPreview(!showPreview)}
                className={`
                  p-2 rounded-full 
                  ${showPreview ? 'bg-gradient-primary text-white shadow-primary' : 'hover:bg-card-hover-gradient hover:shadow-soft'}
                  transition-all duration-300
                `}
              >
                <Share2 size={20} />
              </button>
            </TooltipWrapper>

            <TooltipWrapper title="Token Information" disabled={isLoading}>
              <div 
                ref={infoIconRef}
                onMouseEnter={() => setShowInfoTooltip(true)}
                onMouseLeave={() => setShowInfoTooltip(false)}
                className="p-2 rounded-full hover:bg-card-hover-gradient hover:shadow-soft transition-all duration-300 cursor-help"
              >
                <Info size={20} />
              </div>
            </TooltipWrapper>
          </div>
        </div>
      </div>

      {/* Platform Preview */}
      {showPreview && dummyContent && (
        <div className="mt-4 bg-card-gradient rounded-lg p-6 border border-border/50 backdrop-blur-sm shadow-primary/10 dark:shadow-[0_0_15px_rgba(0,0,0,0.1)]">
          <PlatformPreview 
            content={dummyContent}
            selectedPlatform={selectedPlatform}
            preferences={preferences}
            generatedImageUrl={generatedImageUrl}
            onPlatformSelect={setSelectedPlatform}
          />
        </div>
      )}

      {(generatedImageUrl || isGeneratingImage) && !showPreview && (
        <div className="w-full flex flex-col items-center justify-center gap-4 mt-4 bg-card-gradient rounded-lg p-6 border border-border/50 backdrop-blur-sm shadow-primary/10 dark:shadow-[0_0_15px_rgba(0,0,0,0.1)]">
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
                <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden shadow-primary">
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
                    <div className="absolute inset-0 flex items-center justify-center bg-card-gradient">
                      <div className="text-center p-4">
                        <p className="text-sm text-foreground/70 mb-2">Failed to load image.</p>
                        <button
                          onClick={handleGenerateImage}
                          className="text-sm text-primary hover:text-primary/80 font-medium"
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

      {selectedPlatform && !showPreview && (
        <div className="flex items-center gap-2 text-sm text-foreground/60 mt-2">
          <Share2 className="w-4 h-4" />
          <span>Opening share dialog for {selectedPlatform}...</span>
        </div>
      )}
    </div>
  );
};

export default GeneratedContent;
