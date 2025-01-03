import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async';
import * as Tabs from '@radix-ui/react-tabs'
import { Sun, Moon, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import Templates from './components/Templates'
import GeneratedContent from './components/GeneratedContent'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import PricingPage from './pages/PricingPage'
import AILoader from './components/AILoader'
import PreferenceSelection, { UserPreferences } from './components/PreferenceSelection';

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
        groupTargeting: true
      },
      discord: {
        threadOptimization: true
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

  const handleOpenPreferences = () => {
    setIsPreferencesOpen(true);
  };

  const handleClosePreferences = () => {
    setIsPreferencesOpen(false);
  };

  const handleSavePreferences = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    // You can add additional logic here, like saving to local storage or sending to backend
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

  const handleTemplateSelect = (template: Template) => {
    // Set the template
    setSelectedTemplate(template)
    
    // Pre-populate form inputs based on template
    setAudience(template.audience)
    setStyle(template.style)
    setGuidelines(template.guidelines)
    
    // Reset topic as per requirement
    setTopic('')
    
    // Switch to the appropriate form based on template's post type
    switch (template.postType) {
      case 'short':
        setActiveTab('short-form')
        break
      case 'long':
        setActiveTab('long-form')
        break
      case 'thread':
        setActiveTab('threads')
        break
      default:
        setActiveTab('short-form')
    }
  }

  const generateContent = async () => {
    // Construct a detailed prompt based on user preferences
    let platformPrompt = '';
    
    // Add platform-specific formatting instructions
    Object.entries(userPreferences.platforms).forEach(([platform, isSelected]) => {
      if (isSelected) {
        switch (platform) {
          case 'instagram':
            if (userPreferences.platformFormats.instagram.imageGeneration) {
              platformPrompt += 'Generate an image for Instagram with square (1:1) or vertical (4:5) format. ';
            }
            if (userPreferences.platformFormats.instagram.hashtagSuggestions) {
              platformPrompt += 'Include 3-5 relevant hashtags to increase discoverability. ';
            }
            break;
          case 'linkedin':
            if (userPreferences.platformFormats.linkedin.professionalTone) {
              platformPrompt += 'Use a professional and authoritative tone suitable for LinkedIn. ';
            }
            break;
          case 'twitter':
            if (userPreferences.platformFormats.twitter.characterLimitOptimization) {
              platformPrompt += 'Optimize content to be concise and impactful within 140 characters. ';
            }
            break;
          case 'tiktok':
            if (userPreferences.platformFormats.tiktok.trendingHashtags) {
              platformPrompt += 'Incorporate current trending TikTok hashtags to increase visibility. ';
            }
            break;
          case 'facebook':
            if (userPreferences.platformFormats.facebook.groupTargeting) {
              platformPrompt += 'Tailor content to be engaging for specific Facebook interest groups. ';
            }
            break;
          case 'discord':
            if (userPreferences.platformFormats.discord.threadOptimization) {
              platformPrompt += 'Structure content to be thread-friendly and encourage community discussion. ';
            }
            break;
        }
      }
    });

    // Add tone and content type instructions
    platformPrompt += `Tone should be ${userPreferences.tone}. `;
    
    const selectedContentTypes = Object.entries(userPreferences.contentTypes)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type);
    
    if (selectedContentTypes.length > 0) {
      platformPrompt += `Content types to focus on: ${selectedContentTypes.join(', ')}. `;
    }

    // Combine platform-specific prompt with existing generation prompt
    const enhancedPrompt = `${platformPrompt} ${topic} ${audience} ${style} ${guidelines}`;

    // Rest of the existing generation logic
    setIsLoading(true);
    try {
      console.log('Sending request to generate content...');
      const response = await fetch('/api/generatePost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postType: activeTab.replace('-form', ''),
          topic: enhancedPrompt,
          audience,
          style,
          guidelines,
        }),
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

  return (
    <HelmetProvider>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{seoMetadata.title}</title>
        <meta name="title" content={seoMetadata.title} />
        <meta name="description" content={seoMetadata.description} />
        <meta name="keywords" content={seoMetadata.keywords.join(', ')} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seoMetadata.canonical} />
        <meta property="og:title" content={seoMetadata.title} />
        <meta property="og:description" content={seoMetadata.description} />
        <meta property="og:image" content={seoMetadata.ogImage} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={seoMetadata.canonical} />
        <meta property="twitter:title" content={seoMetadata.title} />
        <meta property="twitter:description" content={seoMetadata.description} />
        <meta property="twitter:image" content={seoMetadata.twitterImage} />
        
        {/* Canonical */}
        <link rel="canonical" href={seoMetadata.canonical} />
        
        {/* Geo Tags */}
        <meta name="geo.region" content="CA" />
        <meta name="geo.placename" content="Ontario, Canada" />
        
        {/* Contact Information */}
        <meta name="contact" content="Chris June" />
        <meta name="contact:email" content="Chris.june@intellisync.ca" />
        
        {/* Robots */}
        <meta name="robots" content="index, follow" />
        
        {/* Schema.org Markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Intellisync Solutions Social Media Writer",
            "description": seoMetadata.description,
            "url": seoMetadata.canonical,
            "applicationCategory": "Productivity, Marketing, Content Generation",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "creator": {
              "@type": "Organization",
              "name": "Intellisync Solutions",
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "Chris.june@intellisync.ca",
                "contactType": "Customer Support"
              }
            }
          })}
        </script>
      </Helmet>
      <div className={`min-h-screen ${isDark ? 'dark' : 'light'}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/generate" element={
            <div className="container mx-auto px-4 py-8">
              <HelmetProvider>
                <Helmet>
                  <title>IntelliSync Solutions Social Media Writer</title>
                  <meta name="description" content="AI-powered content generation for social media, long-form posts, and threads" />
                  <meta name="keywords" content="AI writing, social media content, content generation, copywriting" />
                  <meta name="viewport" content="width=device-width, initial-scale=1" />
                  <link rel="canonical" href="https://home.intellisyncsolutions.io" />
                  <meta property="og:title" content="IntelliSync Solutions Social Media Writer" />
                  <meta property="og:description" content="AI-powered content generation for social media, long-form posts, and threads" />
                  <meta property="og:url" content="https://home.intellisyncsolutions.io" />
                  <meta property="twitter:title" content="IntelliSync Solutions Social Media Writer" />
                  <meta property="twitter:description" content="AI-powered content generation for social media, long-form posts, and threads" />
                </Helmet>
                <div className="min-h-screen">
                  <div className="min-h-screen p-6 bg-background-highlight/50">
                    <div className="min-h-screen p-6 bg-background-highlight/50">
                      <header className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
                        <div className="flex gap-2">
                          <button
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                              activeTab === 'short-form'
                                ? 'bg-primary text-primary-foreground shadow-soft dark:shadow-[0_0_15px_rgba(0,0,0,0.2)]'
                                : 'hover:bg-background-hover text-foreground/60 dark:hover:bg-secondary/20'
                            }`}
                            onClick={() => setActiveTab('short-form')}
                          >
                            Short Form
                          </button>
                          <button
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                              activeTab === 'long-form'
                                ? 'bg-primary text-primary-foreground shadow-soft dark:shadow-[0_0_15px_rgba(0,0,0,0.2)]'
                                : 'hover:bg-background-hover text-foreground/60 dark:hover:bg-secondary/20'
                            }`}
                            onClick={() => setActiveTab('long-form')}
                          >
                            Long Form
                          </button>
                          <button
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                              activeTab === 'threads'
                                ? 'bg-primary text-primary-foreground shadow-soft dark:shadow-[0_0_15px_rgba(0,0,0,0.2)]'
                                : 'hover:bg-background-hover text-foreground/60 dark:hover:bg-secondary/20'
                            }`}
                            onClick={() => setActiveTab('threads')}
                          >
                            Threads
                          </button>
                          <button
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                              activeTab === 'templates'
                                ? 'bg-primary text-primary-foreground shadow-soft dark:shadow-[0_0_15px_rgba(0,0,0,0.2)]'
                                : 'hover:bg-background-hover text-foreground/60 dark:hover:bg-secondary/20'
                            }`}
                            onClick={() => setActiveTab('templates')}
                          >
                            Templates
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 rounded-lg hover:bg-background-hover dark:hover:bg-secondary/20 transition-colors"
                          >
                            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                          </button>
                          <button 
                            onClick={handleOpenPreferences} 
                            className="p-2 rounded-lg hover:bg-background-hover dark:hover:bg-secondary/20 transition-colors"
                          >
                            <Settings className="w-5 h-5" />
                          </button>
                        </div>
                      </header>

                      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        <div className="space-y-6">
                          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 dark:from-foreground dark:to-foreground/70 bg-clip-text text-transparent">
                            {activeTab === 'short-form'
                              ? 'Social Media Writer'
                              : activeTab === 'long-form'
                              ? 'Long Form Writer'
                              : activeTab === 'threads'
                              ? 'Thread Writer'
                              : 'Templates'}
                          </h1>

                          <div className="space-y-6">
                            {activeTab === 'templates' ? (
                              <Templates onSelectTemplate={handleTemplateSelect} />
                            ) : (
                              <>
                                {selectedTemplate && (
                                  <div className="p-4 rounded-lg bg-secondary/30 dark:bg-secondary/10 border border-border/50 backdrop-blur-sm shadow-lifted dark:shadow-dark-lifted">
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <h3 className="font-medium">{selectedTemplate.title}</h3>
                                        <p className="text-sm text-foreground/60 dark:text-foreground/50">{selectedTemplate.description}</p>
                                      </div>
                                      <button
                                        onClick={() => setSelectedTemplate(null)}
                                        className="text-sm text-foreground/60 hover:text-foreground dark:text-foreground/50 dark:hover:text-foreground/80 transition-colors"
                                      >
                                        Clear Template
                                      </button>
                                    </div>
                                  </div>
                                )}

                                <div className="space-y-6">
                                  <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground/80 dark:text-foreground/70">
                                      Main Topic/Idea
                                    </label>
                                    <textarea
                                      className="w-full p-4 rounded-lg bg-white dark:bg-secondary/20 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/30 transition-all resize-none shadow-lifted dark:shadow-dark-lifted placeholder-foreground/50"
                                      placeholder={
                                        activeTab === 'short-form'
                                          ? "What's the main topic or idea you want to post about?"
                                          : activeTab === 'long-form'
                                          ? "What's the main topic or idea for your long-form post?"
                                          : "What's the main topic or idea for your thread?"
                                      }
                                      value={topic}
                                      onChange={(e) => setTopic(e.target.value)}
                                      rows={3}
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground/80 dark:text-foreground/70">
                                      Target Audience
                                    </label>
                                    <textarea
                                      className="w-full p-4 rounded-lg bg-white dark:bg-secondary/20 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/30 transition-all resize-none shadow-lifted dark:shadow-dark-lifted placeholder-foreground/50"
                                      placeholder="Who is your target audience? Be specific about their interests, demographics, and pain points."
                                      value={audience}
                                      onChange={(e) => setAudience(e.target.value)}
                                      rows={3}
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground/80 dark:text-foreground/70">
                                      Writing Style
                                    </label>
                                    <textarea
                                      className="w-full p-4 rounded-lg bg-white dark:bg-secondary/20 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/30 transition-all resize-none shadow-lifted dark:shadow-dark-lifted placeholder-foreground/50"
                                      placeholder="How should the content be written? (e.g., professional, casual, storytelling)"
                                      value={style}
                                      onChange={(e) => setStyle(e.target.value)}
                                      rows={3}
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground/80 dark:text-foreground/70">
                                      Additional Guidelines
                                    </label>
                                    <textarea
                                      className="w-full p-4 rounded-lg bg-white dark:bg-secondary/20 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/30 transition-all resize-none shadow-lifted dark:shadow-dark-lifted placeholder-foreground/50"
                                      placeholder="Any specific requirements? (e.g., formatting preferences, tone, structure)"
                                      value={guidelines}
                                      onChange={(e) => setGuidelines(e.target.value)}
                                      rows={3}
                                    />
                                  </div>

                                  <AILoader
                                    isLoading={isLoading}
                                    disabled={!topic.trim()}
                                    onClick={generateContent}
                                  >
                                    {isLoading ? 'Generating...' : `Generate ${activeTab === 'short-form' ? 'Post' : activeTab === 'long-form' ? 'Long Form Post' : 'Thread'}`}
                                  </AILoader>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <GeneratedContent 
                          activeTab={activeTab} 
                          content={generatedContent} 
                          onClear={() => setGeneratedContent('')}
                          onRegenerate={async () => {
                            // Reuse the existing content generation logic
                            try {
                              setIsLoading(true);
                              const response = await fetch('/api/generatePost', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  postType: activeTab.replace('-form', ''),
                                  topic: `${topic} ${audience} ${style} ${guidelines}. Improve this response.`,
                                  audience,
                                  style,
                                  guidelines,
                                }),
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
                              console.error('Error generating content:', error);
                              alert('Failed to regenerate content. Please try again.');
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                        />
                      </main>
                    </div>
                  </div>
                </div>
              </HelmetProvider>
            </div>
          } />
        </Routes>
        
        <Footer />
        <PreferenceSelection 
          open={isPreferencesOpen} 
          onClose={handleClosePreferences}
          onSave={handleSavePreferences}
        />
      </div>
    </HelmetProvider>
  );
}

export default App
