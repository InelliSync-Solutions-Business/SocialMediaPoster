/**
 * Image prompt builder
 */

import { BasePromptBuilder } from './baseBuilder';
import { ImageParams, PromptResponse } from '../types';
import { PROMPT_TEMPLATES, CONFIG, SYSTEM_PROMPTS } from '../templates';
import { fillTemplate } from '../utils';

/**
 * Builder for image generation prompts
 */
export class ImagePromptBuilder extends BasePromptBuilder {
  constructor() {
    super('image');
    this.setTemplate(PROMPT_TEMPLATES.image);
    this.setDefaultModel('dall-e-3'); // Using DALL-E 3 for image generation
    this.setDefaultTemperature(0.7);
  }
  
  /**
   * Builds an image prompt from the given parameters
   */
  build(params: ImageParams): PromptResponse {
    if (!this.template) {
      throw new Error('Template not set. Call setTemplate() before building a prompt.');
    }
    
    // Process base parameters
    const baseVariables = this.processBaseParams(params);
    
    // Get style and mood descriptions
    const style = params.style || 'realistic';
    const mood = params.mood || 'neutral';
    
    const styleDescription = CONFIG.image.styleOptions[style as keyof typeof CONFIG.image.styleOptions] || style;
    const moodDescription = CONFIG.image.moodOptions[mood as keyof typeof CONFIG.image.moodOptions] || mood;
    
    // Format visual elements if provided
    const visualElements = params.visualElements && params.visualElements.length > 0
      ? `- Key Visual Elements: ${params.visualElements.join(', ')}`
      : '';
    
    // Image-specific variables
    const imageVariables = {
      ...baseVariables,
      style: styleDescription,
      mood: moodDescription,
      aspectRatio: params.aspectRatio || '1:1',
      visualElements
    };
    
    // Fill template with variables
    const prompt = fillTemplate(this.template, imageVariables);
    
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

export default ImagePromptBuilder;
