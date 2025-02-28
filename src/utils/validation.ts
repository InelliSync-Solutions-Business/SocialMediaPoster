import { UserPreferences } from '@/types/preferences';

export const validatePreferences = (prefs: UserPreferences): string[] => {
  const errors: string[] = [];

  // Validate audience/style combinations with explicit type checking
  const allowedCombinations: Record<string, string[]> = {
    technical: ['developers', 'tech'],
    conversational: ['general', 'business'],
    persuasive: ['business', 'general'],
    storytelling: ['general', 'tech']
  };

  const writingStyle = prefs.writingStyle || '';
  const audience = prefs.targetAudience || '';

  // Use type assertion to ensure type compatibility
  if (!allowedCombinations[writingStyle]?.includes(audience)) {
    errors.push(`Audience '${audience}' not compatible with writing style '${writingStyle}'`);
  }

  // Validate guideline requirements
  const selectedGuidelines = prefs.contentPreferences?.contentTypes || [];
  if (selectedGuidelines.length === 0) {
    errors.push('At least one content guideline must be selected');
  }

  return errors;
}
