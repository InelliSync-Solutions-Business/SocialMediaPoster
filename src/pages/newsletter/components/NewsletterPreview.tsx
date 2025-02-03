import React from 'react';
import { Newsletter, GeneratedNewsletter } from '../types/newsletter';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface NewsletterPreviewProps {
  newsletter?: Newsletter;
  generatedContent?: GeneratedNewsletter;
  isLoading?: boolean;
}

export const NewsletterPreview: React.FC<NewsletterPreviewProps> = ({
  newsletter,
  generatedContent,
  isLoading,
}) => {
  if (!newsletter && !generatedContent && !isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <p>Fill out the form to generate your newsletter content</p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!generatedContent) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <p>Generated content will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="prose max-w-none">
        <pre className="whitespace-pre-wrap text-sm">
          {generatedContent.content}
        </pre>
      </div>
    </Card>
  );
};
