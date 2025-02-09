import { useState, useCallback, useMemo } from 'react';
import { Newsletter, NewsletterFormData, GeneratedNewsletter } from '../types/newsletter';

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
}

export const useNewsletter = (): UseNewsletterResult => {
  const [newsletter, setNewsletter] = useState<Newsletter | undefined>(undefined);
  const [generatedContent, setGeneratedContent] = useState<GeneratedNewsletter | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSubmittedData, setLastSubmittedData] = useState<NewsletterFormData | null>(null);
  const [streamingState, setStreamingState] = useState<StreamingState>({ content: '', isDone: false });

  const handleSubmit = useCallback(async (data: NewsletterFormData) => {
    setIsLoading(true);
    setError(null);
    setLastSubmittedData(data);
    setStreamingState({ content: '', isDone: false });
    
    try {
      const response = await fetch(`/api/generate-newsletter?${
        new URLSearchParams(Object.fromEntries(
          Object.entries({
            topic: data.topic,
            audience: data.targetAudience,
            tone: data.tone,
            theme: data.theme || '',
            keyPoints: (data.keyPoints || []).join(','),
            length: data.length
          }).filter(([_, v]) => v != null && v !== '')
        ))
      }`);

      const eventSource = new EventSource(response.url);

      let accumulatedContent = '';
      let errorOccurred = false;

      eventSource.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);

          // Handle error messages
          if (parsedData.error) {
            errorOccurred = true;
            setError(parsedData.message || 'An unknown error occurred');
            eventSource.close();
            setIsLoading(false);
            return;
          }

          // Handle content chunks
          if (parsedData.content) {
            accumulatedContent += parsedData.content;
            setStreamingState({ content: accumulatedContent, isDone: false });
          }

          // Handle final message
          if (parsedData.done) {
            eventSource.close();
            setStreamingState({ content: accumulatedContent, isDone: true });
            setNewsletter(data);
            setGeneratedContent({
              content: accumulatedContent,
              metadata: {
                topic: data.topic,
                length: data.length,
                writingStyle: data.writingStyle,
                targetAudience: data.targetAudience,
                newsletterType: data.type,
                tone: data.tone
              }
            });
            setIsLoading(false);
          }
        } catch (parseError) {
          console.error('Error parsing event data:', parseError);
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        eventSource.close();
        setError('Failed to generate newsletter. Please try again.');
        setIsLoading(false);
      };

      // Timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        if (eventSource.readyState !== EventSource.CLOSED) {
          eventSource.close();
          setError('Newsletter generation timed out. Please try again.');
          setIsLoading(false);
        }
      }, 60000); // 60 seconds timeout

      // Cleanup function to close EventSource and clear timeout
      return () => {
        eventSource.close();
        clearTimeout(timeoutId);
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Newsletter generation error:', errorMessage);
      setIsLoading(false);
    }
  }, []);

  const regenerateNewsletter = useCallback(async () => {
    if (lastSubmittedData) {
      await handleSubmit(lastSubmittedData);
    } else {
      setError('No previous newsletter data to regenerate');
    }
  }, [lastSubmittedData, handleSubmit]);

  const clearNewsletter = useCallback(() => {
    setNewsletter(undefined);
    setGeneratedContent(undefined);
    setLastSubmittedData(null);
    setError(null);
  }, []);

  const updateContent = useCallback((content: string) => {
    if (generatedContent) {
      setGeneratedContent({ ...generatedContent, content });
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
  }), [
    newsletter, 
    generatedContent, 
    isLoading, 
    error, 
    handleSubmit, 
    regenerateNewsletter, 
    clearNewsletter,
    updateContent,
    streamingState
  ]);
};
