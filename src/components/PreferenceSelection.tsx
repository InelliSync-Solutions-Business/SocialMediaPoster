import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Instagram, 
  Linkedin, 
  Twitter, 
  Facebook, 
  MessageSquare,
  Save,
  X,
  CreditCard 
} from 'lucide-react';
import { UserPreferences } from '../types/preferences';
import { ErrorDisplay } from './ErrorDisplay';

type ViewType = 'generator' | 'landing' | 'polls' | 'pricing' | 'templates';

interface PreferenceSelectionProps {
  open: boolean;
  onClose: () => void;
  onSave: (preferences: UserPreferences) => void;
  onNavigate: (view: ViewType) => void;
  errors?: string[];
}

const PreferenceSelection: React.FC<PreferenceSelectionProps> = ({
  open,
  onClose,
  onSave,
  onNavigate,
  errors
}) => {
  const initialPreferences: UserPreferences = {
    platforms: {
      instagram: {
        enabled: false,
        imageFormat: 'square',
        hashtagSuggestions: false,
        templateCustomization: false,
        showEngagement: false,
        handle: '',
        style: '',
        defaultHashtags: []
      },
      linkedin: {
        enabled: false,
        professionalTone: false,
        articleSupport: false,
        pollSupport: false,
        templateCustomization: false,
        showEngagement: false,
        handle: '',
        style: '',
        defaultHashtags: []
      },
      twitter: {
        enabled: false,
        hashtagLimit: 5,
        threadSupport: false,
        hashtagSuggestions: false,
        templateCustomization: false,
        showEngagement: false,
        handle: '',
        style: '',
        defaultHashtags: []
      },
      tiktok: {
        enabled: false,
        captionLimit: 150,
        templateCustomization: false,
        showEngagement: false,
        handle: '',
        style: '',
        defaultHashtags: []
      },
      facebook: {
        enabled: false,
        linkPreview: false,
        templateCustomization: false,
        showEngagement: false,
        handle: '',
        style: '',
        defaultHashtags: []
      },
      discord: {
        enabled: false,
        templateCustomization: false,
        showEngagement: false,
        handle: '',
        style: '',
        defaultHashtags: []
      },
      newsletter: {
        enabled: false,
        templateCustomization: false,
        showEngagement: false,
        handle: '',
        style: '',
        defaultHashtags: []
      }
    },
    tone: 'professional',
    contentPreferences: {
      contentTypes: [
        'Maintain brand voice consistency',
        'Include relevant industry keywords',
        'Adhere to platform character limits',
        'Use inclusive language',
        'Follow SEO best practices'
      ],
      postFrequency: 'weekly'
    },
    maxContentLength: 500,
    writingStyle: 'conversational',
    targetAudience: 'tech',
    platformPreferences: {
      instagram: {
        imageFormat: 'square',
        hashtagSuggestions: true,
        templateCustomization: true,
        showEngagement: true
      },
      linkedin: {
        professionalTone: true,
        articleSupport: true,
        pollSupport: false,
        templateCustomization: true,
        showEngagement: true
      },
      twitter: {
        hashtagLimit: 3,
        threadSupport: true,
        hashtagSuggestions: true,
        templateCustomization: true,
        showEngagement: true
      },
      facebook: {
        linkPreview: true,
        templateCustomization: true,
        showEngagement: true
      },
      newsletter: {
        templateCustomization: true,
        showEngagement: false
      },
      tiktok: {
        captionLimit: 150,
        templateCustomization: true,
        showEngagement: true
      },
      discord: {
        templateCustomization: false,
        showEngagement: false
      }
    }
  };

  const [preferences, setPreferences] = useState(initialPreferences);

  const handleSave = () => {
    onSave(preferences);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        {errors && errors.length > 0 && (
          <ErrorDisplay errors={errors} />
        )}
        <DialogHeader>
          <DialogTitle>Content Preferences</DialogTitle>
          <DialogDescription>
            Customize your content generation settings
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-8 py-4">
            {/* Platforms Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Platforms</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={preferences.platforms.instagram.enabled}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        platforms: { 
                          ...preferences.platforms, 
                          instagram: { 
                            ...preferences.platforms.instagram, 
                            enabled: checked 
                          } 
                        }
                      })
                    }
                  />
                  <Label className="flex items-center space-x-2">
                    <Instagram className="w-4 h-4" />
                    <span>Instagram</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={preferences.platforms.linkedin.enabled}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        platforms: { 
                          ...preferences.platforms, 
                          linkedin: { 
                            ...preferences.platforms.linkedin, 
                            enabled: checked 
                          } 
                        }
                      })
                    }
                  />
                  <Label className="flex items-center space-x-2">
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={preferences.platforms.twitter.enabled}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        platforms: { 
                          ...preferences.platforms, 
                          twitter: { 
                            ...preferences.platforms.twitter, 
                            enabled: checked 
                          } 
                        }
                      })
                    }
                  />
                  <Label className="flex items-center space-x-2">
                    <Twitter className="w-4 h-4" />
                    <span>Twitter</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={preferences.platforms.facebook.enabled}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        platforms: { 
                          ...preferences.platforms, 
                          facebook: { 
                            ...preferences.platforms.facebook, 
                            enabled: checked 
                          } 
                        }
                      })
                    }
                  />
                  <Label className="flex items-center space-x-2">
                    <Facebook className="w-4 h-4" />
                    <span>Facebook</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={preferences.platforms.discord.enabled}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        platforms: { 
                          ...preferences.platforms, 
                          discord: { 
                            ...preferences.platforms.discord, 
                            enabled: checked 
                          } 
                        }
                      })
                    }
                  />
                  <Label className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Discord</span>
                  </Label>
                </div>
              </div>
            </div>

            {/* Tone Selection */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select
                  value={preferences.tone}
                  onValueChange={(value) =>
                    setPreferences({
                      ...preferences,
                      tone: value as UserPreferences['tone']
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="inspirational">Inspirational</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Content Length</Label>
                <Select
                  value={preferences.maxContentLength?.toString() || "500"}
                  onValueChange={(value) =>
                    setPreferences({
                      ...preferences,
                      maxContentLength: parseInt(value)
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="280">Short (280 chars)</SelectItem>
                    <SelectItem value="500">Medium (500 chars)</SelectItem>
                    <SelectItem value="1000">Long (1000 chars)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Content Types */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Content Types</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={preferences.contentPreferences?.contentTypes?.includes('motivational') || false}
                    onCheckedChange={(checked) => {
                      const currentTypes = preferences.contentPreferences?.contentTypes || [];
                      const newTypes = checked 
                        ? [...currentTypes, 'motivational'] 
                        : currentTypes.filter(type => type !== 'motivational');
                      
                      setPreferences({
                        ...preferences,
                        contentPreferences: {
                          ...preferences.contentPreferences,
                          contentTypes: newTypes
                        }
                      });
                    }}
                  />
                  <Label>Motivational</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={preferences.contentPreferences?.contentTypes?.includes('educational') || false}
                    onCheckedChange={(checked) => {
                      const currentTypes = preferences.contentPreferences?.contentTypes || [];
                      const newTypes = checked 
                        ? [...currentTypes, 'educational'] 
                        : currentTypes.filter(type => type !== 'educational');
                      
                      setPreferences({
                        ...preferences,
                        contentPreferences: {
                          ...preferences.contentPreferences,
                          contentTypes: newTypes
                        }
                      });
                    }}
                  />
                  <Label>Educational</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={preferences.contentPreferences?.contentTypes?.includes('promotional') || false}
                    onCheckedChange={(checked) => {
                      const currentTypes = preferences.contentPreferences?.contentTypes || [];
                      const newTypes = checked 
                        ? [...currentTypes, 'promotional'] 
                        : currentTypes.filter(type => type !== 'promotional');
                      
                      setPreferences({
                        ...preferences,
                        contentPreferences: {
                          ...preferences.contentPreferences,
                          contentTypes: newTypes
                        }
                      });
                    }}
                  />
                  <Label>Promotional</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={preferences.contentPreferences?.contentTypes?.includes('personal') || false}
                    onCheckedChange={(checked) => {
                      const currentTypes = preferences.contentPreferences?.contentTypes || [];
                      const newTypes = checked 
                        ? [...currentTypes, 'personal'] 
                        : currentTypes.filter(type => type !== 'personal');
                      
                      setPreferences({
                        ...preferences,
                        contentPreferences: {
                          ...preferences.contentPreferences,
                          contentTypes: newTypes
                        }
                      });
                    }}
                  />
                  <Label>Personal</Label>
                </div>
              </div>
            </div>

            {/* Pricing Link */}
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => {
                  onClose();
                  onNavigate('pricing');
                }}
                className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                <span>View Pricing & Plans</span>
              </button>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreferenceSelection;
