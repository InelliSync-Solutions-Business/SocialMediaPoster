import React, { useState, useEffect, useRef } from 'react';
import { Twitter, Linkedin, Facebook, Copy, Share2, Check, Trash2, RefreshCw, Image as ImageIcon, Info } from 'lucide-react';
import { countTokens, getPlatformTokenLimit } from '../utils/tokenUtils';
import AILoader from './AILoader';
import { Tooltip } from '@mui/material'; // Assuming you have installed @mui/material

interface GeneratedContentProps {
  activeTab: string;
  content?: string;
  onClear?: () => void;
  onRegenerate?: () => void;
  isLoading?: boolean;
}

export const GeneratedContent: React.FC<GeneratedContentProps> = ({ 
  activeTab, 
  content, 
  onClear, 
  onRegenerate,
  isLoading = false
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [tokenCount, setTokenCount] = useState(0);
  const [truncatedContent, setTruncatedContent] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  // New states for inline editing
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);

  const contentEditableRef = useRef<HTMLDivElement>(null);
  const infoIconRef = useRef<HTMLDivElement>(null);

  const dummyContent = content || "Your generated content will appear here. Fill out the form and click generate to create new content.";
  const platformLimit = getPlatformTokenLimit(activeTab);

  useEffect(() => {
    if (dummyContent) {
      const tokens = countTokens(dummyContent);
      setTokenCount(tokens);
      setEditableContent(dummyContent);
      setCharacterCount(dummyContent.length);

      // Optional: Add a warning or handling for token limits
      if (tokens > platformLimit) {
        console.warn(`Content exceeds recommended token limit for ${activeTab} (${tokens} > ${platformLimit})`);
      }

      setTruncatedContent(dummyContent);
    }
  }, [dummyContent, activeTab]);

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

  const handleShare = async (platform: string) => {
    setSelectedPlatform(platform);
    
    // Get platform-specific token limit
    const maxTokens = getPlatformTokenLimit(platform);
    const tokens = countTokens(dummyContent);

    // Warn if content exceeds platform limit
    if (tokens > maxTokens) {
      // Optional: Implement truncation or show a warning
      console.warn(`Content exceeds ${platform} token limit (${tokens} > ${maxTokens})`);
      // You could optionally truncate here if needed
      // const truncatedContent = truncateToMaxTokens(dummyContent, maxTokens);
    }
    
    const shareText = encodeURIComponent(dummyContent);
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
      default:
        console.warn(`Unsupported sharing platform: ${platform}`);
        return;
    }

    // Open share URL in a new window
    window.open(shareUrl, '_blank');
  };

  const handleGenerateImage = async () => {
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
      const response = await fetch('/api/generateImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Create an image that visually represents the following social media content: ${content}`,
          quality: 'hd',
          size: '1024x1024',
          style: 'vivid'
        })
      });

      const responseText = await response.text();
      console.log('Raw image generation response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse image generation response:', parseError);
        throw new Error(`Server returned invalid JSON: ${responseText}`);
      }

      if (!response.ok) {
        console.error('Image generation failed:', data);
        throw new Error(data.error || 'Failed to generate image');
      }

      console.log('Image generation successful:', data);
      
      // Verify the image URL
      if (!data.imageUrl) {
        console.error('No image URL in response:', data);
        throw new Error('No image URL in response');
      }

      // Log the URL we're about to set
      console.log('Setting image URL:', {
        url: data.imageUrl
      });
      
      // Set the image URL and verify it loads
      const img = new Image();
      img.onerror = () => {
        console.error('Failed to load image from URL:', data.imageUrl);
        setImageLoadError(true);
        setImageError('Failed to load the generated image');
      };
      img.onload = () => {
        console.log('Image loaded successfully');
        setImageLoadError(false);
        setGeneratedImageUrl(data.imageUrl);
      };
      img.src = data.imageUrl;
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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Generated {activeTab === 'short-form' ? 'Posts' : activeTab === 'long-form' ? 'Long Form Post' : activeTab === 'image' ? 'Image' : 'Thread'}
      </h2>

      <div className="bg-secondary/20 dark:bg-[#1a1b26] rounded-lg p-6 border border-border/50 backdrop-blur-sm shadow-soft dark:shadow-[0_0_15px_rgba(0,0,0,0.1)]">
        <div 
          ref={contentEditableRef}
          contentEditable={isEditing}
          onInput={handleContentEdit}
          onClick={() => setIsEditing(true)}
          className={`
            ${isEditing ? 'border-2 border-blue-500' : 'border-2 border-transparent'}
            p-2 rounded-md cursor-text
          `}
        >
          {editableContent}
        </div>

        {/* Character Count and Info Icon */}
        <div className="flex items-center justify-between mt-2">
          <div 
            ref={infoIconRef}
            className="relative"
            onMouseEnter={() => setShowInfoTooltip(true)}
            onMouseLeave={() => setShowInfoTooltip(false)}
          >
            {showInfoTooltip && (
              <Tooltip 
                title="Edit your generated content. Formatting and character limits apply based on the selected platform."
                placement="top"
              >
                <span>
                  <Info className="w-5 h-5 text-gray-500 cursor-help" />
                </span>
              </Tooltip>
            )}
            {!showInfoTooltip && (
              <Info className="w-5 h-5 text-gray-500 cursor-help" />
            )}
          </div>
          
          <div className={`text-sm ${getCharacterCountColor()}`}>
            {characterCount} / {platformLimit} characters
          </div>
        </div>

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

          {/* Image Generation Button */}
          <button 
            onClick={handleGenerateImage}
            disabled={isGeneratingImage || !content}
            className={`
              p-2 rounded-full 
              ${isGeneratingImage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary/50 dark:hover:bg-secondary/20'}
              transition-colors duration-300
              flex items-center justify-center
            `}
            title="Generate Image from Content"
          >
            <ImageIcon size={20} />
          </button>
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
