import { z } from 'zod';

export const newsletterSchema = z.object({
  type: z.enum([
    'tech-trends', 
    'industry-insights', 
    'product-updates', 
    'company-news',
    'educational',
    'case-studies',
    'tutorials',
    'market-analysis',
    'global-trends',
    'financial-updates'
  ]),
  topic: z.string().min(1, 'Topic is required').max(200, 'Topic is too long'),
  tone: z.enum(['professional', 'casual', 'inspirational', 'technical']),
  length: z.enum(['short', 'medium', 'long']),
  targetAudience: z.string().min(1, 'Target audience is required'),
  writingStyle: z.string().min(1, 'Writing style is required'),
  additionalGuidelines: z.string().optional(),
  customSections: z.array(z.string()).optional(),
  model: z.enum(['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo', 'gpt-4.5', 'o1', 'o1-mini']).default('gpt-4o-mini'),
});
