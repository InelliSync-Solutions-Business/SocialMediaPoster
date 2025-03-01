/**
 * Type System Exports
 * 
 * This barrel file exports all types from the unified type system.
 * It provides a convenient way to import types from a single location.
 */

// Re-export all types from the main types file
export * from './index';

// Re-export all model-related types and constants
export * from './modelRegistry';

// Re-export all platform-related constants
export * from './platformConstants';

// Export a default object for ESM compatibility
export default {
  // This is intentionally left empty as we prefer named exports
};
