import React, { useState } from 'react';
import { 
  TwitterIcon, 
  LinkedinIcon, 
  FacebookIcon, 
  InstagramIcon,
  MessageSquare,
  MailIcon,
  Heart,
  MessageCircle,
  Share2,
  Repeat2,
  Bookmark,
  MoreHorizontal
} from 'lucide-react';
import { UserPreferences } from '../types/preferences';
import { PlatformKey } from '../types/platforms';
import Avatar from '@mui/material/Avatar';
import { formatTextWithLinks } from '@/utils/textFormatters';

interface PlatformPreviewProps {
  content: string;
  selectedPlatform: PlatformKey | null;
  preferences?: UserPreferences;
  generatedImageUrl?: string | null;
  onPlatformSelect: (platform: PlatformKey) => void;
}

export const PlatformPreview: React.FC<PlatformPreviewProps> = ({
  content,
  selectedPlatform,
  preferences,
  generatedImageUrl,
  onPlatformSelect
}) => {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Generate random engagement metrics
  const getRandomMetric = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const metrics = {
    comments: getRandomMetric(5, 25),
    shares: getRandomMetric(3, 18),
    retweets: getRandomMetric(7, 30)
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const renderPlatformTabs = () => {
    return (
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => onPlatformSelect('twitter')}
          className={`flex items-center p-2 rounded-full transition-colors ${
            selectedPlatform === 'twitter' ? 'bg-[#1DA1F2] text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <TwitterIcon size={20} />
        </button>
        <button
          onClick={() => onPlatformSelect('linkedin')}
          className={`flex items-center p-2 rounded-full transition-colors ${
            selectedPlatform === 'linkedin' ? 'bg-[#0A66C2] text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <LinkedinIcon size={20} />
        </button>
        <button
          onClick={() => onPlatformSelect('instagram')}
          className={`flex items-center p-2 rounded-full transition-colors ${
            selectedPlatform === 'instagram' ? 'bg-[#E1306C] text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <InstagramIcon size={20} />
        </button>
        <button
          onClick={() => onPlatformSelect('facebook')}
          className={`flex items-center p-2 rounded-full transition-colors ${
            selectedPlatform === 'facebook' ? 'bg-[#1877F2] text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <FacebookIcon size={20} />
        </button>
        <button
          onClick={() => onPlatformSelect('newsletter')}
          className={`flex items-center p-2 rounded-full transition-colors ${
            selectedPlatform === 'newsletter' ? 'bg-[#4a90e2] text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <MailIcon size={20} />
        </button>
      </div>
    );
  };

  const renderTwitterPreview = () => {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10">IS</Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-1">
              <span className="font-bold">IntelliSync</span>
              <span className="text-gray-500">@intellisync_ai · 2h</span>
            </div>
            <div className="mt-2 text-sm">
              <div dangerouslySetInnerHTML={formatTextWithLinks(content)} />
            </div>
            
            {generatedImageUrl && (
              <div className="mt-3 rounded-xl overflow-hidden">
                <img 
                  src={generatedImageUrl} 
                  alt="Generated content" 
                  className="w-full h-auto max-h-72 object-cover"
                />
              </div>
            )}
            
            <div className="flex justify-between mt-3 text-gray-500">
              <button className="flex items-center space-x-1 hover:text-blue-500">
                <MessageCircle size={18} />
                <span>{metrics.comments}</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-green-500">
                <Repeat2 size={18} />
                <span>{metrics.retweets}</span>
              </button>
              <button 
                className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                onClick={handleLike}
              >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                <span>{likeCount}</span>
              </button>
              <button 
                className={`flex items-center space-x-1 ${bookmarked ? 'text-blue-500' : 'hover:text-blue-500'}`}
                onClick={handleBookmark}
              >
                <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-500">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLinkedInPreview = () => {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-start space-x-3">
          <Avatar className="h-12 w-12">IS</Avatar>
          <div className="flex-1">
            <div className="flex flex-col">
              <span className="font-bold">IntelliSync Solutions</span>
              <span className="text-gray-500 text-sm">AI & Content Generation · 2h</span>
            </div>
            
            <div className="mt-3 text-sm">
              <div dangerouslySetInnerHTML={formatTextWithLinks(content)} />
            </div>
            
            {generatedImageUrl && (
              <div className="mt-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <img 
                  src={generatedImageUrl} 
                  alt="LinkedIn post" 
                  className="w-full h-auto max-h-80 object-cover"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-200 dark:border-gray-700 text-gray-500">
              <button 
                className={`flex items-center space-x-1 ${isLiked ? 'text-blue-600' : 'hover:text-blue-600'}`}
                onClick={handleLike}
              >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                <span>Like</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-600">
                <MessageCircle size={18} />
                <span>Comment</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-600">
                <Repeat2 size={18} />
                <span>Repost</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-600">
                <Share2 size={18} />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInstagramPreview = () => {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-4 flex items-center space-x-2">
          <div className="relative">
            <Avatar className="h-8 w-8 ring-2 ring-pink-500 ring-offset-2 dark:ring-offset-gray-900">IS</Avatar>
          </div>
          <div className="font-medium">intellisync_ai</div>
          <MoreHorizontal className="ml-auto" size={18} />
        </div>
        
        {generatedImageUrl ? (
          <div className="aspect-square w-full">
            <img 
              src={generatedImageUrl} 
              alt="Instagram post" 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-square w-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center p-6">
            <p className="text-white text-center font-medium text-lg">
              {content.length > 100 ? content.substring(0, 100) + '...' : content}
            </p>
          </div>
        )}
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <button 
                className={isLiked ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}
                onClick={handleLike}
              >
                <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
              </button>
              <button className="text-gray-700 dark:text-gray-200">
                <MessageCircle size={24} />
              </button>
              <button className="text-gray-700 dark:text-gray-200">
                <Share2 size={24} />
              </button>
            </div>
            <button 
              className={bookmarked ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-200'}
              onClick={handleBookmark}
            >
              <Bookmark size={24} fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </div>
          
          <div className="font-medium text-sm mb-1">{likeCount} likes</div>
          
          <div className="text-sm">
            <span className="font-medium">intellisync_ai</span>{' '}
            <span dangerouslySetInnerHTML={formatTextWithLinks(content.length > 120 ? content.substring(0, 120) + '... more' : content)} />
          </div>
          
          <div className="text-gray-500 text-xs mt-2">2 HOURS AGO</div>
        </div>
      </div>
    );
  };

  const renderFacebookPreview = () => {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-4">
          <div className="flex items-start space-x-2">
            <Avatar className="h-10 w-10">IS</Avatar>
            <div>
              <div className="font-medium">IntelliSync Solutions</div>
              <div className="text-gray-500 text-xs">2h · <span>🌎</span></div>
            </div>
            <MoreHorizontal className="ml-auto" size={20} />
          </div>
          
          <div className="mt-3 text-sm">
            <div dangerouslySetInnerHTML={formatTextWithLinks(content)} />
          </div>
        </div>
        
        {generatedImageUrl && (
          <div className="border-t border-b border-gray-200 dark:border-gray-700">
            <img 
              src={generatedImageUrl} 
              alt="Facebook post" 
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}
        
        <div className="p-4">
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <div className="flex items-center space-x-1">
              <div className="bg-blue-500 text-white rounded-full p-1">
                <Heart size={10} fill="currentColor" />
              </div>
              <span>{likeCount}</span>
            </div>
            <div className="flex space-x-4">
              <span>{metrics.comments} comments</span>
              <span>{metrics.shares} shares</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button 
              className={`flex items-center justify-center w-1/3 py-1 rounded-md ${isLiked ? 'text-blue-500' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              onClick={handleLike}
            >
              <Heart size={18} fill={isLiked ? "currentColor" : "none"} className="mr-2" />
              Like
            </button>
            <button className="flex items-center justify-center w-1/3 py-1 text-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <MessageCircle size={18} className="mr-2" />
              Comment
            </button>
            <button className="flex items-center justify-center w-1/3 py-1 text-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <Share2 size={18} className="mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderNewsletterPreview = () => {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 max-w-2xl mx-auto">
        <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">IntelliSync Newsletter</h2>
          <p className="text-gray-500 text-sm mt-1">The latest insights on content creation and social media</p>
        </div>
        
        <div className="prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
          
          {generatedImageUrl && (
            <div className="my-4 flex justify-center">
              <img 
                src={generatedImageUrl} 
                alt="Newsletter featured image" 
                className="max-w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-500 text-sm"> 2025 IntelliSync Solutions. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-3">
            <a href="#" className="text-blue-500 hover:text-blue-600">Unsubscribe</a>
            <a href="#" className="text-blue-500 hover:text-blue-600">Preferences</a>
            <a href="#" className="text-blue-500 hover:text-blue-600">View in browser</a>
          </div>
        </div>
      </div>
    );
  };

  const renderPlatformPreview = () => {
    if (!selectedPlatform) return null;
    
    switch (selectedPlatform) {
      case 'twitter':
        return renderTwitterPreview();
      case 'linkedin':
        return renderLinkedInPreview();
      case 'instagram':
        return renderInstagramPreview();
      case 'facebook':
        return renderFacebookPreview();
      case 'newsletter':
        return renderNewsletterPreview();
      default:
        return null;
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-medium">Platform Preview</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Select a platform to see how your content will appear
      </p>
      
      {renderPlatformTabs()}
      
      <div className="mt-4">
        {selectedPlatform ? (
          renderPlatformPreview()
        ) : (
          <div className="bg-secondary/20 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Select a platform above to preview your content
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformPreview;
