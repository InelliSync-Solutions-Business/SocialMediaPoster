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
          className={`flex items-center p-2 rounded-full transition-all ${
            selectedPlatform === 'twitter' ? 'bg-gradient-primary text-white shadow-primary' : 'hover:bg-card-hover-gradient hover:shadow-soft'
          }`}
        >
          <TwitterIcon size={20} />
        </button>
        <button
          onClick={() => onPlatformSelect('linkedin')}
          className={`flex items-center p-2 rounded-full transition-all ${
            selectedPlatform === 'linkedin' ? 'bg-gradient-primary text-white shadow-primary' : 'hover:bg-card-hover-gradient hover:shadow-soft'
          }`}
        >
          <LinkedinIcon size={20} />
        </button>
        <button
          onClick={() => onPlatformSelect('instagram')}
          className={`flex items-center p-2 rounded-full transition-all ${
            selectedPlatform === 'instagram' ? 'bg-gradient-primary text-white shadow-primary' : 'hover:bg-card-hover-gradient hover:shadow-soft'
          }`}
        >
          <InstagramIcon size={20} />
        </button>
        <button
          onClick={() => onPlatformSelect('facebook')}
          className={`flex items-center p-2 rounded-full transition-all ${
            selectedPlatform === 'facebook' ? 'bg-gradient-primary text-white shadow-primary' : 'hover:bg-card-hover-gradient hover:shadow-soft'
          }`}
        >
          <FacebookIcon size={20} />
        </button>
        <button
          onClick={() => onPlatformSelect('newsletter')}
          className={`flex items-center p-2 rounded-full transition-all ${
            selectedPlatform === 'newsletter' ? 'bg-gradient-primary text-white shadow-primary' : 'hover:bg-card-hover-gradient hover:shadow-soft'
          }`}
        >
          <MailIcon size={20} />
        </button>
      </div>
    );
  };

  const renderTwitterPreview = () => {
    return (
      <div className="bg-card-gradient rounded-xl p-4 border border-border/50 shadow-primary/10">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10 shadow-soft">IS</Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-1">
              <span className="font-bold gradient-text">IntelliSync</span>
              <span className="text-foreground/60">@intellisync_ai · 2h</span>
            </div>
            <div className="mt-2 text-sm">
              <div dangerouslySetInnerHTML={formatTextWithLinks(content)} />
            </div>
            
            {generatedImageUrl && (
              <div className="mt-3 rounded-xl overflow-hidden shadow-primary">
                <img 
                  src={generatedImageUrl} 
                  alt="Generated content" 
                  className="w-full h-auto max-h-72 object-cover"
                />
              </div>
            )}
            
            <div className="flex justify-between mt-3 text-foreground/60">
              <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                <MessageCircle size={18} />
                <span>{metrics.comments}</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-accent transition-colors">
                <Repeat2 size={18} />
                <span>{metrics.retweets}</span>
              </button>
              <button 
                className={`flex items-center space-x-1 ${isLiked ? 'text-destructive' : 'hover:text-destructive'} transition-colors`}
                onClick={handleLike}
              >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                <span>{likeCount}</span>
              </button>
              <button 
                className={`flex items-center space-x-1 ${bookmarked ? 'text-primary' : 'hover:text-primary'} transition-colors`}
                onClick={handleBookmark}
              >
                <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
              </button>
              <button className="flex items-center space-x-1 hover:text-primary transition-colors">
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
      <div className="bg-card-gradient rounded-lg p-4 border border-border/50 shadow-primary/10">
        <div className="flex items-start space-x-3">
          <Avatar className="h-12 w-12 shadow-soft">IS</Avatar>
          <div className="flex-1">
            <div className="flex flex-col">
              <span className="font-bold gradient-text">IntelliSync Solutions</span>
              <span className="text-foreground/60 text-sm">AI & Content Generation · 2h</span>
            </div>
            
            <div className="mt-3 text-sm">
              <div dangerouslySetInnerHTML={formatTextWithLinks(content)} />
            </div>
            
            {generatedImageUrl && (
              <div className="mt-3 rounded-lg overflow-hidden border border-border/50 shadow-primary">
                <img 
                  src={generatedImageUrl} 
                  alt="LinkedIn post" 
                  className="w-full h-auto max-h-80 object-cover"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between mt-4 pt-2 border-t border-border/50 text-foreground/60">
              <button 
                className={`flex items-center space-x-1 ${isLiked ? 'text-primary' : 'hover:text-primary'} transition-colors`}
                onClick={handleLike}
              >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                <span>Like</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                <MessageCircle size={18} />
                <span>Comment</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                <Repeat2 size={18} />
                <span>Repost</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-primary transition-colors">
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
      <div className="bg-card-gradient rounded-lg overflow-hidden border border-border/50 shadow-primary/10">
        <div className="p-3 flex items-center space-x-2 border-b border-border/50">
          <Avatar className="h-8 w-8 shadow-soft">IS</Avatar>
          <span className="font-semibold gradient-text">intellisync_solutions</span>
          <div className="ml-auto">
            <MoreHorizontal size={20} />
          </div>
        </div>
        
        {generatedImageUrl ? (
          <div className="aspect-square bg-black">
            <img 
              src={generatedImageUrl} 
              alt="Instagram post" 
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="aspect-square bg-gradient-subtle flex items-center justify-center p-6 text-center">
            <div dangerouslySetInnerHTML={formatTextWithLinks(content)} />
          </div>
        )}
        
        <div className="p-3">
          <div className="flex justify-between mb-2">
            <div className="flex space-x-4">
              <button 
                className={`${isLiked ? 'text-destructive' : ''} transition-colors`}
                onClick={handleLike}
              >
                <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
              </button>
              <button className="transition-colors hover:text-primary">
                <MessageCircle size={24} />
              </button>
              <button className="transition-colors hover:text-primary">
                <Share2 size={24} />
              </button>
            </div>
            <button 
              className={`${bookmarked ? 'text-primary' : ''} transition-colors`}
              onClick={handleBookmark}
            >
              <Bookmark size={24} fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </div>
          
          <div className="text-sm">
            <p className="font-semibold">
              {likeCount || getRandomMetric(50, 500)} likes
            </p>
            <p>
              <span className="font-semibold gradient-text">intellisync_solutions</span>{' '}
              <span className="text-sm">
                {content.length > 100 ? content.substring(0, 100) + '...' : content}
              </span>
            </p>
            <p className="text-foreground/60 text-xs mt-1">
              View all {getRandomMetric(5, 30)} comments
            </p>
            <p className="text-foreground/60 text-xs mt-2">
              2 HOURS AGO
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderFacebookPreview = () => {
    return (
      <div className="bg-card-gradient rounded-lg overflow-hidden border border-border/50 shadow-primary/10">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Avatar className="h-10 w-10 shadow-soft">IS</Avatar>
            <div>
              <div className="font-semibold gradient-text">IntelliSync Solutions</div>
              <div className="text-foreground/60 text-xs">2h · <span className="rounded-full inline-flex items-center justify-center h-4 w-4 bg-foreground/10"><span className="sr-only">Public</span>🌎</span></div>
            </div>
            <div className="ml-auto">
              <MoreHorizontal size={20} />
            </div>
          </div>
          
          <div className="mb-3">
            <div dangerouslySetInnerHTML={formatTextWithLinks(content)} />
          </div>
          
          {generatedImageUrl && (
            <div className="rounded-lg overflow-hidden border border-border/50 mb-3 shadow-primary">
              <img 
                src={generatedImageUrl} 
                alt="Facebook post" 
                className="w-full h-auto"
              />
            </div>
          )}
          
          <div className="flex justify-between text-foreground/60 text-sm py-2 border-t border-b border-border/50">
            <div className="flex items-center">
              <span className="flex items-center">
                <Heart size={16} className="text-destructive mr-1" fill="currentColor" />
                <span>{getRandomMetric(5, 50)}</span>
              </span>
            </div>
            <div>
              <span className="mr-3">{getRandomMetric(1, 10)} comments</span>
              <span>{getRandomMetric(0, 5)} shares</span>
            </div>
          </div>
          
          <div className="flex justify-between pt-1 text-foreground/60">
            <button 
              className={`flex items-center justify-center flex-1 p-2 rounded-md ${isLiked ? 'text-destructive' : 'hover:bg-card-hover-gradient'} transition-colors`}
              onClick={handleLike}
            >
              <Heart size={20} fill={isLiked ? "currentColor" : "none"} className="mr-2" />
              Like
            </button>
            <button className="flex items-center justify-center flex-1 p-2 rounded-md hover:bg-card-hover-gradient transition-colors">
              <MessageSquare size={20} className="mr-2" />
              Comment
            </button>
            <button className="flex items-center justify-center flex-1 p-2 rounded-md hover:bg-card-hover-gradient transition-colors">
              <Share2 size={20} className="mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderNewsletterPreview = () => {
    return (
      <div className="bg-card-gradient rounded-lg overflow-hidden border border-border/50 shadow-primary/10">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold gradient-text mb-2">IntelliSync Newsletter</h2>
            <p className="text-foreground/60">The latest updates and insights from IntelliSync</p>
          </div>
          
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={formatTextWithLinks(content)} />
          </div>
          
          {generatedImageUrl && (
            <div className="my-6 rounded-lg overflow-hidden shadow-primary">
              <img 
                src={generatedImageUrl} 
                alt="Newsletter image" 
                className="w-full h-auto"
              />
              <p className="text-xs text-foreground/60 mt-1 text-center italic">
                Image generated with AI to illustrate the newsletter content
              </p>
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <p className="text-foreground/60 mb-4">
              Stay connected with us
            </p>
            <div className="flex justify-center space-x-4">
              <button className="p-2 rounded-full bg-gradient-primary text-white shadow-primary">
                <TwitterIcon size={20} />
              </button>
              <button className="p-2 rounded-full bg-gradient-primary text-white shadow-primary">
                <LinkedinIcon size={20} />
              </button>
              <button className="p-2 rounded-full bg-gradient-primary text-white shadow-primary">
                <FacebookIcon size={20} />
              </button>
              <button className="p-2 rounded-full bg-gradient-primary text-white shadow-primary">
                <InstagramIcon size={20} />
              </button>
            </div>
            <p className="mt-6 text-xs text-foreground/60">
              2025 IntelliSync Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold gradient-text">Platform Preview</h3>
      
      {renderPlatformTabs()}
      
      {selectedPlatform === 'twitter' && renderTwitterPreview()}
      {selectedPlatform === 'linkedin' && renderLinkedInPreview()}
      {selectedPlatform === 'instagram' && renderInstagramPreview()}
      {selectedPlatform === 'facebook' && renderFacebookPreview()}
      {selectedPlatform === 'newsletter' && renderNewsletterPreview()}
      
      {!selectedPlatform && (
        <div className="text-center p-8 bg-card-gradient rounded-lg border border-border/50 shadow-primary/10">
          <p className="text-foreground/60">
            Select a platform above to preview your content
          </p>
        </div>
      )}
    </div>
  );
};

export default PlatformPreview;
