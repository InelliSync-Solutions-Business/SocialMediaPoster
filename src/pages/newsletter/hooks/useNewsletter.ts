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
      // Prepare the request body
      const requestBody = JSON.stringify({
        topic: data.topic,
        type: data.type,
        tone: data.tone,
        length: data.length,
        writingStyle: data.writingStyle,
        targetAudience: data.targetAudience,
        keyPoints: data.keyPoints || [],
        additionalGuidelines: data.additionalGuidelines || '',
        model: data.model
      });
      
      // Create AbortController for cancellation support
      const controller = new AbortController();
      const { signal } = controller;
      
      // Set up the newsletter metadata
      setNewsletter(data);
      
      // Create an empty content structure
      const initialContent = {
        content: '',
        metadata: {
          topic: data.topic,
          length: data.length,
          writingStyle: data.writingStyle,
          targetAudience: data.targetAudience,
          newsletterType: data.type,
          tone: data.tone
        },
        usage: {
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          estimatedCost: 0
        }
      };
      
      setGeneratedContent(initialContent);
      
      // Build query parameters for streaming request
      const params = new URLSearchParams({
        stream: 'true',
        topic: data.topic || '',
        targetAudience: data.targetAudience || '',
        writingStyle: data.writingStyle || 'Informative',
        type: data.type || 'tech-trends',
        length: data.length || 'medium',
        tone: data.tone || 'professional',
        model: data.model || 'gpt-4o-mini'
      });
      
      if (data.additionalGuidelines) {
        params.append('additionalGuidelines', data.additionalGuidelines);
      }
      
      console.log('Creating EventSource with params:', params.toString());
      
      // Create EventSource for streaming with query parameters
      const eventSource = new EventSource(`/api/generate-newsletter?${params.toString()}`);
      
      // Add connection opened handler
      eventSource.onopen = () => {
        console.log('EventSource connection opened');
      };
      
      let accumulatedContent = '';
      
      // Clean up function to be returned
      const cleanup = () => {
        eventSource.close();
        controller.abort();
        setIsLoading(false);
      };
      
      // Handle incoming events
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle content chunks
          if (data.content) {
            accumulatedContent += data.content;
            setStreamingState(prev => ({
              content: accumulatedContent,
              isDone: prev.isDone
            }));
            
            // Update the generated content as we receive it
            setGeneratedContent(prev => prev ? {
              ...prev,
              content: accumulatedContent
            } : initialContent);
          }
          
          // Handle completion
          if (data.done) {
            setStreamingState({
              content: accumulatedContent,
              isDone: true
            });
            
            // Store token usage information
            if (data.usage) {
              setTokenUsage({
                inputTokens: data.usage.inputTokens,
                outputTokens: data.usage.outputTokens,
                estimatedCost: data.usage.estimatedCost || 0
              });
              
              // Update the final content with usage info
              setGeneratedContent(prev => prev ? {
                ...prev,
                content: accumulatedContent,
                usage: {
                  inputTokens: data.usage.inputTokens,
                  outputTokens: data.usage.outputTokens,
                  totalTokens: data.usage.totalTokens,
                  estimatedCost: data.usage.estimatedCost || 0
                }
              } : initialContent);
            }
            
            setIsLoading(false);
            eventSource.close();
          }
          
          // Handle errors
          if (data.error) {
            throw new Error(data.message || 'Error during content generation');
          }
        } catch (err) {
          console.error('Error processing streaming data:', err);
          setError(err instanceof Error ? err.message : 'An error occurred while processing the response');
          eventSource.close();
          setIsLoading(false);
        }
      };
      
      // Handle connection errors
      eventSource.onerror = (err) => {
        console.error('EventSource error:', err);
        setError('Connection error while streaming content. Please check that all required fields are filled out.');
        console.log('Form data that caused the error:', data);
        eventSource.close();
        setIsLoading(false);
      };
      
      // Return cleanup function
      return cleanup;
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
