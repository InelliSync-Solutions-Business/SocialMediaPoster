/**
 * @deprecated This file is deprecated and will be removed in a future release.
 * Please import utilities from their respective centralized modules instead.
 * This file is maintained only for backward compatibility.
 *
 * Utility functions for prompt management - Re-exports from centralized modules
 */

// Import from centralized modules
import { estimateTokenCount as tokenCount, estimateTokenCost as tokenCost, getOpenAIModel as getModel } from '../ai/tokenUtils';
import { truncateContent as truncate, parseThreadContent as parseThread, fillTemplate as fillTemp } from './contentProcessors';
import { mapStyleToTone as styleToTone } from './styleMapper';
import { ToneType, TokenUsage } from './types/index';

// Re-export with original names for backward compatibility
export const estimateTokenCount = tokenCount;


/**
 * @deprecated Use estimateTokenCost from '../ai/tokenUtils' instead
 * Estimates the cost of token usage based on model
 */
export const estimateTokenCost = tokenCost;

/**
 * @deprecated Use truncateContent from './contentProcessors' instead
 * Truncates content to fit within token limits,
 * prioritizing important elements
 */
export const truncateContent = truncate;

/**
 * @deprecated Use fillTemplate from './contentProcessors' instead
 * Helper function to replace template variables
 */
export const fillTemplate = fillTemp;

/**
 * @deprecated Use mapStyleToTone from './styleMapper' instead
 * Maps style strings to tone values for consistency
 */
export const mapStyleToTone = styleToTone;

/**
 * @deprecated Use parseThreadContent from './contentProcessors' instead
 * Parses thread content into an array of individual posts
 */
export const parseThreadContent = parseThread;

/**
 * @deprecated Use getOpenAIModel from '../ai/tokenUtils' instead
 * Helper function to get valid OpenAI model name
 */
export const getOpenAIModel = getModel;
