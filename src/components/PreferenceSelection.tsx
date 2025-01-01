import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  Checkbox,
  FormGroup,
  FormHelperText
} from '@mui/material';
import { Settings } from 'lucide-react';

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
      groupTargeting: boolean;
    };
    discord: {
      threadOptimization: boolean;
    };
  };

  // Tone preferences
  tone: 'professional' | 'casual' | 'inspirational' | 'humorous';

  // Content type preferences
  contentTypes: {
    motivational: boolean;
    educational: boolean;
    promotional: boolean;
    personal: boolean;
  };
}

const PreferenceSelection: React.FC<PreferenceSelectionProps> = ({ 
  open, 
  onClose, 
  onSave 
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    platforms: {
      instagram: true,
      linkedin: false,
      twitter: false,
      tiktok: false,
      facebook: false,
      discord: false
    },
    platformFormats: {
      instagram: {
        imageGeneration: true,
        hashtagSuggestions: true
      },
      linkedin: {
        professionalTone: true
      },
      twitter: {
        characterLimitOptimization: true
      },
      tiktok: {
        trendingHashtags: true
      },
      facebook: {
        groupTargeting: false
      },
      discord: {
        threadOptimization: false
      }
    },
    tone: 'professional',
    contentTypes: {
      motivational: true,
      educational: true,
      promotional: false,
      personal: false
    }
  });

  const handlePlatformChange = (platform: keyof UserPreferences['platforms']) => {
    setPreferences(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: !prev.platforms[platform]
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

  const handlePlatformFormatToggle = (
    platform: 'instagram' | 'linkedin' | 'twitter' | 'tiktok' | 'facebook' | 'discord', 
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

  const handleToneChange = (tone: UserPreferences['tone']) => {
    setPreferences(prev => ({
      ...prev,
      tone
    }));
  };

  const handleContentTypeChange = (contentType: keyof UserPreferences['contentTypes']) => {
    setPreferences(prev => ({
      ...prev,
      contentTypes: {
        ...prev.contentTypes,
        [contentType]: !prev.contentTypes[contentType]
      }
    }));
  };

  const handleSave = () => {
    try {
      onSave(preferences);
      onClose();
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      aria-labelledby="preference-dialog-title"
    >
      <DialogTitle id="preference-dialog-title">Content Generation Preferences</DialogTitle>
      <DialogContent>
        {/* Platform Selection */}
        <FormControl component="fieldset" margin="normal" fullWidth>
          <FormLabel component="legend">Select Platforms</FormLabel>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Object.values(preferences.platforms).every(value => value)}
                  indeterminate={
                    Object.values(preferences.platforms).some(value => value) && 
                    !Object.values(preferences.platforms).every(value => value)
                  }
                  onChange={handleSelectAllPlatforms}
                />
              }
              label="Select All"
            />
            {Object.keys(preferences.platforms).map((platform) => (
              <FormControlLabel
                key={platform}
                control={
                  <Checkbox
                    checked={preferences.platforms[platform as keyof UserPreferences['platforms']]}
                    onChange={() => handlePlatformChange(platform as keyof UserPreferences['platforms'])}
                  />
                }
                label={platform.charAt(0).toUpperCase() + platform.slice(1)}
              />
            ))}
          </FormGroup>
        </FormControl>

        {/* Platform-Specific Formatting */}
        {(Object.keys(preferences.platforms) as Array<keyof UserPreferences['platforms']>)
          .filter(platform => preferences.platforms[platform])
          .map((platform) => (
            <FormControl key={platform} component="fieldset" margin="normal" fullWidth>
              <FormLabel component="legend">{platform.charAt(0).toUpperCase() + platform.slice(1)} Formatting</FormLabel>
              <FormGroup row>
                {platform === 'instagram' && (
                  <>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={preferences.platformFormats.instagram.imageGeneration}
                          onChange={() => handlePlatformFormatToggle('instagram', 'imageGeneration')}
                        />
                      }
                      label="Image Generation"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={preferences.platformFormats.instagram.hashtagSuggestions}
                          onChange={() => handlePlatformFormatToggle('instagram', 'hashtagSuggestions')}
                        />
                      }
                      label="Hashtag Suggestions"
                    />
                  </>
                )}
                {platform === 'linkedin' && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={preferences.platformFormats.linkedin.professionalTone}
                        onChange={() => handlePlatformFormatToggle('linkedin', 'professionalTone')}
                      />
                    }
                    label="Professional Tone Adjustment"
                  />
                )}
                {platform === 'twitter' && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={preferences.platformFormats.twitter.characterLimitOptimization}
                        onChange={() => handlePlatformFormatToggle('twitter', 'characterLimitOptimization')}
                      />
                    }
                    label="Character Limit Optimization"
                  />
                )}
                {platform === 'tiktok' && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={preferences.platformFormats.tiktok.trendingHashtags}
                        onChange={() => handlePlatformFormatToggle('tiktok', 'trendingHashtags')}
                      />
                    }
                    label="Trending Hashtag Integration"
                  />
                )}
                {platform === 'facebook' && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={preferences.platformFormats.facebook.groupTargeting}
                        onChange={() => handlePlatformFormatToggle('facebook', 'groupTargeting')}
                      />
                    }
                    label="Group Targeting"
                  />
                )}
                {platform === 'discord' && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={preferences.platformFormats.discord.threadOptimization}
                        onChange={() => handlePlatformFormatToggle('discord', 'threadOptimization')}
                      />
                    }
                    label="Thread Optimization"
                  />
                )}
              </FormGroup>
            </FormControl>
          ))
        }

        {/* Tone Selection */}
        <FormControl component="fieldset" margin="normal" fullWidth>
          <FormLabel component="legend">Select Tone</FormLabel>
          <RadioGroup
            row
            value={preferences.tone}
            onChange={(e) => handleToneChange(e.target.value as UserPreferences['tone'])}
          >
            {['professional', 'casual', 'inspirational', 'humorous'].map((tone) => (
              <FormControlLabel
                key={tone}
                value={tone}
                control={<Radio />}
                label={tone.charAt(0).toUpperCase() + tone.slice(1)}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {/* Content Type Selection */}
        <FormControl component="fieldset" margin="normal" fullWidth>
          <FormLabel component="legend">Select Content Types</FormLabel>
          <FormGroup row>
            {Object.keys(preferences.contentTypes).map((contentType) => (
              <FormControlLabel
                key={contentType}
                control={
                  <Checkbox
                    checked={preferences.contentTypes[contentType as keyof UserPreferences['contentTypes']]}
                    onChange={() => handleContentTypeChange(contentType as keyof UserPreferences['contentTypes'])}
                  />
                }
                label={contentType.charAt(0).toUpperCase() + contentType.slice(1)}
              />
            ))}
          </FormGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          color="primary" 
          variant="contained"
          startIcon={<Settings />}
        >
          Save Preferences
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreferenceSelection;
