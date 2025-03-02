/**
 * Centralized style and tone mapping utilities
 * This file provides functions for mapping between different style and tone formats
 */

import { ToneType } from './types/index';

/**
 * Style to tone mapping for consistent tone across the application
 */
export const STYLE_TO_TONE_MAP: Record<string, ToneType> = {
  'informative': 'professional',
  'educational': 'professional',
  'professional': 'professional',
  'casual': 'casual',
  'conversational': 'conversational',
  'friendly': 'casual',
  'inspirational': 'inspirational',
  'motivational': 'inspirational',
  'humorous': 'humorous',
  'funny': 'humorous',
  'analytical': 'analytical'
};

/**
 * Maps style strings to tone values for consistency
 */
export const mapStyleToTone = (style?: string): ToneType => {
  if (!style) return 'professional';
  
  return STYLE_TO_TONE_MAP[style.toLowerCase()] || 'professional';
};

/**
 * Maps tone to appropriate language style descriptors
 */
export const getToneDescriptors = (tone: ToneType): string[] => {
  const descriptors: Record<ToneType, string[]> = {
    'professional': ['clear', 'concise', 'authoritative', 'informative'],
    'casual': ['friendly', 'approachable', 'conversational', 'relatable'],
    'conversational': ['engaging', 'natural', 'approachable', 'warm'],
    'inspirational': ['uplifting', 'motivational', 'encouraging', 'positive'],
    'humorous': ['witty', 'light-hearted', 'playful', 'entertaining'],
    'analytical': ['detailed', 'logical', 'data-driven', 'thorough'],
    'technical': ['precise', 'detailed', 'specialized', 'expert-level'],
    'engaging': ['interactive', 'captivating', 'interesting', 'dynamic'],
    'authoritative': ['expert', 'commanding', 'credible', 'definitive'],
    'storytelling': ['narrative', 'descriptive', 'immersive', 'compelling'],
    'persuasive': ['convincing', 'influential', 'compelling', 'strategic'],
    'insightful': ['perceptive', 'thoughtful', 'illuminating', 'astute'],
    'visionary': ['forward-thinking', 'innovative', 'pioneering', 'futuristic'],
    'educational': ['instructive', 'explanatory', 'informative', 'enlightening'],
    'empathetic': ['understanding', 'compassionate', 'supportive', 'sensitive'],
    'controversial': ['provocative', 'challenging', 'thought-provoking', 'bold']
  };
  
  return descriptors[tone] || descriptors.professional;
};

/**
 * Gets appropriate emoji usage guidance based on tone
 */
export const getEmojiGuidance = (tone: ToneType): string => {
  switch (tone) {
    case 'professional':
      return 'Use emojis sparingly, only where they add meaningful context';
    case 'casual':
      return 'Use emojis naturally to enhance the friendly tone';
    case 'conversational':
      return 'Use emojis occasionally to emphasize key points';
    case 'inspirational':
      return 'Use positive and uplifting emojis to reinforce the motivational message';
    case 'humorous':
      return 'Use playful emojis to enhance the humorous tone';
    case 'analytical':
      return 'Limit emoji usage to data visualization contexts only';
    default:
      return 'Use emojis sparingly and appropriately';
  }
};

export default {
  mapStyleToTone,
  getToneDescriptors,
  getEmojiGuidance,
  STYLE_TO_TONE_MAP
};
