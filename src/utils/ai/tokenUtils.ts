/**
 * Centralized token utilities for AI operations
 * This file provides functions for token estimation and cost calculation
 */

import { TokenUsage } from '../prompts/types/index';
import { AIModel } from '@/pages/newsletter/types/newsletter';

/**
 * Estimates token count for a given text
 * This is a simple estimation - 1 token ≈ 4 characters for English text
 */
export const estimateTokenCount = (text: string): number => {
  if (!text || text.trim() === '') return 0;
  
  // Adjust the estimation based on content type
  // Code and data typically use more tokens per character
  const isCode = /```\w*\n[\s\S]*?\n```/.test(text);
  const divisor = isCode ? 3.5 : 4; // Code uses more tokens per character
  
  return Math.ceil(text.length / divisor);
};

/**
 * Pricing per 1000 tokens (as of March 2025)
 */
export const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-4o': { input: 0.01, output: 0.02 },
  'claude-3-opus': { input: 0.015, output: 0.075 },
  'claude-3-sonnet': { input: 0.003, output: 0.015 },
  'claude-3-haiku': { input: 0.00025, output: 0.00125 },
};

/**
 * Estimates the cost of token usage based on model
 */
export const estimateTokenCost = (
  usage: TokenUsage,
  model: string = 'gpt-3.5-turbo'
): number => {
  const modelPricing = MODEL_PRICING[model] || MODEL_PRICING['gpt-3.5-turbo'];
  
  const inputCost = (usage.promptTokens / 1000) * modelPricing.input;
  const outputCost = (usage.completionTokens / 1000) * modelPricing.output;
  
  return inputCost + outputCost;
};

/**
 * Calculate the estimated cost for a prompt
 * 
 * @param systemPrompt The system prompt
 * @param userPrompt The user prompt
 * @param expectedResponseLength Expected response length in tokens
 * @param model Model to use
 * @returns Estimated cost in USD
 */
export const calculatePromptCost = (
  systemPrompt: string,
  userPrompt: string,
  expectedResponseLength: number = 500,
  model: string = 'gpt-3.5-turbo'
): number => {
  const modelPricing = MODEL_PRICING[model] || MODEL_PRICING['gpt-3.5-turbo'];
  
  // Calculate token usage
  const systemTokens = estimateTokenCount(systemPrompt);
  const userTokens = estimateTokenCount(userPrompt);
  const totalTokens = systemTokens + userTokens + expectedResponseLength;
  
  // Calculate cost
  return (totalTokens / 1000) * modelPricing.output;
};

/**
 * Helper function to get valid OpenAI model name
 */
export const getOpenAIModel = (modelPreference?: string): string => {
  const validModels = [
    'gpt-3.5-turbo',
    'gpt-4',
    'gpt-4-turbo',
    'gpt-4o'
  ];
  
  // Return the model if it's valid
  if (modelPreference && validModels.includes(modelPreference)) {
    return modelPreference;
  }
  
  // Default to gpt-4-turbo for content generation
  return 'gpt-4-turbo';
};

export default {
  estimateTokenCount,
  estimateTokenCost,
  calculatePromptCost,
  getOpenAIModel,
  MODEL_PRICING
};
