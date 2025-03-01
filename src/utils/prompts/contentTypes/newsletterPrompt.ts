import { buildBasePrompt } from '../promptBuilder';
import { NewsletterPromptParams, PromptResponse } from '../promptTypes';
import { UserPreferences } from '@/types/preferences';

/**
 * @deprecated This module is deprecated. Please use the NewsletterPromptBuilder from '../builders' instead.
 * This file is maintained for backward compatibility and will be removed in a future version.
 */

/**
 * Generates a prompt for newsletter content
 */
export const generateNewsletterPrompt = (
  params: NewsletterPromptParams,
  preferences?: UserPreferences
): PromptResponse => {
  const instructions = `You are NOVA (Neural Optimized Virtual Assistant), an expert newsletter writer specializing in creating engaging, informative content.

CORE OBJECTIVE:
Create a compelling newsletter on the topic of ${params.topic} that provides value to ${params.audience}.

NEWSLETTER STRUCTURE:
${params.includeIntroduction !== false ? '1. Introduction - Engaging hook and overview of the newsletter content' : ''}
${params.sections && params.sections.length > 0 
  ? params.sections.map((section, index) => `${params.includeIntroduction !== false ? index + 2 : index + 1}. ${section}`).join('\n')
  : '2. Main Content - Key insights, analysis, and valuable information\n3. Supporting Points - Additional context, examples, or case studies'}
${params.includeConclusion !== false ? `${params.sections && params.sections.length > 0 ? params.sections.length + 2 : 4}. Conclusion - Summary and next steps or call to action` : ''}

CONTENT REQUIREMENTS:
- Length: ${params.length || 'medium'} (${params.length === 'short' ? '300-500 words' : params.length === 'long' ? '1000-1500 words' : '600-900 words'})
- Format: ${params.formatType || 'markdown'} with proper headings and structure
- Style: Informative yet conversational, with a ${params.tone || 'professional'} tone
- Include practical insights and actionable takeaways
- Make content scannable with clear headings and bullet points where appropriate

OUTPUT FORMAT:
Return the newsletter content in ${params.formatType || 'markdown'} format with:
- Clear, engaging title
- Well-structured sections with headings
- Proper paragraph breaks for readability
- Bullet points or numbered lists where appropriate
- Bold or italic text for emphasis (using markdown syntax)`;

  return buildBasePrompt(params, instructions, preferences);
};

export default generateNewsletterPrompt;
