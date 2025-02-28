export type AIModel = 'gpt-4o' | 'gpt-4o-mini' | 'gpt-3.5-turbo' | 'gpt-4.5' | 'o1' | 'o1-mini';

export type NewsletterType = 
  | 'tech-trends' 
  | 'industry-insights' 
  | 'product-updates' 
  | 'company-news'
  | 'educational'
  | 'case-studies'
  | 'tutorials'
  | 'market-analysis'
  | 'global-trends'
  | 'financial-updates';

export type NewsletterTone = 'professional' | 'casual' | 'inspirational' | 'technical';
export type NewsletterLength = 'short' | 'medium' | 'long';

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
}

export interface Newsletter {
  topic: string;
  type: NewsletterType;
  tone: NewsletterTone;
  length: NewsletterLength;
  writingStyle: string;
  targetAudience: string;
  keyPoints?: string[];
  additionalGuidelines?: string;
  model: AIModel;
}

export interface NewsletterFormData extends Newsletter {}

export interface GeneratedNewsletter {
  content: string;
  metadata: {
    topic: string;
    length: NewsletterLength;
    writingStyle: string;
    targetAudience: string;
    newsletterType: NewsletterType;
    tone: NewsletterTone;
  };
  usage?: TokenUsage;
}
