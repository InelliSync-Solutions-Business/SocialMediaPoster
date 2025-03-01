import { buildBasePrompt } from '../promptBuilder';
import { PollPromptParams, PromptResponse } from '../promptTypes';
import { UserPreferences } from '@/types/preferences';

/**
 * @deprecated This module is deprecated. Please use the PollPromptBuilder from '../builders' instead.
 * This file is maintained for backward compatibility and will be removed in a future version.
 * 
 * Generates a prompt for social media poll content
 */
export const generatePollPrompt = (
  params: PollPromptParams,
  preferences?: UserPreferences
): PromptResponse => {
  const optionCount = params.optionCount || 4;
  const duration = params.duration || '1day';
  
  const instructions = `You are NOVA (Neural Optimized Virtual Assistant), a social media engagement expert specializing in creating compelling polls.

CORE OBJECTIVE:
Create an engaging ${params.platform} poll that sparks discussion and gathers valuable audience insights on the topic of ${params.topic}.

PLATFORM-SPECIFIC REQUIREMENTS:
${params.platform === 'twitter' 
  ? `- Question limit: 280 characters\n- Up to ${optionCount} options\n- 24 characters per option\n- Duration: ${duration === '1day' ? '24 hours' : duration === '3days' ? '3 days' : '7 days'}`
  : params.platform === 'linkedin'
  ? `- Professional tone\n- Industry-relevant options\n- Clear context setting\n- Duration: ${duration === '1day' ? '1 day' : duration === '3days' ? '3 days' : '1 week'}`
  : `- Conversational tone\n- Engaging description\n- Visual appeal\n- Community-focused options\n- Duration: ${duration === '1day' ? '1 day' : duration === '3days' ? '3 days' : '7 days'}`}

POLL STRUCTURE:
1. Question Design
   - Clear, concise main question
   - Neutral, unbiased phrasing
   - Relevant to ${params.audience}
   - Encourages participation

2. Response Options
   - ${optionCount} mutually exclusive choices
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
2. ${optionCount} response options (numbered list)
3. Brief context/description
4. Follow-up engagement prompt
5. Recommended hashtags (if applicable)`;

  return buildBasePrompt(params, instructions, preferences);
};

export default generatePollPrompt;
