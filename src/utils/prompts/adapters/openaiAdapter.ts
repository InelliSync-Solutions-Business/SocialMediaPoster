/**
 * Adapter for OpenAI API integration
 */

import { BasePromptParams } from '../types';
import { estimateTokenCount, truncateContent } from '../utils';

// OpenAI models and their token limits
interface ModelConfig {
  maxTokens: number;
  costPer1KTokens: number; // In USD
}

export const MODELS: Record<string, ModelConfig> = {
  'gpt-3.5-turbo': {
    maxTokens: 4096,
    costPer1KTokens: 0.002
  },
  'gpt-3.5-turbo-16k': {
    maxTokens: 16384,
    costPer1KTokens: 0.004
  },
  'gpt-4': {
    maxTokens: 8192, 
    costPer1KTokens: 0.06
  },
  'gpt-4-32k': {
    maxTokens: 32768,
    costPer1KTokens: 0.12
  },
  'gpt-4-turbo': {
    maxTokens: 128000,
    costPer1KTokens: 0.01
  }
};

// Default model to use
export const DEFAULT_MODEL = 'gpt-4';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

/**
 * Create a standard OpenAI API request
 * 
 * @param systemPrompt The system prompt for context
 * @param userPrompt The user prompt for the request
 * @param params Additional parameters for the request
 * @returns Formatted OpenAI API request
 */
export function createOpenAIRequest(
  systemPrompt: string,
  userPrompt: string,
  params: Partial<BasePromptParams> = {}
): OpenAIRequest {
  // Select model
  const model = params.model || DEFAULT_MODEL;
  const modelConfig = MODELS[model] || MODELS[DEFAULT_MODEL];
  
  // Calculate token usage estimate
  const systemTokens = estimateTokenCount(systemPrompt);
  const userTokens = estimateTokenCount(userPrompt);
  const totalPromptTokens = systemTokens + userTokens;
  
  // Calculate response token limit (conservative estimate)
  // Reserve about 25% of tokens for the completion
  const maxResponseTokens = Math.floor((modelConfig.maxTokens - totalPromptTokens) * 0.8);
  
  // Create messages array
  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: systemPrompt
    },
    {
      role: 'user', 
      content: userPrompt
    }
  ];
  
  // Create request object
  return {
    model: model,
    messages: messages,
    temperature: params.temperature ?? 0.7,
    max_tokens: Math.max(100, maxResponseTokens), // Ensure at least 100 tokens
    top_p: params.top_p ?? 1,
    frequency_penalty: params.frequency_penalty ?? 0,
    presence_penalty: params.presence_penalty ?? 0
  };
}

/**
 * Adjust prompt content to meet token limits
 * 
 * @param systemPrompt The system prompt to adjust
 * @param userPrompt The user prompt to adjust
 * @param model The model being used
 * @returns Adjusted prompts that fit within token limits
 */
export function fitToTokenLimits(
  systemPrompt: string,
  userPrompt: string,
  model: string = DEFAULT_MODEL
): { systemPrompt: string, userPrompt: string } {
  const modelConfig = MODELS[model] || MODELS[DEFAULT_MODEL];
  const maxInputTokens = Math.floor(modelConfig.maxTokens * 0.75); // 75% of total tokens for input
  
  // Calculate token usage
  const systemTokens = estimateTokenCount(systemPrompt);
  const userTokens = estimateTokenCount(userPrompt);
  const totalTokens = systemTokens + userTokens;
  
  // If we're within limits, return as-is
  if (totalTokens <= maxInputTokens) {
    return { systemPrompt, userPrompt };
  }
  
  // Calculate how much we need to reduce
  const overLimit = totalTokens - maxInputTokens;
  
  // Strategy: prioritize keeping the system prompt intact
  // and truncate the user prompt if needed
  if (userTokens > overLimit * 1.2) { // Only truncate user prompt if it's large enough
    // Truncate user prompt
    const targetUserTokens = userTokens - overLimit - 50; // 50 token buffer
    const truncatedUserPrompt = truncateContent(userPrompt, targetUserTokens);
    return { 
      systemPrompt, 
      userPrompt: truncatedUserPrompt 
    };
  } else {
    // Need to truncate both prompts
    // Truncate system prompt by 30% of the overage
    const systemReduction = Math.floor(overLimit * 0.3);
    const userReduction = overLimit - systemReduction;
    
    const targetSystemTokens = systemTokens - systemReduction - 20;
    const targetUserTokens = userTokens - userReduction - 30;
    
    return {
      systemPrompt: truncateContent(systemPrompt, targetSystemTokens),
      userPrompt: truncateContent(userPrompt, targetUserTokens)
    };
  }
}

/**
 * Calculate the estimated cost for a prompt
 * 
 * @param systemPrompt The system prompt
 * @param userPrompt The user prompt
 * @param expectedResponseLength Expected response length in tokens
 * @param model Model to use
 * @returns Estimated cost in USD
 */
export function estimateCost(
  systemPrompt: string,
  userPrompt: string,
  expectedResponseLength: number = 500,
  model: string = DEFAULT_MODEL
): number {
  const modelConfig = MODELS[model] || MODELS[DEFAULT_MODEL];
  
  // Calculate token usage
  const systemTokens = estimateTokenCount(systemPrompt);
  const userTokens = estimateTokenCount(userPrompt);
  const totalTokens = systemTokens + userTokens + expectedResponseLength;
  
  // Calculate cost
  return (totalTokens / 1000) * modelConfig.costPer1KTokens;
}

export default {
  createOpenAIRequest,
  fitToTokenLimits,
  estimateCost,
  MODELS,
  DEFAULT_MODEL
};
