import { useState } from 'react';
import { Newsletter, NewsletterFormData, GeneratedNewsletter } from '../types/newsletter';

export const useNewsletter = () => {
  const [newsletter, setNewsletter] = useState<Newsletter>();
  const [generatedContent, setGeneratedContent] = useState<GeneratedNewsletter>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: NewsletterFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate newsletter');
      }

      const result = await response.json();
      console.log('Received newsletter response:', result);
      setNewsletter(data);
      setGeneratedContent(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    newsletter,
    generatedContent,
    isLoading,
    error,
    handleSubmit,
  };
};
