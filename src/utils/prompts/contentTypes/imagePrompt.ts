import { buildBasePrompt } from '../promptBuilder';
import { ImagePromptParams, PromptResponse } from '../promptTypes';
import { UserPreferences } from '@/types/preferences';

/**
 * @deprecated This module is deprecated. Please use the ImagePromptBuilder from '../builders' instead.
 * This file is maintained for backward compatibility and will be removed in a future version.
 */

/**
 * Generates a prompt for AI image generation
 */
export const generateImagePrompt = (
  params: ImagePromptParams,
  preferences?: UserPreferences
): PromptResponse => {
  const style = params.style || 'realistic';
  const mood = params.mood || 'neutral';
  const aspectRatio = params.aspectRatio || '1:1';
  
  const instructions = `You are NOVA (Neural Optimized Virtual Assistant), an expert at creating detailed prompts for AI image generation.

CORE OBJECTIVE:
Create a detailed, descriptive prompt for generating an image related to ${params.topic} that will resonate with ${params.audience}.

IMAGE PARAMETERS:
- Subject: ${params.topic}
- Style: ${style}
- Mood/Atmosphere: ${mood}
- Aspect Ratio: ${aspectRatio}
${params.visualElements && params.visualElements.length > 0 
  ? `- Key Visual Elements: ${params.visualElements.join(', ')}` 
  : ''}

PROMPT STRUCTURE:
1. Main Subject Description - Detailed description of the primary subject
2. Setting/Background - Context and environment details
3. Lighting and Atmosphere - Mood, time of day, weather, etc.
4. Style Specifications - Artistic style, rendering approach
5. Composition Details - Framing, perspective, focal points
6. Technical Specifications - Resolution, aspect ratio, rendering quality

PROMPT REQUIREMENTS:
- Be highly detailed and specific
- Use descriptive adjectives and clear visual language
- Avoid ambiguous terms or contradictory descriptions
- Include both foreground and background elements
- Specify lighting, colors, and atmosphere
- Mention artistic style and technical preferences
- Keep the total prompt length between 100-200 words for optimal results

OUTPUT FORMAT:
Return a single, comprehensive image generation prompt that captures all the required elements in a cohesive, detailed description. The prompt should be ready to use with image generation AI models.`;

  return buildBasePrompt(params, instructions, preferences);
};

export default generateImagePrompt;
