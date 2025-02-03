import { UserPreferences } from '@/types/preferences';

export interface ShortFormPromptParams {
  topic: string;
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram';
  style: string;
  audience: string;
  guidelines?: string;
  tone?: 'professional' | 'casual' | 'inspirational' | 'humorous';
}

const PLATFORM_GUIDELINES = {
  twitter: {
    maxLength: '280 characters',
    hashtagUsage: '2-3 strategic hashtags',
    style: 'Concise, impactful, with a clear hook',
    features: ['Threads support', 'Media attachments', 'Polls']
  },
  linkedin: {
    maxLength: '3000 characters',
    hashtagUsage: '3-5 industry-relevant hashtags',
    style: 'Professional, insightful, thought leadership',
    features: ['Document sharing', 'Rich media', 'Professional networking']
  },
  facebook: {
    maxLength: '63,206 characters',
    hashtagUsage: '1-2 relevant hashtags',
    style: 'Conversational, engaging, community-focused',
    features: ['Rich media support', 'Event integration', 'Community engagement']
  },
  instagram: {
    maxLength: '2,200 characters',
    hashtagUsage: '20-25 strategic hashtags (in first comment)',
    style: 'Visual-first, engaging, story-driven',
    features: ['Carousel posts', 'Stories integration', 'Shopping tags']
  }
};

export const generateShortFormPrompt = (
  params: ShortFormPromptParams,
  preferences?: UserPreferences
) => {
  const platform = PLATFORM_GUIDELINES[params.platform];
  
  return `CONTENT TYPE: Short-Form ${params.platform.charAt(0).toUpperCase() + params.platform.slice(1)} Post

CORE OBJECTIVE:
Create compelling, platform-optimized content that drives engagement while maintaining tech thought leadership.

CONTENT PARAMETERS:
Topic: ${params.topic}
Target Audience: ${params.audience}
Writing Style: ${params.style}
${params.tone ? `Tone: ${params.tone}` : ''}
${params.guidelines ? `Additional Guidelines: ${params.guidelines}` : ''}

PLATFORM-SPECIFIC REQUIREMENTS:
- Maximum Length: ${platform.maxLength}
- Hashtag Strategy: ${platform.hashtagUsage}
- Content Style: ${platform.style}
- Available Features: ${platform.features.join(', ')}

OPTIMIZATION GUIDELINES:
1. Hook & Structure
   - Start with a compelling hook that grabs attention
   - Use platform-appropriate formatting for readability
   - Maintain clear message hierarchy

2. Engagement Elements
   - Include a clear call-to-action
   - Use platform-native features effectively
   - Encourage meaningful interaction

3. Tech Leadership
   - Demonstrate domain expertise
   - Connect to current tech trends
   - Provide actionable insights

4. Brand Voice
   - Maintain professional yet approachable tone
   - Use industry-appropriate terminology
   - Balance technical depth with accessibility

OUTPUT REQUIREMENTS:
1. Primary post content
2. Suggested hashtags
3. Any additional recommendations (e.g., timing, media suggestions)`;
}
