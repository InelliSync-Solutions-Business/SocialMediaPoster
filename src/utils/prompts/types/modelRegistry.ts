/**
 * Model Registry
 * 
 * This file serves as the single source of truth for all AI model information.
 * It centralizes model specifications, pricing, and capabilities that were previously
 * duplicated across multiple files.
 */

import { ModelConfig, ModelProviderType } from './index';

/**
 * OpenAI Models
 */
export const OPENAI_MODELS: Record<string, ModelConfig> = {
  'gpt-4o-mini': {
    name: 'gpt-4o-mini',
    displayName: 'GPT-4o Mini',
    provider: 'openai',
    maxTokens: 128000,
    costPerInputToken: 0.000005,
    costPerOutputToken: 0.000015,
    supportsStreaming: true,
    supportsImages: true,
    defaultForContentType: 'shortForm'
  },
  'gpt-3.5-turbo': {
    name: 'gpt-3.5-turbo',
    displayName: 'GPT-3.5 Turbo',
    provider: 'openai',
    maxTokens: 4096,
    costPerInputToken: 0.0000015,
    costPerOutputToken: 0.000002,
    supportsStreaming: true,
    supportsImages: false
  },
  'gpt-3.5-turbo-16k': {
    name: 'gpt-3.5-turbo-16k',
    displayName: 'GPT-3.5 Turbo (16K)',
    provider: 'openai',
    maxTokens: 16384,
    costPerInputToken: 0.000003,
    costPerOutputToken: 0.000004,
    supportsStreaming: true,
    supportsImages: false
  },
  'gpt-4': {
    name: 'gpt-4',
    displayName: 'GPT-4',
    provider: 'openai',
    maxTokens: 8192,
    costPerInputToken: 0.00003,
    costPerOutputToken: 0.00006,
    supportsStreaming: true,
    supportsImages: false
  },
  'gpt-4-turbo': {
    name: 'gpt-4-turbo',
    displayName: 'GPT-4 Turbo',
    provider: 'openai',
    maxTokens: 128000,
    costPerInputToken: 0.00001,
    costPerOutputToken: 0.00003,
    supportsStreaming: true,
    supportsImages: true
  },
  'gpt-4-vision': {
    name: 'gpt-4-vision',
    displayName: 'GPT-4 Vision',
    provider: 'openai',
    maxTokens: 128000,
    costPerInputToken: 0.00001,
    costPerOutputToken: 0.00003,
    supportsStreaming: true,
    supportsImages: true
  }
};

/**
 * Anthropic Models
 */
export const ANTHROPIC_MODELS: Record<string, ModelConfig> = {
  'claude-2': {
    name: 'claude-2',
    displayName: 'Claude 2',
    provider: 'anthropic',
    maxTokens: 100000,
    costPerInputToken: 0.00001102,
    costPerOutputToken: 0.00003268,
    supportsStreaming: true,
    supportsImages: false
  },
  'claude-instant-1': {
    name: 'claude-instant-1',
    displayName: 'Claude Instant',
    provider: 'anthropic',
    maxTokens: 100000,
    costPerInputToken: 0.00000163,
    costPerOutputToken: 0.00000551,
    supportsStreaming: true,
    supportsImages: false
  }
};

/**
 * Image Generation Models
 */
export const IMAGE_MODELS: Record<string, ModelConfig> = {
  'dall-e-2': {
    name: 'dall-e-2',
    displayName: 'DALL-E 2',
    provider: 'openai',
    maxTokens: 0,
    costPerInputToken: 0,
    costPerOutputToken: 0,
    supportsStreaming: false,
    supportsImages: true
  },
  'dall-e-3': {
    name: 'dall-e-3',
    displayName: 'DALL-E 3',
    provider: 'openai',
    maxTokens: 0,
    costPerInputToken: 0,
    costPerOutputToken: 0,
    supportsStreaming: false,
    supportsImages: true,
    defaultForContentType: 'image'
  },
  'stable-diffusion': {
    name: 'stable-diffusion',
    displayName: 'Stable Diffusion',
    provider: 'other',
    maxTokens: 0,
    costPerInputToken: 0,
    costPerOutputToken: 0,
    supportsStreaming: false,
    supportsImages: true
  }
};

/**
 * Combined model registry with all available models
 */
export const MODEL_REGISTRY: Record<string, ModelConfig> = {
  ...OPENAI_MODELS,
  ...ANTHROPIC_MODELS,
  ...IMAGE_MODELS
};

/**
 * Get default model for a specific content type
 * @param contentType Type of content being generated
 * @returns The default model configuration for the content type
 */
export function getDefaultModelForContentType(contentType: string): ModelConfig {
  // Find a model that's marked as default for this content type
  const defaultModel = Object.values(MODEL_REGISTRY).find(
    model => model.defaultForContentType === contentType
  );
  
  // If no specific default is found, return a sensible default
  if (!defaultModel) {
    return OPENAI_MODELS['gpt-4o-mini'];
  }
  
  return defaultModel;
}

/**
 * Get all models for a specific provider
 * @param provider The model provider to filter by
 * @returns Record of models from the specified provider
 */
export function getModelsByProvider(provider: ModelProviderType): Record<string, ModelConfig> {
  return Object.entries(MODEL_REGISTRY)
    .filter(([_, config]) => config.provider === provider)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, ModelConfig>);
}

/**
 * Get all models that support a specific feature
 * @param feature Feature to filter by (e.g., 'supportsImages')
 * @returns Record of models supporting the specified feature
 */
export function getModelsByFeature(feature: keyof ModelConfig): Record<string, ModelConfig> {
  return Object.entries(MODEL_REGISTRY)
    .filter(([_, config]) => config[feature] === true)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, ModelConfig>);
}

/**
 * Get model configuration by name
 * @param modelName Name of the model to retrieve
 * @returns ModelConfig for the specified model, or undefined if not found
 */
export function getModelConfig(modelName: string): ModelConfig | undefined {
  return MODEL_REGISTRY[modelName];
}
