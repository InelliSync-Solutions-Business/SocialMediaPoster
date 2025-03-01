# Unified Type System

This directory contains the unified type system for the IntelliSync Solutions Social Media Writer application. It serves as the single source of truth for all types used in the prompt system.

## Directory Structure

- `index.ts` - Core type definitions and interfaces
- `modelRegistry.ts` - Centralized AI model information
- `platformConstants.ts` - Platform-specific constants
- `exports.ts` - Barrel file for convenient imports
- `examples.ts` - Example usage of the type system

## Key Features

### 1. Core Types

The core types in `index.ts` include:

- Basic type definitions (`ToneType`, `PlatformType`, etc.)
- Parameter interfaces (`BasePromptParams`, `ThreadParams`, etc.)
- Response interfaces (`PromptResponse`, `AIResponse`, etc.)
- Parser interfaces (`ThreadPost`, `ParsedThreadContent`, etc.)

### 2. Model Registry

The model registry in `modelRegistry.ts` provides:

- Comprehensive model information for all supported AI models
- Pricing information for token usage calculations
- Utility functions for retrieving model configurations
- Default model recommendations for different content types

### 3. Platform Constants

The platform constants in `platformConstants.ts` include:

- Character limits for different platforms
- Hashtag limits and recommendations
- Thread and poll support information
- Image limits and supported aspect ratios
- Utility functions for platform-specific operations

## Usage

### Basic Import

```typescript
import { ThreadParams, PollParams, ToneType } from '@/utils/prompts/types/index';
```

### Model Registry

```typescript
import { 
  OPENAI_MODELS, 
  getModelConfig, 
  getDefaultModelForContentType 
} from '@/utils/prompts/types/modelRegistry';

// Get a specific model
const gpt4 = OPENAI_MODELS['gpt-4'];

// Get model by name
const model = getModelConfig('gpt-3.5-turbo');

// Get default model for content type
const threadModel = getDefaultModelForContentType('thread');
```

### Platform Constants

```typescript
import { 
  PLATFORM_CHARACTER_LIMITS, 
  getPlatformCharacterLimit, 
  platformSupportsThreads 
} from '@/utils/prompts/types/platformConstants';

// Get character limit for a platform
const twitterLimit = PLATFORM_CHARACTER_LIMITS.twitter;
const linkedinLimit = getPlatformCharacterLimit('linkedin');

// Check platform capabilities
const supportsThreads = platformSupportsThreads('twitter');
```

## Migration

If you're migrating from the old type system, please refer to the [Type System Migration Guide](../../../../type-system-migration-guide.md) for detailed instructions.

## Examples

For examples of how to use the type system, see the `examples.ts` file in this directory.

## Contributing

When adding new types or modifying existing ones:

1. Add proper JSDoc documentation
2. Update relevant constants if needed
3. Consider backward compatibility
4. Add examples for new functionality
