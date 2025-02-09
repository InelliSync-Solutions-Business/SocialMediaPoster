import React from 'react';
import { NewsletterForm } from './components/NewsletterForm';
import { NewsletterPreview } from './components/NewsletterPreview';
import { useNewsletter } from './hooks/useNewsletter';

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
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Newsletter Generator</h1>
        <p className="text-gray-600">
          Create engaging newsletters with AI-powered content generation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <NewsletterForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </div>

        <div className="space-y-6">
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
