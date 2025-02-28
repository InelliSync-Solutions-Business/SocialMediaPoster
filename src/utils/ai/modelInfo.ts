import { AIModel } from '@/pages/newsletter/types/newsletter';

export interface ModelInfo {
  id: AIModel;
  name: string;
  description: string;
  capabilities: string[];
  pricing: {
    input: number;  // per million tokens
    output: number; // per million tokens
  };
  contextLength: number;
  bestFor: string[];
}

export const AI_MODELS: Record<AIModel, ModelInfo> = {
  'gpt-4.5': {
    id: 'gpt-4.5',
    name: 'GPT-4.5',
    description: 'Most advanced model with superior reasoning and creativity',
    capabilities: ['Advanced reasoning', 'Creative content generation', 'Complex problem solving', 'Multi-step tasks', 'Code generation', 'Multimodal'],
    pricing: {
      input: 10.0,  // $10 per million tokens
      output: 30.0  // $30 per million tokens
    },
    contextLength: 128000,
    bestFor: ['Research papers', 'Complex analysis', 'Creative writing', 'Technical documentation', 'Advanced code generation']
  },
  'o1': {
    id: 'o1',
    name: 'O1',
    description: 'Frontier reasoning model excellent for STEM and complex reasoning',
    capabilities: ['Specialized reasoning', 'STEM problem-solving', 'Multi-step reasoning', 'Tool use', 'Structured outputs'],
    pricing: {
      input: 15.0,  // $15 per million tokens
      output: 75.0  // $75 per million tokens
    },
    contextLength: 200000,
    bestFor: ['Scientific analysis', 'Mathematical problem-solving', 'Complex reasoning chains', 'Engineering tasks', 'Research synthesis']
  },
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Powerful multimodal model with strong text, image, and audio capabilities',
    capabilities: ['Text generation', 'Image understanding', 'Audio processing', 'Multilingual support', 'Code generation'],
    pricing: {
      input: 5.0,   // $5 per million tokens
      output: 15.0  // $15 per million tokens
    },
    contextLength: 128000,
    bestFor: ['Content creation', 'Image analysis', 'Multilingual content', 'General purpose tasks', 'Code assistance']
  },
  'o1-mini': {
    id: 'o1-mini',
    name: 'O1-mini',
    description: 'Balanced reasoning model for complex tasks with lower cost',
    capabilities: ['Reasoning', 'Problem-solving', 'STEM tasks', 'Structured outputs', 'Tool use'],
    pricing: {
      input: 3.0,   // $3 per million tokens
      output: 15.0  // $15 per million tokens
    },
    contextLength: 128000,
    bestFor: ['Everyday reasoning tasks', 'Structured content generation', 'Technical writing', 'Data analysis', 'Educational content']
  },
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    name: 'GPT-4o-mini',
    description: 'Fast and cost-effective for most everyday tasks',
    capabilities: ['Text generation', 'Basic image understanding', 'Fast responses', 'Multilingual support'],
    pricing: {
      input: 0.15,  // $0.15 per million tokens
      output: 0.60  // $0.60 per million tokens
    },
    contextLength: 128000,
    bestFor: ['Social media content', 'Short-form writing', 'Quick drafts', 'Simple content generation', 'Everyday tasks']
  },
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5-turbo',
    description: 'Most economical option for simple content generation',
    capabilities: ['Basic text generation', 'Simple responses', 'Fast processing'],
    pricing: {
      input: 0.10,  // $0.10 per million tokens
      output: 0.20  // $0.20 per million tokens
    },
    contextLength: 16000,
    bestFor: ['Simple responses', 'Basic content', 'High-volume, low-complexity tasks', 'Cost-sensitive applications']
  }
};

// Helper function to estimate token count from text
export const estimateTokenCount = (text: string): number => {
  if (!text || text.trim() === '') return 0;
  
  // More accurate token estimation:
  // - English: ~4 chars per token
  // - Code: ~3.5 chars per token
  // - Whitespace: count separately
  // - Numbers and special chars: count more heavily
  
  // Count whitespace separately (roughly 1 token per whitespace)
  const whitespaceCount = (text.match(/\s+/g) || []).length;
  
  // Count numbers and special characters (roughly 0.5 tokens per character)
  const specialCharsCount = (text.match(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g) || []).join('').length;
  
  // Count remaining text (roughly 4 chars per token for English)
  const cleanText = text.replace(/\s+/g, '').replace(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, '');
  const textTokens = Math.ceil(cleanText.length / 4);
  
  // Total token estimate
  return Math.max(1, textTokens + whitespaceCount + Math.ceil(specialCharsCount * 0.5));
};

// Helper function to calculate estimated cost
export const calculateCost = (
  model: AIModel, 
  inputTokens: number, 
  outputTokens: number
): number => {
  const modelInfo = AI_MODELS[model];
  if (!modelInfo) return 0;
  
  const inputCost = (inputTokens / 1000000) * modelInfo.pricing.input;
  const outputCost = (outputTokens / 1000000) * modelInfo.pricing.output;
  
  return inputCost + outputCost;
};

// Helper to get a human-readable pricing string
export const getPricingString = (model: AIModel): string => {
  const modelInfo = AI_MODELS[model];
  if (!modelInfo) return 'Pricing not available';
  
  return `$${modelInfo.pricing.input.toFixed(2)} per 1M input tokens | $${modelInfo.pricing.output.toFixed(2)} per 1M output tokens`;
};
