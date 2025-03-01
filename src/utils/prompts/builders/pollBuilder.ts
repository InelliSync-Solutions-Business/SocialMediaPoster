/**
 * Poll prompt builder
 */

import { BasePromptBuilder } from './baseBuilder';
import { PollParams, PromptResponse } from '../types';
import { PROMPT_TEMPLATES, CONFIG, SYSTEM_PROMPTS } from '../templates';
import { fillTemplate, mapStyleToTone } from '../utils';

/**
 * Builder for poll prompts
 */
export class PollPromptBuilder extends BasePromptBuilder {
  constructor() {
    super('poll');
    this.setTemplate(PROMPT_TEMPLATES.poll);
    this.setDefaultModel('gpt-4o-mini');
    this.setDefaultTemperature(0.8); // Slightly higher for creativity
  }
  
  /**
   * Builds a poll prompt from the given parameters
   */
  build(params: PollParams): PromptResponse {
    if (!this.template) {
      throw new Error('Template not set. Call setTemplate() before building a prompt.');
    }
    
    // Process base parameters
    const baseVariables = this.processBaseParams(params);
    
    // Get platform guidance
    const platform = (params.platform || 'default').toLowerCase();
    const platformGuidance = CONFIG.poll.platformGuidance[platform as keyof typeof CONFIG.poll.platformGuidance] || 
                             CONFIG.poll.platformGuidance.default;
    
    // Ensure a valid tone
    const tone = mapStyleToTone(params.tone || params.writingStyle);
    
    // Poll-specific variables
    const pollVariables = {
      ...baseVariables,
      platform: params.platform || 'social media',
      platformGuidance,
      optionCount: params.optionCount || 4,
      tone
    };
    
    // Fill template with variables
    const prompt = fillTemplate(this.template, pollVariables);
    
    // Prepare response
    return {
      prompt,
      systemPrompt: this.systemPrompt,
      estimatedTokens: this.calculateTokens(prompt),
      model: params.model || this.defaultModel,
      temperature: params.temperature || this.defaultTemperature
    };
  }
  
  /**
   * Calculate token usage for this prompt
   */
  private calculateTokens(prompt: string): number {
    // Simple estimation: ~4 characters per token for English text
    return Math.ceil((this.systemPrompt.length + prompt.length) / 4);
  }
}

export default PollPromptBuilder;
