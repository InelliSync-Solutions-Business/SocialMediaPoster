import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Tooltip
} from '@mui/material';
import { Settings, X, Save } from 'lucide-react';

interface PreferenceSelectionProps {
  open: boolean;
  onClose: () => void;
  onSave: (preferences: UserPreferences) => void;
}

export interface UserPreferences {
  // Platform preferences
  platforms: {
    instagram: boolean;
    linkedin: boolean;
    twitter: boolean;
    tiktok: boolean;
    facebook: boolean;
    discord: boolean;
  };

  // Tone selection with strict typing
  tone: 'professional' | 'casual' | 'inspirational' | 'humorous';

  // Platform-specific formatting options
  platformFormats: {
    instagram: {
      imageGeneration: boolean;
      hashtagSuggestions: boolean;
    };
    linkedin: {
      professionalTone: boolean;
    };
    twitter: {
      characterLimitOptimization: boolean;
    };
    tiktok: {
      trendingHashtags: boolean;
    };
    facebook: {
      communityEngagement: boolean;
    };
    discord: {
      threadedDiscussions: boolean;
    };
  };

  // Content type selection
  contentTypes: {
    [key: string]: boolean;
  };
}

const PreferenceSelection: React.FC<PreferenceSelectionProps> = ({ 
  open, 
  onClose, 
  onSave 
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    platforms: {
      instagram: false,
      linkedin: false,
      twitter: false,
      tiktok: false,
      facebook: false,
      discord: false
    },
    tone: 'professional',
    platformFormats: {
      instagram: {
        imageGeneration: false,
        hashtagSuggestions: false
      },
      linkedin: {
        professionalTone: false
      },
      twitter: {
        characterLimitOptimization: false
      },
      tiktok: {
        trendingHashtags: false
      },
      facebook: {
        communityEngagement: false
      },
      discord: {
        threadedDiscussions: false
      }
    },
    contentTypes: {
      motivational: false,
      educational: false,
      promotional: false,
      personal: false
    }
  });

  const handlePlatformToggle = (platform: keyof typeof preferences.platforms) => {
    setPreferences(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: !prev.platforms[platform]
      }
    }));
  };

  const handlePlatformFormatToggle = (
    platform: keyof typeof preferences.platformFormats, 
    format: string
  ) => {
    setPreferences(prev => ({
      ...prev,
      platformFormats: {
        ...prev.platformFormats,
        [platform]: {
          ...prev.platformFormats[platform],
          [format]: !prev.platformFormats[platform][format as keyof typeof prev.platformFormats[typeof platform]]
        }
      }
    }));
  };

  const handleSelectAllPlatforms = () => {
    const allSelected = Object.values(preferences.platforms).every(value => value);
    setPreferences(prev => ({
      ...prev,
      platforms: {
        instagram: !allSelected,
        linkedin: !allSelected,
        twitter: !allSelected,
        tiktok: !allSelected,
        facebook: !allSelected,
        discord: !allSelected
      }
    }));
  };

  const handleSave = () => {
    onSave(preferences);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="dark:bg-background/80"
    >
      <div className="bg-background dark:bg-background/90 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Content Preferences
          </DialogTitle>
          
          <div className="flex space-x-2">
            <Tooltip title="Select/Deselect All Platforms" arrow>
              <button
                onClick={handleSelectAllPlatforms}
                className="p-2 rounded-full hover:bg-secondary/50 dark:hover:bg-secondary/20 transition-colors duration-300"
              >
                <Settings size={20} />
              </button>
            </Tooltip>
            
            <Tooltip title="Close" arrow>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors duration-300"
              >
                <X size={20} />
              </button>
            </Tooltip>
          </div>
        </div>

        <DialogContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(preferences.platforms).map((platform) => (
              <div 
                key={platform}
                className="flex items-center space-x-2 bg-secondary/10 p-3 rounded-md"
              >
                <input 
                  type="checkbox"
                  id={`platform-${platform}`}
                  checked={preferences.platforms[platform as keyof typeof preferences.platforms]}
                  onChange={() => handlePlatformToggle(platform as keyof typeof preferences.platforms)}
                  className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary"
                />
                <label 
                  htmlFor={`platform-${platform}`}
                  className="text-foreground capitalize"
                >
                  {platform}
                </label>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Platform-Specific Formats</h3>
            {Object.entries(preferences.platformFormats).map(([platform, formats]) => (
              <div 
                key={platform} 
                className="bg-secondary/10 p-4 rounded-md"
              >
                <h4 className="text-md font-medium text-foreground capitalize mb-3">
                  {platform} Settings
                </h4>
                <div className="space-y-2">
                  {Object.entries(formats).map(([format, value]) => (
                    <div 
                      key={format}
                      className="flex items-center space-x-2"
                    >
                      <input 
                        type="checkbox"
                        id={`${platform}-${format}`}
                        checked={value}
                        onChange={() => handlePlatformFormatToggle(
                          platform as keyof typeof preferences.platformFormats, 
                          format
                        )}
                        className="form-checkbox h-4 w-4 text-primary rounded focus:ring-primary"
                      />
                      <label 
                        htmlFor={`${platform}-${format}`}
                        className="text-foreground/80 text-sm capitalize"
                      >
                        {format.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Tone Selection</h3>
            <div className="flex space-x-4">
              {['professional', 'casual', 'inspirational', 'humorous'].map((tone) => (
                <div 
                  key={tone}
                  className="flex items-center space-x-2 bg-secondary/10 p-3 rounded-md"
                >
                  <input 
                    type="radio"
                    id={`tone-${tone}`}
                    checked={preferences.tone === tone}
                    onChange={() => setPreferences(prev => ({ 
                      ...prev, 
                      tone: tone as UserPreferences['tone'] 
                    }))}
                    className="form-radio h-5 w-5 text-primary rounded focus:ring-primary"
                  />
                  <label 
                    htmlFor={`tone-${tone}`}
                    className="text-foreground capitalize"
                  >
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Content Type Selection</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(preferences.contentTypes).map((contentType) => (
                <div 
                  key={contentType}
                  className="flex items-center space-x-2 bg-secondary/10 p-3 rounded-md"
                >
                  <input 
                    type="checkbox"
                    id={`content-type-${contentType}`}
                    checked={preferences.contentTypes[contentType as keyof typeof preferences.contentTypes]}
                    onChange={() => setPreferences(prev => ({
                      ...prev,
                      contentTypes: {
                        ...prev.contentTypes,
                        [contentType]: !prev.contentTypes[contentType as keyof typeof prev.contentTypes]
                      }
                    }))}
                    className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary"
                  />
                  <label 
                    htmlFor={`content-type-${contentType}`}
                    className="text-foreground capitalize"
                  >
                    {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>

        <DialogActions className="p-6 pt-0">
          <Tooltip title="Save Preferences" arrow>
            <button
              onClick={handleSave}
              className="
                flex items-center justify-center 
                px-4 py-2 
                bg-primary text-primary-foreground 
                rounded-md 
                hover:bg-primary/90 
                transition-colors duration-300 
                space-x-2
              "
            >
              <Save size={20} />
              <span>Save Preferences</span>
            </button>
          </Tooltip>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default PreferenceSelection;
