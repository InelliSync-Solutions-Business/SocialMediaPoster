/**
 * Base prompt builder class
 */

import { BasePromptParams, PromptResponse } from '../types';
import { SYSTEM_PROMPTS } from '../templates';
import { estimateTokenCount, fillTemplate } from '../utils';

/**
 * Base class for all prompt builders
 * Provides common functionality for building prompts
 */
export class BasePromptBuilder {
  protected template: string;
  protected systemPrompt: string;
  protected defaultModel: string;
  protected defaultTemperature: number;
  
  constructor(contentType: keyof typeof SYSTEM_PROMPTS = 'base') {
    this.systemPrompt = SYSTEM_PROMPTS[contentType] || SYSTEM_PROMPTS.base;
    this.template = '';
    this.defaultModel = 'gpt-4o-mini';
    this.defaultTemperature = 0.7;
  }
  
  /**
   * Sets the template for this builder
   */
  setTemplate(template: string): this {
    this.template = template;
    return this;
  }
  
  /**
   * Sets the system prompt for this builder
   */
  setSystemPrompt(systemPrompt: string): this {
    this.systemPrompt = systemPrompt;
    return this;
  }
  
  /**
   * Sets the default model for this builder
   */
  setDefaultModel(model: string): this {
    this.defaultModel = model;
    return this;
  }
  
  /**
   * Sets the default temperature for this builder
   */
  setDefaultTemperature(temperature: number): this {
    this.defaultTemperature = temperature;
    return this;
  }
  
  /**
   * Processes common parameters from all prompt types
   */
  protected processBaseParams(params: BasePromptParams): Record<string, string> {
    return {
      topic: params.topic || '',
      targetAudience: params.targetAudience || 'General audience',
      tone: params.tone || 'professional',
      writingStyle: params.writingStyle || 'Standard',
      additionalGuidelines: params.additionalGuidelines 
        ? `- Additional Guidelines: ${params.additionalGuidelines}`
        : ''
    };
  }
  
  /**
   * Builds a prompt from the given parameters
   */
  build(params: BasePromptParams): PromptResponse {
    if (!this.template) {
      throw new Error('Template not set. Call setTemplate() before building a prompt.');
    }
    
    // Process parameters
    const variables = this.processBaseParams(params);
    
    // Fill template with variables
    const prompt = fillTemplate(this.template, variables);
    
    // Prepare response
    const response: PromptResponse = {
      prompt,
      systemPrompt: this.systemPrompt,
      estimatedTokens: estimateTokenCount(this.systemPrompt + prompt),
      model: params.model || this.defaultModel,
    };
    
    if (params.temperature || this.defaultTemperature) {
      response.temperature = params.temperature || this.defaultTemperature;
    }
    
    return response;
  }
}

export default BasePromptBuilder;
