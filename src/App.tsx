import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Sun, Moon, Settings, FileText, MessageSquare, Mail, PieChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from './components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import GeneratedContent from './components/GeneratedContent';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import TemplatesPage from './pages/TemplatesPage';
import AILoader from './components/AILoader';
import PreferenceSelection from './components/PreferenceSelection';
import { UserPreferences } from './types/preferences';
import { PlatformFormats } from './types/platformFormats';
import NewsletterPage from './pages/newsletter/NewsletterPage';
import Polls from './components/Polls';

import { validatePreferences } from './utils/validation';

interface Template {
  id: string;
  title: string;
  description: string;
  category: 'Professional' | 'Casual & Engaging' | 'Educational Content';
  tag: 'Business' | 'General' | 'Education';
  postType: 'short' | 'long' | 'thread';
  audience: string;
  style: string;
  guidelines: string;
}

interface GenerateParams {
  postType: string;
  topic: string;
  writingStyle: string;
  targetAudience: string;
  additionalGuidelines?: string;
  tone?: 'professional' | 'casual' | 'inspirational' | 'humorous';
  length?: 'short' | 'medium' | 'long';
  [key: string]: any; // For any additional properties
}

function App() {
  const [isDark, setIsDark] = useState(true)
  const [activeTab, setActiveTab] = useState('short-form')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  
  // Form state
  const [topic, setTopic] = useState('')
  const [audience, setAudience] = useState('')
  const [style, setStyle] = useState('')
  const [guidelines, setGuidelines] = useState('')

  // Preference state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    defaultWritingStyle: 'conversational',
    defaultAudience: 'business',
    defaultGuidelines: [
      'Maintain brand voice consistency',
      'Include relevant industry keywords',
      'Adhere to platform character limits',
      'Use inclusive language',
      'Follow SEO best practices'
    ],
    platforms: {
      instagram: { 
        enabled: true, 
        features: {
          imageGeneration: false,
          hashtagSuggestions: false,
          carouselPosts: false,
          storyPosts: false,
          reels: false,
          liveStreaming: false,
          shopping: false,
          affiliateMarketing: false,
          brandedContent: false,
          productTags: false,
          donationStickers: false,
          professionalTone: false,
          characterLimitOptimization: false,
          threadedDiscussions: false,
          segmentationTips: false,
          templateCustomization: false
       
        }
      },
      linkedin: { 
        enabled: true, 
        features: {
          imageGeneration: false,
          hashtagSuggestions: false,
          carouselPosts: false,
          storyPosts: false,
          reels: false,
          liveStreaming: false,
          shopping: false,
          affiliateMarketing: false,
          brandedContent: false,
          productTags: false,
          donationStickers: false,
          professionalTone: false,
          characterLimitOptimization: false,
          threadedDiscussions: false,
          segmentationTips: false,
          templateCustomization: false,
       
     
  
      
        }
      },
      twitter: { 
        enabled: true, 
        features: {
          imageGeneration: false,
          hashtagSuggestions: false,
          carouselPosts: false,
          storyPosts: false,
          reels: false,
          liveStreaming: false,
          shopping: false,
          affiliateMarketing: false,
          brandedContent: false,
          productTags: false,
          donationStickers: false,
          professionalTone: false,
          characterLimitOptimization: false,
          threadedDiscussions: false,
          segmentationTips: false,
          templateCustomization: false,
    
         

        }
      },
      tiktok: { 
        enabled: true, 
        features: {
          imageGeneration: false,
          hashtagSuggestions: false,
          carouselPosts: false,
          storyPosts: false,
          reels: false,
          liveStreaming: false,
          shopping: false,
          affiliateMarketing: false,
          brandedContent: false,
          productTags: false,
          donationStickers: false,
          professionalTone: false,
          characterLimitOptimization: false,
          threadedDiscussions: false,
          segmentationTips: false,
          templateCustomization: false,
         
      
      
      
        }
      },
      facebook: { 
        enabled: true, 
        features: {
          imageGeneration: false,
          hashtagSuggestions: false,
          carouselPosts: false,
          storyPosts: false,
          reels: false,
          liveStreaming: false,
          shopping: false,
          affiliateMarketing: false,
          brandedContent: false,
          productTags: false,
          donationStickers: false,
          professionalTone: false,
          characterLimitOptimization: false,
          threadedDiscussions: false,
          segmentationTips: false,
          templateCustomization: false,
       
        }
      },
      discord: { 
        enabled: true, 
        features: {
          imageGeneration: false,
          hashtagSuggestions: false,
          carouselPosts: false,
          storyPosts: false,
          reels: false,
          liveStreaming: false,
          shopping: false,
          affiliateMarketing: false,
          brandedContent: false,
          productTags: false,
          donationStickers: false,
          professionalTone: false,
          characterLimitOptimization: false,
          threadedDiscussions: false,
          segmentationTips: false,
          templateCustomization: false,
       
        }
      },
      newsletter: { 
        enabled: true, 
        features: {
          imageGeneration: false,
          hashtagSuggestions: false,
          carouselPosts: false,
          storyPosts: false,
          reels: false,
          liveStreaming: false,
          shopping: false,
          affiliateMarketing: false,
          brandedContent: false,
          productTags: false,
          donationStickers: false,
          professionalTone: false,
          characterLimitOptimization: false,
          threadedDiscussions: false,
          segmentationTips: false,
          templateCustomization: false,
    
        }
      }
    },
    platformFormats: {
      instagram: {
        imageGeneration: false,
        hashtagSuggestions: false,
        carouselPosts: false,
        storyPosts: false,
        reels: false,
        professionalTone: false,
        characterLimitOptimization: false,
        trendingHashtags: false,
        communityEngagement: false,
        threadedDiscussions: false,
        communityInteraction: false,
        liveStreaming: false,
        shopping: false,
        affiliateMarketing: false,
        brandedContent: false,
        productTags: false,
        donationStickers: false,
        segmentationTips: false,
        templateCustomization: false
      },
      linkedin: {
        imageGeneration: false,
        hashtagSuggestions: false,
        carouselPosts: false,
        storyPosts: false,
        reels: false,
        professionalTone: false,
        characterLimitOptimization: false,
        trendingHashtags: false,
        communityEngagement: false,
        threadedDiscussions: false,
        communityInteraction: false,
        liveStreaming: false,
        shopping: false,
        affiliateMarketing: false,
        brandedContent: false,
        productTags: false,
        donationStickers: false,
        segmentationTips: false,
        templateCustomization: false
      },
      twitter: {
        imageGeneration: false,
        hashtagSuggestions: false,
        carouselPosts: false,
        storyPosts: false,
        reels: false,
        professionalTone: false,
        characterLimitOptimization: false,
        trendingHashtags: false,
        communityEngagement: false,
        threadedDiscussions: false,
        communityInteraction: false,
        liveStreaming: false,
        shopping: false,
        affiliateMarketing: false,
        brandedContent: false,
        productTags: false,
        donationStickers: false,
        segmentationTips: false,
        templateCustomization: false
      },
      tiktok: {
        imageGeneration: false,
        hashtagSuggestions: false,
        carouselPosts: false,
        storyPosts: false,
        reels: false,
        professionalTone: false,
        characterLimitOptimization: false,
        trendingHashtags: false,
        communityEngagement: false,
        threadedDiscussions: false,
        communityInteraction: false,
        liveStreaming: false,
        shopping: false,
        affiliateMarketing: false,
        brandedContent: false,
        productTags: false,
        donationStickers: false,
        segmentationTips: false,
        templateCustomization: false
      },
      facebook: {
        imageGeneration: false,
        hashtagSuggestions: false,
        carouselPosts: false,
        storyPosts: false,
        reels: false,
        professionalTone: false,
        characterLimitOptimization: false,
        trendingHashtags: false,
        communityEngagement: false,
        threadedDiscussions: false,
        communityInteraction: false,
        liveStreaming: false,
        shopping: false,
        affiliateMarketing: false,
        brandedContent: false,
        productTags: false,
        donationStickers: false,
        segmentationTips: false,
        templateCustomization: false
      },
      discord: {
        imageGeneration: false,
        hashtagSuggestions: false,
        carouselPosts: false,
        storyPosts: false,
        reels: false,
        professionalTone: false,
        characterLimitOptimization: false,
        trendingHashtags: false,
        communityEngagement: false,
        threadedDiscussions: false,
        communityInteraction: false,
        liveStreaming: false,
        shopping: false,
        affiliateMarketing: false,
        brandedContent: false,
        productTags: false,
        donationStickers: false,
        segmentationTips: false,
        templateCustomization: false
      },
      newsletter: {
        imageGeneration: false,
        hashtagSuggestions: false,
        carouselPosts: false,
        storyPosts: false,
        reels: false,
        professionalTone: false,
        characterLimitOptimization: false,
        trendingHashtags: false,
        communityEngagement: false,
        threadedDiscussions: false,
        communityInteraction: false,
        liveStreaming: false,
        shopping: false,
        affiliateMarketing: false,
        brandedContent: false,
        productTags: false,
        donationStickers: false,
        segmentationTips: false,
        templateCustomization: false
      }
    },
    tone: 'professional',
    contentLength: 'medium',
    contentTypes: {
      motivational: true,
      educational: true,
      promotional: true,
      personal: true
    }
  });
  const [errors, setErrors] = useState<string[]>([]);

  const navigate = useNavigate();

  const handleOpenPreferences = () => {
    setIsPreferencesOpen(true);
  };

  const handleClosePreferences = () => {
    setIsPreferencesOpen(false);
  };

  const handleSavePreferences = (prefs: UserPreferences) => {
    const validationErrors = validatePreferences(prefs);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setUserPreferences(prefs);
    setIsPreferencesOpen(false);
  };

  // Effect to handle theme changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
  }, [isDark])

  const handleTemplateSelect = (template: Template | null, prepopulatedFields?: {
    targetAudience: string;
    writingStyle: string;
    additionalGuidelines: string;
  }) => {
    setSelectedTemplate(template);
    if (template && prepopulatedFields) {
      // Automatically set some default values based on the selected template
      setTopic(''); // Reset topic to allow user input
      setAudience(prepopulatedFields.targetAudience || '');
      setStyle(prepopulatedFields.writingStyle || '');
      setGuidelines(prepopulatedFields.additionalGuidelines || '');
    }
  };

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
    setIsLoading(true);
    setGeneratedContent('');

    try {
      const apiEndpoint = '/api/generatePost';

      const requestBody = {
            postType: activeTab.replace('-form', ''),
            topic: `${topic} ${audience} ${style} ${guidelines}`,
            audience,
            style,
            guidelines,
          };

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();
      console.log('Raw server response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse server response:', parseError);
        throw new Error(`Server returned invalid JSON: ${responseText}`);
      }

      if (!response.ok) {
        console.error('Server returned error:', data);
        throw new Error(data.error || 'Server returned an error');
      }

      console.log('Server response parsed:', data);

      if (data.success) {
        setGeneratedContent(data.content);
      } else {
        throw new Error(data.error || 'Failed to generate content');
      }
    } catch (error) {
      console.error('Content generation failed:', error);
      
      // Type guard to check if error is an Error object
      if (error instanceof Error) {
        alert(error.message || 'Failed to generate content. Please try again.');
      } else {
        // Fallback for non-Error objects
        alert('Failed to generate content. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setGeneratedContent('');
  };

  const routes = [
    { path: '/', label: 'Home' },
    { path: '/content-generator', label: 'Content Generator' },
    { path: '/templates', label: 'Templates' },
    { path: '/pricing', label: 'Pricing' }
  ];

  const postTypeTabs = [
    { id: 'short-form', label: 'Short Form', icon: <FileText size={16} /> },
    { id: 'long-form', label: 'Long Form', icon: <FileText size={16} /> },
    { id: 'thread', label: 'Threads', icon: <MessageSquare size={16} /> }
  ];

  const seoMetadata = {
    title: 'Intellisync Solutions Social Media Writer | AI Content Generation',
    description: 'Revolutionize your social media strategy with AI-powered content generation. Create engaging posts, threads, and long-form content effortlessly.',
    keywords: [
      'AI writing',
      'social media content',
      'content generation',
      'copywriting',
      'thread writer',
      'post generator',
      'marketing AI',
      'content strategy'
    ],
    canonical: 'https://home.intellisyncsolutions.io',
    ogImage: '/og-image.png',
    twitterImage: '/twitter-image.png'
  };

  const [currentView, setCurrentView] = useState<"generator" | "landing" | "pricing" | "templates" | "polls">("landing");

  return (
    <HelmetProvider>
      <MainLayout>
        <Helmet>
          <title>IntelliSync Solutions - Social Media Writer</title>
          <meta name="description" content="AI-powered social media content generator" />
        </Helmet>

        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
              <div className="mr-4 flex">
                <Link to="/" className="mr-6 flex items-center space-x-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="font-bold text-xl">IntelliSync</span>
                  </motion.div>
                </Link>
              </div>

              <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                <nav className="flex space-x-4">
                  <Link 
                    to="/generator" 
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Social Media Generator
                  </Link>
                  <Link 
                    to="/newsletter" 
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Newsletter
                  </Link>
                  <Link 
                    to="/templates" 
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Templates
                  </Link>
                </nav>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsDark(!isDark)}
                  className="h-9 w-9"
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleOpenPreferences}
                  className="h-9 w-9"
                >
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/newsletter" element={<NewsletterPage />} />
              <Route path="/templates" element={<TemplatesPage 
                onTemplateSelect={handleTemplateSelect}
                onNavigateToGenerator={() => navigate('/generator')}
              />} />
              <Route path="/generator" element={
                <div className="max-w-4xl mx-auto p-4">
                  <Card className="p-6">
                    <CardContent>
                      <div className="grid gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Topic</label>
                          <input
                            type="text"
                            value={topic}
                            onChange={handleTopicChange}
                            placeholder="Enter your content topic"
                            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Target Audience</label>
                          <input
                            type="text"
                            value={audience}
                            onChange={handleAudienceChange}
                            placeholder="Describe your target audience"
                            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Writing Style</label>
                          <input
                            type="text"
                            value={style}
                            onChange={handleStyleChange}
                            placeholder="Describe the desired writing style"
                            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Additional Guidelines</label>
                          <textarea
                            value={guidelines}
                            onChange={handleGuidelinesChange}
                            placeholder="Add any specific guidelines or requirements"
                            className="w-full p-2 border rounded min-h-[100px] dark:bg-gray-800 dark:border-gray-700"
                          />
                        </div>
                        <button
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
                          className="w-full bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90 transition-colors"
                        >
                          {isLoading ? 'Generating...' : 'Generate Content'}
                        </button>
                      </div>
                    </CardContent>

                    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
                      <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="short-form" onClick={() => setActiveTab('short-form')}>
                          <FileText className="w-4 h-4 mr-2" />
                          Short-Form
                        </TabsTrigger>
                        <TabsTrigger value="long-form" onClick={() => setActiveTab('long-form')}>
                          <FileText className="w-4 h-4 mr-2" />
                          Long-Form
                        </TabsTrigger>
                        <TabsTrigger value="threads" onClick={() => setActiveTab('threads')}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Threads
                        </TabsTrigger>
                        <TabsTrigger value="polls" onClick={() => setActiveTab('polls')}>
                          <PieChart className="w-4 h-4 mr-2" />
                          Polls
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="short-form">
                        <Card>
                          <CardContent className="mt-6">
                            
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="long-form">
                        <Card>
                          <CardContent className="mt-6">
                            
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="threads">
                        <Card>
                          <CardContent className="mt-6">
                            
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="polls">
                        <Card>
                          <CardContent className="mt-6">
                            <Polls />
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>

                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-8"
                      >
                        <AILoader isLoading={isLoading} />
                      </motion.div>
                    )}

                    {generatedContent && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
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
                  </Card>
                </div>
              } />
            </Routes>
          </main>

          <Footer className="mt-auto" />
        </div>

        <PreferenceSelection
          open={isPreferencesOpen}
          onClose={handleClosePreferences}
          onSave={handleSavePreferences}
          onNavigate={setCurrentView}
          errors={errors}
        />
      </MainLayout>
    </HelmetProvider>
  );
}

export default App
