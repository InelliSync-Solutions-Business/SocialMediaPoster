export type NewsletterType = 'tech-trends' | 'industry-insights' | 'product-updates' | 'company-news';
export type NewsletterTone = 'professional' | 'casual' | 'inspirational' | 'technical';
export type NewsletterLength = 'short' | 'medium' | 'long';

export interface Newsletter {
  type: NewsletterType;
  topic: string;
  tone: NewsletterTone;
  length: NewsletterLength;
  targetAudience: string;
  writingStyle: string;
  additionalGuidelines?: string;
}

export interface NewsletterFormData extends Newsletter {
  customSections?: string[];
}

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
}
