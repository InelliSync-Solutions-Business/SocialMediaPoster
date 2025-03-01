/**
 * Type System Examples
 * 
 * This file provides examples of how to use the new unified type system.
 * It is intended for demonstration purposes only and is not used in production.
 */

import {
  BasePromptParams,
  ThreadParams,
  PollParams,
  ImageParams,
  NewsletterParams,
  ParsedThreadContent,
  ThreadPost,
  ToneType,
  PlatformType
} from './index';

import {
  MODEL_REGISTRY,
  OPENAI_MODELS,
  getDefaultModelForContentType,
  getModelsByProvider,
  getModelConfig
} from './modelRegistry';

import {
  PLATFORM_CHARACTER_LIMITS,
  PLATFORM_HASHTAG_LIMITS,
  getPlatformCharacterLimit,
  platformSupportsThreads,
  platformSupportsPolls
} from './platformConstants';

/**
 * Example 1: Creating prompt parameters
 */
function createPromptParamsExample(): void {
  // Basic prompt parameters
  const baseParams: BasePromptParams = {
    topic: 'Artificial Intelligence in Healthcare',
    audience: 'Medical professionals',
    tone: 'professional',
    writingStyle: 'informative',
    guidelines: 'Include recent research and case studies',
    model: 'gpt-4',
    temperature: 0.7
  };
  
  // Thread parameters
  const threadParams: ThreadParams = {
    ...baseParams,
    platform: 'twitter',
    threadCount: 5,
    threadStyle: 'educational',
    includeHashtags: true,
    includeEmojis: true,
    callToAction: 'Follow for more AI in healthcare insights'
  };
  
  // Poll parameters
  const pollParams: PollParams = {
    ...baseParams,
    platform: 'twitter',
    optionCount: 4,
    pollDuration: '3days',
    includeHashtags: true
  };
  
  // Image parameters
  const imageParams: ImageParams = {
    ...baseParams,
    style: 'photorealistic',
    mood: 'hopeful',
    visualElements: ['doctor', 'AI interface', 'hospital setting'],
    aspectRatio: '16:9',
    model: 'dall-e-3',
    quality: 'hd'
  };
  
  // Newsletter parameters
  const newsletterParams: NewsletterParams = {
    ...baseParams,
    newsletterType: 'industry update',
    length: 'medium',
    sections: ['Latest Research', 'Case Studies', 'Future Outlook'],
    includeHeadlines: true,
    includeSummary: true,
    includeCta: true,
    formatType: 'markdown'
  };
  
  console.log({ baseParams, threadParams, pollParams, imageParams, newsletterParams });
}

/**
 * Example 2: Using the model registry
 */
function modelRegistryExample(): void {
  // Get a specific model
  const gpt4 = OPENAI_MODELS['gpt-4'];
  console.log(`Model: ${gpt4.displayName}, Max Tokens: ${gpt4.maxTokens}`);
  
  // Get default model for a content type
  const threadModel = getDefaultModelForContentType('thread');
  console.log(`Default model for threads: ${threadModel.displayName}`);
  
  // Get all models from a provider
  const openaiModels = getModelsByProvider('openai');
  console.log(`OpenAI models: ${Object.keys(openaiModels).join(', ')}`);
  
  // Get model by name
  const modelConfig = getModelConfig('gpt-3.5-turbo');
  if (modelConfig) {
    console.log(`Cost per 1K output tokens: $${modelConfig.costPerOutputToken * 1000}`);
  }
}

/**
 * Example 3: Using platform constants
 */
function platformConstantsExample(): void {
  // Get character limits
  const twitterLimit = PLATFORM_CHARACTER_LIMITS.twitter;
  const linkedinLimit = getPlatformCharacterLimit('linkedin');
  console.log(`Twitter: ${twitterLimit} chars, LinkedIn: ${linkedinLimit} chars`);
  
  // Check platform capabilities
  const platforms: PlatformType[] = ['twitter', 'linkedin', 'facebook', 'instagram', 'threads'];
  
  platforms.forEach(platform => {
    console.log(`${platform} supports threads: ${platformSupportsThreads(platform)}`);
    console.log(`${platform} supports polls: ${platformSupportsPolls(platform)}`);
    console.log(`${platform} hashtag limit: ${PLATFORM_HASHTAG_LIMITS[platform]}`);
  });
}

/**
 * Example 4: Working with parsed content
 */
function parsedContentExample(): void {
  // Create a parsed thread
  const parsedThread: ParsedThreadContent = {
    posts: [
      { content: 'This is the first post in the thread.', characterCount: 38, index: 0 },
      { content: 'This is the second post with more details.', characterCount: 43, index: 1 },
      { content: 'And this is the final post with a conclusion.', characterCount: 46, index: 2 }
    ],
    totalCharacterCount: 127,
    averageCharacterCount: 42
  };
  
  // Process the thread
  parsedThread.posts.forEach((post: ThreadPost) => {
    console.log(`Post ${post.index + 1}: ${post.content} (${post.characterCount} chars)`);
  });
  
  console.log(`Total characters: ${parsedThread.totalCharacterCount}`);
  console.log(`Average characters per post: ${parsedThread.averageCharacterCount}`);
}

/**
 * Example 5: Type narrowing and validation
 */
function typeNarrowingExample(tone: unknown, platform: unknown): void {
  // Validate tone
  function isValidTone(value: unknown): value is ToneType {
    const validTones: ToneType[] = [
      'professional', 'casual', 'inspirational', 
      'humorous', 'analytical', 'conversational'
    ];
    return typeof value === 'string' && validTones.includes(value as ToneType);
  }
  
  // Validate platform
  function isValidPlatform(value: unknown): value is PlatformType {
    const validPlatforms: PlatformType[] = [
      'twitter', 'x', 'linkedin', 'facebook', 'instagram', 'threads'
    ];
    return typeof value === 'string' && validPlatforms.includes(value as PlatformType);
  }
  
  // Use type narrowing
  if (isValidTone(tone)) {
    console.log(`Valid tone: ${tone}`);
  } else {
    console.log('Invalid tone');
  }
  
  if (isValidPlatform(platform)) {
    console.log(`Valid platform: ${platform}`);
    console.log(`Character limit: ${getPlatformCharacterLimit(platform)}`);
  } else {
    console.log('Invalid platform');
  }
}

// Export examples for potential use in tests or documentation
export {
  createPromptParamsExample,
  modelRegistryExample,
  platformConstantsExample,
  parsedContentExample,
  typeNarrowingExample
};
