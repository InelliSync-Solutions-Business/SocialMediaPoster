/**
 * Social media prompt builder
 */

import { BasePromptBuilder } from './baseBuilder';
import { SocialParams, PromptResponse, BasePromptParams } from '../types';
import { PROMPT_TEMPLATES, CONFIG, SYSTEM_PROMPTS } from '../templates';
import { fillTemplate, mapStyleToTone, estimateTokenCount } from '../utils';

/**
 * Builder for social media prompts
 */
export class SocialPromptBuilder extends BasePromptBuilder {
  protected params: Record<string, string>;
  
  constructor() {
    super('social');
    this.setTemplate(PROMPT_TEMPLATES.social);
    this.params = {};
    this.setDefaultModel('gpt-4o-mini');
    this.setDefaultTemperature(0.7);
  }
  
  /**
   * Sets a parameter for the prompt
   */
  protected setParam(key: string, value: string): this {
    this.params[key] = value;
    return this;
  }
  
  /**
   * Sets the topic for the social media post
   */
  setTopic(topic: string): this {
    return this.setParam('topic', topic);
  }
  
  /**
   * Sets the target audience for the social media post
   */
  setTargetAudience(audience: string): this {
    return this.setParam('targetAudience', audience);
  }
  
  /**
   * Sets the writing style for the social media post
   */
  setWritingStyle(style: string): this {
    return this.setParam('writingStyle', style);
  }
  
  /**
   * Sets the tone for the social media post
   */
  setTone(tone: string): this {
    return this.setParam('tone', mapStyleToTone(tone));
  }
  
  /**
   * Sets the platform for the social media post
   */
  setPlatform(platform: string): this {
    return this.setParam('platform', platform);
  }
  
  /**
   * Sets additional guidelines for the social media post
   */
  setAdditionalGuidelines(guidelines: string): this {
    return this.setParam('additionalGuidelines', guidelines);
  }
  
  /**
   * Sets user input for the social media post
   */
  setUserInput(input: string): this {
    return this.setParam('userInput', input);
  }
  
  /**
   * Builds a social media prompt from the given parameters
   */
  build(params: BasePromptParams): PromptResponse {
    if (!this.template) {
      throw new Error('Template not set. Call setTemplate() before building a prompt.');
    }
    
    // Process base parameters
    const baseVariables = this.processBaseParams(params);
    
    // Set default platform if not provided
    const socialParams = params as SocialParams;
    const platform = socialParams.platform || this.params.platform || 'twitter'; // Default to Twitter if not specified
    
    // Get platform-specific guidance if available
    const normalizedPlatform = platform.toLowerCase();
    
    // Map 'x' and 'threads' to their equivalent platforms for guidance and limits
    const platformMap: Record<string, 'twitter' | 'linkedin' | 'facebook' | 'instagram'> = {
      'twitter': 'twitter',
      'x': 'twitter',
      'linkedin': 'linkedin',
      'facebook': 'facebook',
      'instagram': 'instagram',
      'threads': 'instagram' // Threads is similar to Instagram in terms of guidance
    };
    
    const platformKey = platformMap[normalizedPlatform] || 'twitter';
    const platformGuidance = CONFIG.social?.platformGuidance?.[platformKey] || '';
    const characterLimit = CONFIG.social?.characterLimits?.[platformKey] || '';
    
    // Build the final prompt
    const promptVariables = {
      ...baseVariables,
      ...this.params, // Include any params set via setParam methods
      platform,
      platformGuidance,
      characterLimit
    };
    
    const prompt = fillTemplate(this.template, promptVariables);
    
    return {
      prompt,
      systemPrompt: this.systemPrompt,
      model: params.model || this.defaultModel,
      temperature: params.temperature || this.defaultTemperature,
      estimatedTokens: estimateTokenCount(prompt) + estimateTokenCount(this.systemPrompt)
    };
  }
}

export default SocialPromptBuilder;
