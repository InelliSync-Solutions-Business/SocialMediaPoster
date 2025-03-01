import React from 'react';
import { NewsletterForm } from './components/NewsletterForm';
import { NewsletterPreview } from './components/NewsletterPreview';
import { useNewsletter } from './hooks/useNewsletter';
import { Sparkles, MailOpen } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Section, ResponsiveContainer } from '@/components/ui/responsive-container';

export const NewsletterPage: React.FC = () => {
  const {
    newsletter,
    isLoading,
    error,
    handleSubmit,
    generatedContent,
    regenerateNewsletter,
    clearNewsletter,
    updateContent,
    streamingState
  } = useNewsletter();

  return (
    <MainLayout>
      <Section
        title={
          <div className="flex items-center justify-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <MailOpen className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <span className="gradient-text">Newsletter Generator</span>
            <div className="bg-primary/10 p-2 rounded-full">
              <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
          </div>
        }
        description="Create engaging, professional newsletters with AI-powered content generation. Customize your newsletter's tone, style, and content to perfectly match your brand."
        className="text-center mb-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-4 md:gap-6 relative">
        <div className="space-y-4 xl:col-span-5">
          <div className="sticky top-6">
            <ResponsiveContainer>
              <NewsletterForm 
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
              />
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4 xl:col-span-7">
          <ResponsiveContainer>
            <NewsletterPreview 
              newsletter={newsletter}
              generatedContent={generatedContent}
              isLoading={isLoading}
              onRegenerate={regenerateNewsletter}
              onClear={clearNewsletter}
              onUpdateContent={updateContent}
              streamingState={streamingState}
            />
          </ResponsiveContainer>
        </div>
      </div>
      </Section>
    </MainLayout>
  );
};

export default NewsletterPage;
