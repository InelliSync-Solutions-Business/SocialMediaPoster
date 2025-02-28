import React from 'react';
import { NewsletterForm } from './components/NewsletterForm';
import { NewsletterPreview } from './components/NewsletterPreview';
import { useNewsletter } from './hooks/useNewsletter';
import { Sparkles, MailOpen } from 'lucide-react';

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
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 xl:p-10">
      <div className="mb-6 md:mb-8 text-center">
        <div className="inline-flex items-center justify-center gap-2 mb-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <MailOpen className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold gradient-text">Newsletter Generator</h1>
          <div className="bg-primary/10 p-2 rounded-full">
            <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
        </div>
        <p className="text-foreground/80 max-w-2xl mx-auto text-sm md:text-base xl:text-lg">
          Create engaging, professional newsletters with AI-powered content generation. 
          Customize your newsletter's tone, style, and content to perfectly match your brand.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-6 md:gap-8 relative">
        <div className="space-y-6 xl:col-span-5">
          <div className="sticky top-6">
            <NewsletterForm 
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>

        <div className="space-y-6 xl:col-span-7">
          <NewsletterPreview 
            newsletter={newsletter}
            generatedContent={generatedContent}
            isLoading={isLoading}
            onRegenerate={regenerateNewsletter}
            onClear={clearNewsletter}
            onUpdateContent={updateContent}
            streamingState={streamingState}
          />
        </div>
      </div>
    </div>
  );
};

export default NewsletterPage;
