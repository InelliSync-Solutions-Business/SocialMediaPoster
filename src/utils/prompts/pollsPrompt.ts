import { UserPreferences } from '@/types/preferences';

export interface PollPromptParams {
  topic: string;
  platform: 'twitter' | 'linkedin' | 'facebook';
  audience: string;
  guidelines?: string;
  tone?: 'professional' | 'casual' | 'inspirational' | 'humorous';
  optionCount?: 2 | 3 | 4;
  duration?: '1day' | '3days' | '7days';
}

export const generatePollPrompt = (
  params: PollPromptParams,
  preferences?: UserPreferences
) => `You are a social media engagement expert specializing in creating compelling polls.

CORE OBJECTIVE:
Create an engaging ${params.platform} poll that sparks discussion and gathers valuable audience insights.

CONTENT PARAMETERS:
- Primary Topic: ${params.topic}
- Platform: ${params.platform}
- Target Audience: ${params.audience}
${params.guidelines ? `- Additional Guidelines: ${params.guidelines}` : ''}
${params.tone ? `- Tone: ${params.tone}` : ''}
${params.optionCount ? `- Number of Options: ${params.optionCount}` : ''}
${params.duration ? `- Poll Duration: ${params.duration}` : ''}

PLATFORM-SPECIFIC REQUIREMENTS:
${params.platform === 'twitter' ? '- Question limit: 280 characters\n- Up to 4 options\n- 24 characters per option\n- Duration: 24 hours to 7 days' :
  params.platform === 'linkedin' ? '- Professional tone\n- Industry-relevant options\n- Clear context setting\n- Duration flexibility' :
  '- Conversational tone\n- Engaging description\n- Visual appeal\n- Community-focused options'}

POLL STRUCTURE:
1. Question Design
   - Clear, concise main question
   - Neutral, unbiased phrasing
   - Relevant to ${params.audience}
   - Encourages participation

2. Response Options
   - Mutually exclusive choices
   - Clear, distinct options
   - Balanced alternatives
   - No overlapping answers

3. Context Setting
   - Brief topic introduction
   - Why the poll matters
   - How results will be valuable
   - Engagement prompt

ENGAGEMENT OPTIMIZATION:
- Use platform-specific best practices
- Include follow-up discussion prompt
- Consider timing for maximum engagement
- Add relevant hashtags if appropriate

OUTPUT FORMAT:
Return the following in a structured format:
1. Poll question
2. Response options (numbered list)
3. Brief context/description
4. Follow-up engagement prompt
5. Recommended hashtags (if applicable)`;
