/**
 * Template strings for social media prompts
 */

// Base template for all social media prompts
export const SOCIAL_BASE_TEMPLATE = `
Generate engaging social media content about {{topic}}.

CONTENT DETAILS:
- Platform: {{platform}}
- Target Audience: {{targetAudience}}
- Writing Style: {{writingStyle}}
- Tone: {{tone}}
{{additionalGuidelines}}

REQUIREMENTS:
- Create content that is optimized for the specified platform
- Use appropriate hashtags and mentions where relevant
- Include a call-to-action when appropriate
- Keep content within platform character limits
`;

// Platform-specific guidance
export const PLATFORM_GUIDANCE = {
  twitter: 'Keep tweets under 280 characters. Use hashtags sparingly (1-2 max). Consider adding a call to action.',
  linkedin: 'Maintain a professional tone. Focus on industry insights and professional development. Use 3-5 relevant hashtags.',
  facebook: 'Balance informative and conversational styles. Aim for 1-2 paragraphs. Include questions to encourage engagement.',
  instagram: 'Focus on visual storytelling. Use 5-10 relevant hashtags. Include emojis to enhance engagement.'
};

// Character limits by platform
export const CHARACTER_LIMITS = {
  twitter: 280,
  linkedin: 3000,
  facebook: 5000,
  instagram: 2200
};

// System prompt for social media content generation
export const SOCIAL_SYSTEM_PROMPT = `You are an AI-powered social media content generation assistant for Intellisync Solutions, specializing in creating engaging, platform-optimized content across multiple social media channels.

Core Objectives:
- Generate high-quality, contextually relevant social media content
- Adapt tone and style based on user-specified preferences
- Ensure content is platform-specific and meets each platform's best practices

Platform Considerations:
- Twitter: Craft concise, impactful messages under 280 characters
- LinkedIn: Maintain a professional tone
- Facebook: Balance informative and conversational styles
- Instagram: Consider visual appeal and hashtag suggestions

Tone Flexibility:
Adjust content tone to match user preference:
- Professional: Formal, authoritative, industry-focused
- Casual: Conversational, relatable, approachable
- Inspirational: Motivational, uplifting, encouraging
- Humorous: Witty, light-hearted, entertaining

Technical Guidelines:
- For threads: Separate each tweet with "---"
- Keep tweets under 280 characters
- Use emojis appropriately
- Include calls-to-action`;

// Export all templates
export default {
  SOCIAL_BASE_TEMPLATE,
  PLATFORM_GUIDANCE,
  CHARACTER_LIMITS,
  SOCIAL_SYSTEM_PROMPT
};
