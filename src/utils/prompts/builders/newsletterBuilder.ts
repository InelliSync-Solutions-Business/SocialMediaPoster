/**
 * Newsletter prompt builder
 */

import { BasePromptBuilder } from './baseBuilder';
import { NewsletterParams, PromptResponse } from '../types';
import { PROMPT_TEMPLATES, CONFIG, SYSTEM_PROMPTS } from '../templates';
import { fillTemplate, mapStyleToTone } from '../utils';

/**
 * Builder for newsletter prompts
 */
export class NewsletterPromptBuilder extends BasePromptBuilder {
  constructor() {
    super('newsletter');
    this.setTemplate(PROMPT_TEMPLATES.newsletter);
    this.setDefaultModel('gpt-4o-mini');
    this.setDefaultTemperature(0.7);
  }
  
  /**
   * Builds a newsletter prompt from the given parameters
   */
  build(params: NewsletterParams): PromptResponse {
    if (!this.template) {
      throw new Error('Template not set. Call setTemplate() before building a prompt.');
    }
    
    // Process base parameters
    const baseVariables = this.processBaseParams(params);
    
    // Get current date formatted
    const currentDate = new Date();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const formattedDate = `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
    
    // Determine if the date should be included based on topic keywords
    const dateKeywords = ["today", "this week", "current", "latest", "recent", "monthly", "weekly", "annual", "yearly"];
    const includeDate = dateKeywords.some(keyword => 
      params.topic.toLowerCase().includes(keyword) || 
      (params.newsletterType && params.newsletterType.toLowerCase().includes(keyword))
    );
    
    const dateIntro = includeDate ? `Welcome to the ${formattedDate} edition, ` : `Welcome to `;
    
    // Get length configuration
    const lengthConfig = CONFIG.newsletter.lengthConfig[params.length] || CONFIG.newsletter.lengthConfig.medium;
    
    // Ensure a valid tone
    const tone = mapStyleToTone(params.tone || params.writingStyle);
    
    // Newsletter-specific variables
    const newsletterVariables = {
      ...baseVariables,
      newsletterType: params.newsletterType || 'General Newsletter',
      length: params.length || 'medium',
      wordCount: lengthConfig.wordCount,
      sections: lengthConfig.sections,
      dateIntro,
      tone
    };
    
    // Fill template with variables
    const prompt = fillTemplate(this.template, newsletterVariables);
    
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

export default NewsletterPromptBuilder;
