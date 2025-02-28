import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import { MainLayout } from './components/layout/MainLayout';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ContentGenerator from './components/ContentGenerator';
import Dashboard from './components/Dashboard';
import { default as SettingsComponent } from './components/Settings';
import Analytics from './components/Analytics';
import Templates from './components/Templates';
import History from './components/History';
import Help from './components/Help';
import PreferenceSelection from './components/PreferenceSelection';
import { UserPreferences } from './types/preferences';
import LandingPage from './pages/LandingPage';
import Footer from './components/Footer';
import PricingPage from './pages/PricingPage';
import NewsletterPage from './pages/newsletter/NewsletterPage';
import Polls from './components/Polls';
import { Toaster } from 'sonner';

interface Template {
  id: string;
  title: string;
  description: string;
  category: 'Professional' | 'Casual & Engaging' | 'Educational Content';
  tag: 'Business' | 'General' | 'Education';
  postType: 'short' | 'long' | 'thread';
  audience: string;
  style: string;
}

export interface GenerateParams {
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
  const [isDark, setIsDark] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [currentView, setCurrentView] = useState<string>('general');
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    platforms: {
      twitter: {
        hashtagLimit: 5,
        threadSupport: true,
        hashtagSuggestions: true,
        templateCustomization: true,
        showEngagement: true
      },
      linkedin: {
        professionalTone: true,
        articleSupport: true,
        pollSupport: true,
        templateCustomization: true,
        showEngagement: true
      },
      facebook: {
        linkPreview: true,
        templateCustomization: true,
        showEngagement: true
      },
      instagram: {
        imageFormat: 'square',
        hashtagSuggestions: true,
        templateCustomization: true,
        showEngagement: true
      },
      newsletter: {
        templateCustomization: true,
        showEngagement: true
      },
      tiktok: {
        captionLimit: 150,
        templateCustomization: true,
        showEngagement: true
      },
      discord: {
        templateCustomization: true,
        showEngagement: true
      }
    },
    platformPreferences: {
      twitter: {
        hashtagLimit: 5,
        threadSupport: true,
        hashtagSuggestions: true,
        templateCustomization: true,
        showEngagement: true,
        enabled: true,
        handle: '@yourtwitterhandle',
        style: 'default',
        defaultHashtags: ['socialmedia', 'marketing', 'content']
      },
      linkedin: {
        professionalTone: true,
        articleSupport: true,
        pollSupport: true,
        templateCustomization: true,
        showEngagement: true,
        enabled: true,
        handle: 'yourlinkedinprofile',
        style: 'professional',
        defaultHashtags: ['business', 'networking', 'professional']
      },
      facebook: {
        linkPreview: true,
        templateCustomization: true,
        showEngagement: true,
        enabled: true,
        handle: 'yourfacebookpage',
        style: 'casual',
        defaultHashtags: ['community', 'social', 'updates']
      },
      instagram: {
        imageFormat: 'square',
        hashtagSuggestions: true,
        templateCustomization: true,
        showEngagement: true,
        enabled: true,
        handle: '@yourinstagramhandle',
        style: 'engaging',
        defaultHashtags: ['instadaily', 'photooftheday', 'content']
      },
      newsletter: {
        templateCustomization: true,
        showEngagement: true,
        enabled: true,
        handle: 'yournewsletter',
        style: 'professional',
        defaultHashtags: ['newsletter', 'updates', 'insights']
      },
      tiktok: {
        captionLimit: 150,
        templateCustomization: true,
        showEngagement: true,
        enabled: true,
        handle: '@yourtiktokhandle',
        style: 'engaging',
        defaultHashtags: ['tiktoktips', 'trending', 'viral']
      },
      discord: {
        templateCustomization: true,
        showEngagement: true,
        enabled: true,
        handle: 'yourdiscordserver',
        style: 'casual',
        defaultHashtags: ['discord', 'community', 'chat']
      }
    },
    contentTypes: {
      shortForm: true,
      longForm: true,
      threads: true,
      polls: true
    },
    writingStyle: 'Professional',
    targetAudience: 'Business professionals',
    tokenLimits: {
      twitter: 280,
      linkedin: 3000,
      facebook: 5000,
      instagram: 2200
    },
    contentPreferences: {
      postFrequency: 'weekly',
      includeEmojis: true,
      includeHashtags: true,
      includeLinks: true,
      includeMentions: false,
      contentTypes: ['blog', 'social', 'ad'],
      brandGuidelines: 'Keep content professional and aligned with company values. Use brand colors and maintain consistent voice across all platforms.'
    }
  });
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  // Handle opening preferences dialog
  const handleOpenPreferences = () => {
    setIsPreferencesOpen(true);
  };

  // Handle closing preferences dialog
  const handleClosePreferences = () => {
    setIsPreferencesOpen(false);
  };

  // Handle saving preferences
  const handleSavePreferences = (newPreferences: UserPreferences) => {
    setUserPreferences(newPreferences);
    setIsPreferencesOpen(false);
  };

  // Handle template selection
  const handleTemplateSelect = (template: Template) => {
    // Logic to handle template selection
    navigate('/app/generator');
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

  const routes = [
    { path: '/', label: 'Home' },
    { path: '/content-generator', label: 'Content Generator' },
    { path: '/templates', label: 'Templates' },
    { path: '/pricing', label: 'Pricing' }
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

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <HelmetProvider>
        <CssBaseline />
        <Helmet>
          <title>IntelliSync Solutions - Social Media Writer</title>
          <meta name="description" content="AI-powered social media content generator" />
        </Helmet>
        <div className={`app-container ${isDark ? 'dark-mode' : 'light-mode'}`}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
            <Route path="/generator" element={<Navigate to="/app/generator" replace />} />
            <Route path="/templates" element={<Navigate to="/app/templates" replace />} />
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/analytics" element={<Navigate to="/app/analytics" replace />} />
            <Route path="/history" element={<Navigate to="/app/history" replace />} />
            <Route path="/help" element={<Navigate to="/app/help" replace />} />
            <Route path="/newsletter" element={<Navigate to="/app/newsletter" replace />} />
            <Route path="/polls" element={<Navigate to="/app/polls" replace />} />
            <Route
              path="/app/*"
              element={
                <MainLayout>
                  <div className="flex h-screen overflow-hidden">
                    {/* Sidebar */}
                    <Sidebar className="hidden md:block" />
                    
                    <div className="flex flex-col flex-1 overflow-hidden">
                      {/* Header */}
                      <Header 
                        isDark={isDark} 
                        toggleDarkMode={() => setIsDark(!isDark)} 
                        openPreferences={handleOpenPreferences} 
                      />
                      
                      {/* Main Content */}
                      <div className="flex-1 overflow-auto p-4">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/generator" element={<ContentGenerator userPreferences={userPreferences} />} />
                          <Route path="/templates" element={<Templates 
                            onTemplateSelect={handleTemplateSelect}
                            onNavigateToGenerator={() => navigate('/app/generator')}
                          />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="/history" element={<History />} />
                          <Route path="/settings" element={
                            <SettingsComponent 
                              userPreferences={userPreferences} 
                              onUpdatePreferences={handleSavePreferences} 
                            />
                          } />
                          <Route path="/help" element={<Help />} />
                          <Route path="/newsletter" element={<NewsletterPage />} />
                          <Route path="/polls" element={<Polls />} />
                        </Routes>
                      </div>
                      
                      <Footer className="mt-auto" />
                    </div>
                  </div>

                  <PreferenceSelection
                    open={isPreferencesOpen}
                    onClose={handleClosePreferences}
                    onSave={handleSavePreferences}
                    onNavigate={setCurrentView}
                    errors={errors}
                  />
                </MainLayout>
              }
            />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App
