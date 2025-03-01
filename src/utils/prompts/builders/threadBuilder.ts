/**
 * Thread prompt builder
 */

import { BasePromptBuilder } from './baseBuilder';
import { ThreadParams, PromptResponse } from '../types';
import { PROMPT_TEMPLATES, CONFIG, SYSTEM_PROMPTS } from '../templates';
import { fillTemplate, mapStyleToTone } from '../utils';

/**
 * Builder for thread prompts
 */
export class ThreadPromptBuilder extends BasePromptBuilder {
  constructor() {
    super('thread');
    this.setTemplate(PROMPT_TEMPLATES.thread);
    this.setDefaultModel('gpt-4o-mini'); // Using consistent model across all builders
    this.setDefaultTemperature(0.7);
  }
  
  /**
   * Builds a thread prompt from the given parameters
   */
  build(params: ThreadParams): PromptResponse {
    if (!this.template) {
      throw new Error('Template not set. Call setTemplate() before building a prompt.');
    }
    
    // Process base parameters
    const baseVariables = this.processBaseParams(params);
    
    // Get platform guidance and character limits
    const platform = (params.platform || 'default').toLowerCase();
    const platformGuidance = CONFIG.thread.platformGuidance[platform as keyof typeof CONFIG.thread.platformGuidance] || 
                             CONFIG.thread.platformGuidance.default;
    
    const characterLimit = CONFIG.thread.characterLimits[platform as keyof typeof CONFIG.thread.characterLimits] ||
                           CONFIG.thread.characterLimits.default;
    
    // Ensure a valid tone
    const tone = mapStyleToTone(params.tone || params.writingStyle);
    
    // Thread-specific variables
    const threadVariables = {
      ...baseVariables,
      platform: params.platform || 'Twitter',
      platformGuidance,
      characterLimit,
      threadCount: params.threadCount || 5,
      threadStyle: params.threadStyle || 'educational',
      tone
    };
    
    // Fill template with variables
    const prompt = fillTemplate(this.template, threadVariables);
    
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

export default ThreadPromptBuilder;
