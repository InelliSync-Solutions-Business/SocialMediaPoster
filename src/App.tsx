import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async';
import * as Tabs from '@radix-ui/react-tabs'
import { Sun, Moon, Key } from 'lucide-react'
import { motion } from 'framer-motion'
import Templates from './components/Templates'
import GeneratedContent from './components/GeneratedContent'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'

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

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/generate" element={
        <HelmetProvider>
          <Helmet>
            <title>IntelliSync Solutions Social Media Writer</title>
            <meta name="description" content="AI-powered content generation for social media, long-form posts, and threads" />
            <meta name="keywords" content="AI writing, social media content, content generation, copywriting" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="canonical" href="https://home.intellisyncsolutions.io" />
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
                  <button
                    onClick={() => setIsDark(!isDark)}
                    className="p-2 rounded-lg hover:bg-background-hover dark:hover:bg-secondary/20 transition-colors"
                  >
                    {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </button>
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

                            <div className="flex gap-4">
                              <button className="px-4 py-2 rounded-lg bg-secondary/30 dark:bg-secondary/10 hover:bg-background-hover dark:hover:bg-secondary/20 transition-all shadow-lifted dark:shadow-dark-lifted">
                                Templates
                              </button>
                              <button className="px-4 py-2 rounded-lg bg-secondary/30 dark:bg-secondary/10 hover:bg-background-hover dark:hover:bg-secondary/20 transition-all shadow-lifted dark:shadow-dark-lifted">
                                Save Current
                              </button>
                            </div>

                            <button 
                              onClick={async () => {
                                try {
                                  setIsLoading(true);
                                  const response = await fetch('/api/generatePost', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      postType: activeTab.replace('-form', ''),
                                      topic,
                                      audience,
                                      style,
                                      guidelines,
                                    }),
                                  });

                                  const responseText = await response.text();
                                  console.log('Raw response:', responseText);

                                  let data;
                                  try {
                                    data = JSON.parse(responseText);
                                  } catch (parseError) {
                                    console.error('Failed to parse response:', parseError);
                                    alert('Failed to parse server response. Check console for details.');
                                    return;
                                  }

                                  if (data.success) {
                                    setGeneratedContent(data.content);
                                  } else {
                                    console.error('Error generating content:', data.error);
                                    alert('Failed to generate content. Please try again.');
                                  }
                                } catch (error) {
                                  console.error('Error:', error);
                                  alert('Failed to generate content. Please try again.');
                                } finally {
                                  setIsLoading(false);
                                }
                              }}
                              disabled={isLoading || !topic.trim()}
                              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-medium hover:opacity-90 transition-all dark:shadow-[0_0_15px_rgba(0,0,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isLoading ? 'Generating...' : `Generate ${activeTab === 'short-form' ? 'Post' : activeTab === 'long-form' ? 'Long Form Post' : 'Thread'}`}
                            </button>
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
                            topic,
                            audience,
                            style,
                            guidelines: guidelines ? `${guidelines}. Improve this response.` : 'Improve this response.',
                          }),
                        });

                        const responseText = await response.text();
                        console.log('Raw response:', responseText);

                        let data;
                        try {
                          data = JSON.parse(responseText);
                        } catch (parseError) {
                          console.error('Failed to parse response:', parseError);
                          alert('Failed to parse server response. Check console for details.');
                          return;
                        }

                        if (data.success) {
                          setGeneratedContent(data.content);
                        } else {
                          console.error('Error generating content:', data.error);
                          alert('Failed to regenerate content. Please try again.');
                        }
                      } catch (error) {
                        console.error('Error:', error);
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
      } />
    </Routes>
  )
}

export default App
