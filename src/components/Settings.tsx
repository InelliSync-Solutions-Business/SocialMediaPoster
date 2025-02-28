import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPreferences } from '@/types/preferences';
import { PlatformKey } from '@/types/platforms';

interface SettingsProps {
  userPreferences: UserPreferences;
  onUpdatePreferences: (preferences: UserPreferences) => void;
}

const Settings: React.FC<SettingsProps> = ({ userPreferences, onUpdatePreferences }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(userPreferences);

  const handleSave = () => {
    onUpdatePreferences(preferences);
  };

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updatePlatformPreference = (platform: PlatformKey, key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      platformPreferences: {
        ...prev.platformPreferences,
        [platform]: {
          ...prev.platformPreferences[platform],
          [key]: value
        }
      }
    }));
  };

  const updateContentPreference = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      contentPreferences: {
        ...prev.contentPreferences,
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure your general application preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable dark mode for the application
                    </p>
                  </div>
                  <Switch 
                    id="darkMode" 
                    checked={preferences.darkMode} 
                    onCheckedChange={(checked) => updatePreference('darkMode', checked)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={preferences.language || 'en'} 
                    onValueChange={(value) => updatePreference('language', value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={preferences.timezone || 'UTC'} 
                    onValueChange={(value) => updatePreference('timezone', value)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                      <SelectItem value="CST">Central Time (CST)</SelectItem>
                      <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                      <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Content Settings */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Preferences</CardTitle>
              <CardDescription>
                Configure your default content generation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="writingStyle">Default Writing Style</Label>
                  <Select 
                    value={preferences.writingStyle} 
                    onValueChange={(value) => updatePreference('writingStyle', value)}
                  >
                    <SelectTrigger id="writingStyle">
                      <SelectValue placeholder="Select writing style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Select 
                    value={preferences.targetAudience} 
                    onValueChange={(value) => updatePreference('targetAudience', value)}
                  >
                    <SelectTrigger id="targetAudience">
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="professionals">Professionals</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="executives">Executives</SelectItem>
                      <SelectItem value="students">Students</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contentTypes">Preferred Content Types</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['short-form', 'long-form', 'threads', 'polls'].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Switch 
                          id={`content-type-${type}`} 
                          checked={preferences.contentPreferences?.contentTypes?.includes(type)} 
                          onCheckedChange={(checked) => {
                            const currentTypes = [...(preferences.contentPreferences?.contentTypes || [])];
                            if (checked) {
                              updateContentPreference('contentTypes', [...currentTypes, type]);
                            } else {
                              updateContentPreference('contentTypes', currentTypes.filter(t => t !== type));
                            }
                          }} 
                        />
                        <Label htmlFor={`content-type-${type}`}>{type.replace('-', ' ')}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brandGuidelines">Brand Guidelines</Label>
                  <Textarea 
                    id="brandGuidelines" 
                    value={preferences.contentPreferences?.brandGuidelines || ''} 
                    onChange={(e) => updateContentPreference('brandGuidelines', e.target.value)} 
                    placeholder="Enter your brand guidelines here..."
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Platform Settings */}
        <TabsContent value="platforms">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>
                Configure settings for each social media platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="twitter">
                <TabsList className="mb-4">
                  <TabsTrigger value="twitter">Twitter</TabsTrigger>
                  <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                  <TabsTrigger value="instagram">Instagram</TabsTrigger>
                  <TabsTrigger value="facebook">Facebook</TabsTrigger>
                </TabsList>
                
                {(['twitter', 'linkedin', 'instagram', 'facebook'] as PlatformKey[]).map((platform) => (
                  <TabsContent key={platform} value={platform}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor={`${platform}-enabled`}>Enable {platform}</Label>
                          <p className="text-sm text-muted-foreground">
                            Generate content for {platform}
                          </p>
                        </div>
                        <Switch 
                          id={`${platform}-enabled`} 
                          checked={preferences.platformPreferences[platform]?.enabled} 
                          onCheckedChange={(checked) => updatePlatformPreference(platform, 'enabled', checked)} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`${platform}-handle`}>Account Handle</Label>
                        <Input 
                          id={`${platform}-handle`} 
                          value={preferences.platformPreferences[platform]?.handle || ''} 
                          onChange={(e) => updatePlatformPreference(platform, 'handle', e.target.value)} 
                          placeholder={`Your ${platform} handle`}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`${platform}-style`}>Content Style</Label>
                        <Select 
                          value={preferences.platformPreferences[platform]?.style || 'default'} 
                          onValueChange={(value) => updatePlatformPreference(platform, 'style', value)}
                        >
                          <SelectTrigger id={`${platform}-style`}>
                            <SelectValue placeholder="Select content style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="engaging">Engaging</SelectItem>
                            <SelectItem value="promotional">Promotional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`${platform}-hashtags`}>Default Hashtags</Label>
                        <Input 
                          id={`${platform}-hashtags`} 
                          value={preferences.platformPreferences[platform]?.defaultHashtags?.join(' ') || ''} 
                          onChange={(e) => updatePlatformPreference(
                            platform, 
                            'defaultHashtags', 
                            e.target.value.split(' ').filter(Boolean)
                          )} 
                          placeholder="Enter hashtags separated by spaces"
                        />
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Account Settings */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account information and subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value="user@example.com" 
                    disabled 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value="John Doe" 
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-2">Subscription</h3>
                  <div className="bg-primary/10 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Pro Plan</p>
                        <p className="text-sm text-muted-foreground">$29/month</p>
                      </div>
                      <Button variant="outline">Manage</Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-2">API Keys</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Your API Key</p>
                        <p className="text-sm text-muted-foreground">Use this to access our API</p>
                      </div>
                      <Button variant="outline">Generate New Key</Button>
                    </div>
                    <Input 
                      value="••••••••••••••••••••••••••••••" 
                      disabled 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
