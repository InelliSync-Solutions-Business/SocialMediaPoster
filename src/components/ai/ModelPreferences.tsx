import React, { useEffect, useState } from 'react';
import { AIModel } from '@/pages/newsletter/types/newsletter';
import { AI_MODELS } from '@/utils/ai/modelInfo';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, Settings, Info } from 'lucide-react';
import { toast } from 'sonner';

// Local storage key for saving preferences
const MODEL_PREFERENCES_KEY = 'intellisync-model-preferences';

interface ModelPreferencesProps {
  currentModel: AIModel;
  onModelChange?: (model: AIModel) => void;
}

interface ModelPreferences {
  defaultModel: AIModel;
  contentTypePreferences: {
    newsletter: AIModel;
    socialPost: AIModel;
    emailCampaign: AIModel;
    blogPost: AIModel;
  };
}

const DEFAULT_PREFERENCES: ModelPreferences = {
  defaultModel: 'gpt-4o-mini',
  contentTypePreferences: {
    newsletter: 'gpt-4o-mini',
    socialPost: 'gpt-4o-mini',
    emailCampaign: 'gpt-4o-mini',
    blogPost: 'gpt-4o-mini',
  }
};

export const ModelPreferences: React.FC<ModelPreferencesProps> = ({
  currentModel,
  onModelChange
}) => {
  const [preferences, setPreferences] = useState<ModelPreferences>(DEFAULT_PREFERENCES);
  const [isOpen, setIsOpen] = useState(false);

  // Load preferences from local storage on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem(MODEL_PREFERENCES_KEY);
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(parsed);
      } catch (error) {
        console.error('Failed to parse saved model preferences', error);
      }
    }
  }, []);

  // Save preferences to local storage whenever they change
  const savePreferences = (newPreferences: ModelPreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem(MODEL_PREFERENCES_KEY, JSON.stringify(newPreferences));
    toast.success('Model preferences saved successfully');
  };

  const handleDefaultModelChange = (model: AIModel) => {
    const newPreferences = {
      ...preferences,
      defaultModel: model
    };
    savePreferences(newPreferences);
    
    // If onModelChange is provided, call it with the new model
    if (onModelChange) {
      onModelChange(model);
    }
  };

  const handleContentTypeModelChange = (contentType: keyof ModelPreferences['contentTypePreferences'], model: AIModel) => {
    const newPreferences = {
      ...preferences,
      contentTypePreferences: {
        ...preferences.contentTypePreferences,
        [contentType]: model
      }
    };
    savePreferences(newPreferences);
  };

  const resetToDefaults = () => {
    savePreferences(DEFAULT_PREFERENCES);
    if (onModelChange) {
      onModelChange(DEFAULT_PREFERENCES.defaultModel);
    }
  };

  // If not open, just show a button to open preferences
  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-1.5" 
        onClick={() => setIsOpen(true)}
      >
        <Settings className="h-3.5 w-3.5" />
        Model Preferences
      </Button>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-center text-foreground">
          <span>AI Model Preferences</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </CardTitle>
        <CardDescription className="text-foreground/70">
          Configure your preferred AI models for different content types
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="default">
          <TabsList className="mb-4">
            <TabsTrigger value="default">Default Model</TabsTrigger>
            <TabsTrigger value="content-types">Content Type Specific</TabsTrigger>
          </TabsList>
          
          <TabsContent value="default" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">Default AI Model</h3>
              <p className="text-xs text-foreground/70">
                This model will be used as the default for all content generation unless overridden by content-specific settings.
              </p>
              
              <Select 
                value={preferences.defaultModel} 
                onValueChange={(value) => handleDefaultModelChange(value as AIModel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AI_MODELS).map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center gap-2">
                        <span>{model.name}</span>
                        {model.id === currentModel && (
                          <Badge variant="outline" className="ml-2 text-xs py-0 px-1.5">
                            Current
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2 text-foreground">Model Details</h3>
              {preferences.defaultModel && (
                <div className="bg-muted/40 rounded-md p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-foreground">{AI_MODELS[preferences.defaultModel].name}</span>
                    <span className="text-xs text-foreground/70">
                      Context: {(AI_MODELS[preferences.defaultModel].contextLength / 1000).toFixed(0)}K tokens
                    </span>
                  </div>
                  <p className="text-xs text-foreground/80">{AI_MODELS[preferences.defaultModel].description}</p>
                  
                  <div className="pt-1">
                    <span className="text-xs font-medium text-foreground">Best for:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {AI_MODELS[preferences.defaultModel].bestFor.map((use, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {use}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-1">
                    <span className="text-xs font-medium text-foreground">Capabilities:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {AI_MODELS[preferences.defaultModel].capabilities.map((capability, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="content-types" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">Content Type Specific Models</h3>
              <p className="text-xs text-foreground/70">
                Configure different AI models for specific content types. These settings will override the default model.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-foreground">Newsletter</h3>
              <Select 
                value={preferences.contentTypePreferences.newsletter} 
                onValueChange={(value) => handleContentTypeModelChange('newsletter', value as AIModel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AI_MODELS).map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-foreground">Social Media Post</h3>
              <Select 
                value={preferences.contentTypePreferences.socialPost} 
                onValueChange={(value) => handleContentTypeModelChange('socialPost', value as AIModel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AI_MODELS).map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-foreground">Email Campaign</h3>
              <Select 
                value={preferences.contentTypePreferences.emailCampaign} 
                onValueChange={(value) => handleContentTypeModelChange('emailCampaign', value as AIModel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AI_MODELS).map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-foreground">Blog Post</h3>
              <Select 
                value={preferences.contentTypePreferences.blogPost} 
                onValueChange={(value) => handleContentTypeModelChange('blogPost', value as AIModel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AI_MODELS).map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
        <Button variant="default" size="sm" onClick={() => setIsOpen(false)}>
          <Check className="mr-1.5 h-3.5 w-3.5" />
          Done
        </Button>
      </CardFooter>
    </Card>
  );
};
