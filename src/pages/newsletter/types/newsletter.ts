export type AIModel =
  | 'gpt-04-mini'
  | 'gpt-4.1'
  | 'gpt-4.1-nano'
  | 'gpt-4.1-mini'
  | 'chatgpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-o3-mini';

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

export type NewsletterTone = 
  | 'professional' 
  | 'casual' 
  | 'inspirational' 
  | 'technical'
  | 'engaging'
  | 'authoritative'
  | 'storytelling'
  | 'humorous'
  | 'persuasive'
  | 'insightful'
  | 'visionary'
  | 'educational'
  | 'empathetic'
  | 'controversial';

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
