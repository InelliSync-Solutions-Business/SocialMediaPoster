import { useState, useCallback, useMemo } from 'react';
import { Newsletter, NewsletterFormData, GeneratedNewsletter, TokenUsage } from '../types/newsletter';

type StreamingState = {
  content: string;
  isDone: boolean;
};

interface UseNewsletterResult {
  newsletter?: Newsletter;
  generatedContent?: GeneratedNewsletter;
  isLoading: boolean;
  error: string | null;
  handleSubmit: (data: NewsletterFormData) => Promise<(() => void) | void>;
  regenerateNewsletter: () => Promise<void>;
  clearNewsletter: () => void;
  updateContent: (content: string) => void;
  streamingState: StreamingState;
  tokenUsage?: TokenUsage;
}

export const useNewsletter = (): UseNewsletterResult => {
  const [newsletter, setNewsletter] = useState<Newsletter | undefined>(undefined);
  const [generatedContent, setGeneratedContent] = useState<GeneratedNewsletter | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSubmittedData, setLastSubmittedData] = useState<NewsletterFormData | null>(null);
  const [streamingState, setStreamingState] = useState<StreamingState>({ content: '', isDone: false });
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | undefined>(undefined);

  const handleSubmit = useCallback(async (data: NewsletterFormData) => {
    setIsLoading(true);
    setError(null);
    setLastSubmittedData(data);
    setStreamingState({ content: '', isDone: false });
    setTokenUsage(undefined);
    
    try {
      // Use fetch API to make a POST request to the server
      const response = await fetch('/api/generate-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: data.topic,
          type: data.type,
          tone: data.tone,
          length: data.length,
          writingStyle: data.writingStyle,
          targetAudience: data.targetAudience,
          keyPoints: data.keyPoints || [],
          additionalGuidelines: data.additionalGuidelines || '',
          model: data.model
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate newsletter');
      }

      const result = await response.json();
      
      // Store token usage information
      if (result.usage) {
        setTokenUsage({
          inputTokens: result.usage.inputTokens,
          outputTokens: result.usage.outputTokens,
          estimatedCost: result.usage.estimatedCost
        });
      }

      setNewsletter(data);
      setGeneratedContent({
        content: result.content,
        metadata: {
          topic: data.topic,
          length: data.length,
          writingStyle: data.writingStyle,
          targetAudience: data.targetAudience,
          newsletterType: data.type,
          tone: data.tone
        },
        usage: result.usage
      });
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error generating newsletter:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsLoading(false);
    }
  }, []);

  const regenerateNewsletter = useCallback(async () => {
    if (lastSubmittedData) {
      await handleSubmit(lastSubmittedData);
    }
  }, [lastSubmittedData, handleSubmit]);

  const clearNewsletter = useCallback(() => {
    setNewsletter(undefined);
    setGeneratedContent(undefined);
    setError(null);
    setTokenUsage(undefined);
  }, []);

  const updateContent = useCallback((content: string) => {
    if (generatedContent) {
      setGeneratedContent({
        ...generatedContent,
        content
      });
    }
  }, [generatedContent]);

  // Memoize the return value to ensure consistent object reference
  return useMemo(() => ({
    newsletter,
    generatedContent,
    isLoading,
    error,
    handleSubmit,
    regenerateNewsletter,
    clearNewsletter,
    updateContent,
    streamingState,
    tokenUsage
  }), [
    newsletter, 
    generatedContent, 
    isLoading, 
    error, 
    handleSubmit, 
    regenerateNewsletter, 
    clearNewsletter,
    updateContent,
    streamingState,
    tokenUsage
  ]);
};
