import { generateSystemPrompt } from './systemPrompt';
import { BasePromptParams, PromptResponse, TokenUsage } from './types/index';
import { UserPreferences } from '@/types/preferences';

// Import centralized utilities
import { estimateTokenCount, estimateTokenCost } from '../ai/tokenUtils';
import { truncateContent } from './contentProcessors';

// Core prompt builder functionality

/**
 * Core prompt builder function that all specific prompt generators will use
 */
export const buildBasePrompt = (
  params: BasePromptParams,
  instructions: string,
  preferences?: UserPreferences
): PromptResponse => {
  // Get the system prompt with user preferences
  const systemPrompt = generateSystemPrompt({ preferences });
  
  // Combine system prompt with specific instructions
  const combinedPrompt = `${systemPrompt}

${instructions}

CONTENT PARAMETERS:
- Primary Topic: ${params.topic}
- Target Audience: ${params.audience}
${params.guidelines ? `- Additional Guidelines: ${params.guidelines}` : ''}
${params.tone ? `- Tone: ${params.tone}` : ''}

FORMATTING REQUIREMENTS:
- Use proper markdown formatting for structure
- Include clear section headings where appropriate
- Ensure content is well-organized and scannable
- Maintain consistent voice throughout

Please generate content that is engaging, informative, and tailored to the specified audience.`;

  // Calculate estimated tokens
  const estimatedTokens = estimateTokenCount(combinedPrompt);
  
  // Determine model to use
  const model = params.model || 'gpt-4o-mini';
  
  return {
    prompt: combinedPrompt,
    estimatedTokens,
    model,
    systemPrompt
  };
};


