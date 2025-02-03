import { UserPreferences } from '@/types/preferences';

export const validatePreferences = (prefs: UserPreferences): string[] => {
  const errors: string[] = [];

  // Validate audience/style combinations with explicit type checking
  const allowedCombinations: Record<UserPreferences['defaultWritingStyle'], UserPreferences['defaultAudience'][]> = {
    technical: ['developers', 'tech'],
    conversational: ['general', 'business'],
    persuasive: ['business', 'general'],
    storytelling: ['general', 'tech']
  };

  const writingStyle = prefs.defaultWritingStyle;
  const audience = prefs.defaultAudience;

  // Use type assertion to ensure type compatibility
  if (!allowedCombinations[writingStyle as UserPreferences['defaultWritingStyle']]?.includes(audience as UserPreferences['defaultAudience'])) {
    errors.push(`Audience '${audience}' not compatible with writing style '${writingStyle}'`);
  }

  // Validate guideline requirements
  const selectedGuidelines = prefs.defaultGuidelines.filter(Boolean);
  if (selectedGuidelines.length === 0) {
    errors.push('At least one content guideline must be selected');
  }

  return errors;
}
