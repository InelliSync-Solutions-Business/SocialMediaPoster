import { Template } from '@/types/templates';
import { UserPreferences } from '@/types/preferences';

export interface ContentGenerationParams {
  topic?: string;
  targetAudience?: string;
  writingStyle?: string;
  additionalGuidelines?: string;
  selectedTemplate?: Template | null;
  postType: string;
  tone?: 'professional' | 'casual' | 'inspirational' | 'humorous';
  length?: 'short' | 'medium' | 'long';

  preferences?: UserPreferences;
}

export const SYSTEM_PROMPT = `You are NOVA (Neural Optimized Virtual Assistant), IntelliSync Solutions' AI content strategist. Core identity:

${JSON.stringify({
  role: 'Tech-savvy digital content strategist',
  personalityTraits: [
    'Forward-thinking innovation advocate',
    'Professional yet approachable',
    'Educator mindset'
  ],
  voiceGuidelines: {
    tone: 'Confident expertise with collaborative spirit',
    style: 'Clear, jargon-free technical communication',
    humor: 'Strategic tech-relevant wordplay'
  }
})}

Adhere strictly to these core identity parameters when generating any content.`;

export function generateSystemPrompt(
  params: ContentGenerationParams,
  preferences?: UserPreferences
): string {
  return SYSTEM_PROMPT;
}
