import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, MessageSquare, Sparkles, Send } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import GeneratedContent from './GeneratedContent';
import AILoader from './AILoader';
import { UserPreferences } from '../types/preferences';
import { GenerateParams } from '../App';

interface ContentGeneratorProps {
  userPreferences?: UserPreferences;
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({ userPreferences }) => {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [style, setStyle] = useState('');
  const [guidelines, setGuidelines] = useState('');
  const [activeTab, setActiveTab] = useState('short-form');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  const handleAudienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAudience(e.target.value);
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStyle(e.target.value);
  };

  const handleGuidelinesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGuidelines(e.target.value);
  };

  const handleGenerate = async (params: GenerateParams) => {
    if (!params.topic) {
      alert('Please enter a topic');
      return;
    }

    setIsLoading(true);
    setGeneratedContent(null);

    try {
     
      const response = await fetch('/api/generatePost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postType: params.postType,
          topic: params.topic,
          audience: params.targetAudience,
          style: params.writingStyle,
          guidelines: params.additionalGuidelines
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate content');
      }
      
      // Check if the content is valid
      if (!data.content) {
        throw new Error('No content was generated. Please try again.');
      }
      
      // Handle thread content (array of posts) vs regular content (string)
      if (data.isThread && Array.isArray(data.content)) {
        setGeneratedContent(JSON.stringify(data.content));
      } else if (typeof data.content === 'string') {
        setGeneratedContent(data.content);
      } else {
        throw new Error('Invalid content format received from server');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setGeneratedContent(null);
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border border-border/40 shadow-lg">
          <CardHeader className="bg-muted/30 border-b border-border/20 pb-4">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Content Generator
            </CardTitle>
            <CardDescription>
              Create engaging content for your social media platforms in seconds
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="grid gap-6 mb-8">
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-base font-medium">Topic</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={handleTopicChange}
                  placeholder="Enter your content topic"
                  className="w-full p-3 text-base border-border/50 focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="audience" className="text-base font-medium">Target Audience</Label>
                <Input
                  id="audience"
                  value={audience}
                  onChange={handleAudienceChange}
                  placeholder="Describe your target audience"
                  className="w-full p-3 text-base border-border/50 focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="style" className="text-base font-medium">Writing Style</Label>
                <Input
                  id="style"
                  value={style}
                  onChange={handleStyleChange}
                  placeholder="Describe the desired writing style"
                  className="w-full p-3 text-base border-border/50 focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="guidelines" className="text-base font-medium">Additional Guidelines</Label>
                <Textarea
                  id="guidelines"
                  value={guidelines}
                  onChange={handleGuidelinesChange}
                  placeholder="Add any specific guidelines or requirements"
                  className="w-full p-3 text-base min-h-[120px] border-border/50 focus:border-primary resize-y"
                />
              </div>
              
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleGenerate({
                    postType: activeTab.replace('-form', ''),
                    topic,
                    writingStyle: style,
                    targetAudience: audience,
                    additionalGuidelines: guidelines
                  });
                }}
                disabled={isLoading}
                className="w-full py-6 text-base font-medium transition-all hover:shadow-md"
                size="lg"
              >
                <Send className="mr-2 h-5 w-5" />
                {isLoading ? 'Generating...' : 'Generate Content'}
              </Button>
            </div>

            <div className="mt-8 mb-4">
              <h3 className="text-lg font-medium mb-3">Content Type</h3>
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 p-1 bg-muted/50">
                  <TabsTrigger 
                    value="short-form" 
                    onClick={() => setActiveTab('short-form')}
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-3"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Short-Form
                  </TabsTrigger>
                  <TabsTrigger 
                    value="long-form" 
                    onClick={() => setActiveTab('long-form')}
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-3"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Long-Form
                  </TabsTrigger>
                  <TabsTrigger 
                    value="threads" 
                    onClick={() => setActiveTab('threads')}
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-3"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Threads
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="short-form">
                  <Card className="border border-border/30 bg-muted/10">
                    <CardContent className="pt-4 pb-2 px-4">
                      <p className="text-sm text-muted-foreground">
                        Short-form content is perfect for platforms like Twitter and Instagram. 
                        Typically under 280 characters, these posts are concise and to the point.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="long-form">
                  <Card className="border border-border/30 bg-muted/10">
                    <CardContent className="pt-4 pb-2 px-4">
                      <p className="text-sm text-muted-foreground">
                        Long-form content works well for platforms like LinkedIn and Facebook. 
                        These posts allow for more detailed explanations and storytelling.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="threads">
                  <Card className="border border-border/30 bg-muted/10">
                    <CardContent className="pt-4 pb-2 px-4">
                      <p className="text-sm text-muted-foreground">
                        Thread posts are a series of connected messages, ideal for Twitter. 
                        Use them to tell a story or explain complex topics step by step.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8"
              >
                <Card className="border border-border/30 p-6">
                  <AILoader isLoading={isLoading} />
                </Card>
              </motion.div>
            )}

            {generatedContent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-8"
              >
                <GeneratedContent 
                  activeTab={activeTab}
                  content={generatedContent}
                  onClear={handleClear}
                  onRegenerate={() => handleGenerate({
                    postType: activeTab.replace('-form', ''),
                    topic,
                    writingStyle: style,
                    targetAudience: audience,
                    additionalGuidelines: guidelines
                  })}
                  isLoading={isLoading}
                  preferences={userPreferences}
                  templateTargetAudience={audience}
                  templateWritingStyle={style}
                  templateAdditionalGuidelines={guidelines}
                />
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ContentGenerator;
