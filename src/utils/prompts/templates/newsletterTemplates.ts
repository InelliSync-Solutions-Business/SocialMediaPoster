/**
 * Template strings for newsletter prompts
 */

// Base template for all newsletter prompts
export const NEWSLETTER_BASE_TEMPLATE = `
Generate a professional newsletter about {{topic}}.

NEWSLETTER DETAILS:
- Type: {{newsletterType}}
- Target Audience: {{targetAudience}}
- Writing Style: {{writingStyle}}
- Tone: {{tone}}
- Length: {{length}} ({{wordCount}})
{{additionalGuidelines}}

STRUCTURE REQUIREMENTS:
- Include a clear, engaging title/headline
- Start with a brief introduction {{dateIntro}}
- Create {{sections}}
- Use proper headings (markdown format with # and ##)
- Include bullet points for key takeaways
- End with a concise conclusion and call-to-action

FORMATTING REQUIREMENTS:
- Use markdown formatting throughout
- Create a visually structured document with clear section headings
- Use bold for important terms or concepts
- Use bullet points or numbered lists for clarity
- Include a "Key Takeaways" section
- End with "Next Steps" or a clear CTA

Please generate the full newsletter with proper formatting and sectioning:
`;

// Length configurations for newsletters
export const LENGTH_CONFIGS = {
  short: {
    wordCount: '800-1200 words',
    sections: '3-4 sections',
    depth: 'Focused overview with key points'
  },
  medium: {
    wordCount: '1200-2000 words',
    sections: '4-6 sections',
    depth: 'Comprehensive coverage with detailed insights'
  },
  long: {
    wordCount: '2000-3000 words',
    sections: '6-8 sections',
    depth: 'In-depth analysis with expert perspectives'
  }
};

// Templates for different tones
export const TONE_TEMPLATES = {
  professional: `Maintain a formal, authoritative tone. Use industry-specific terminology where appropriate. Focus on data-driven insights and expert analysis.`,
  
  casual: `Use a conversational, friendly tone. Write as if speaking directly to the reader. Incorporate relatable examples and storytelling elements.`,
  
  inspirational: `Use motivational language and emotional appeal. Include inspiring stories, quotes, or examples. Focus on possibilities and positive outcomes.`,
  
  analytical: `Present detailed analysis backed by data. Use logical arguments and evidence. Maintain objectivity and critical thinking throughout.`,
  
  conversational: `Write in a personal, engaging manner. Use first and second person pronouns. Incorporate questions to engage the reader. Keep sentences varied but generally shorter.`
};

// System prompt for newsletter generation
export const NEWSLETTER_SYSTEM_PROMPT = `You are NOVA (Neural Optimized Virtual Assistant), an expert newsletter writer specializing in creating engaging, informative content. Your task is to create a well-structured, professionally formatted newsletter based on the provided parameters.

Focus on delivering high-quality content that provides real value to the specified audience. Use appropriate headings, lists, and formatting to enhance readability. Ensure all content is fact-based, balanced, and avoids speculation or hyperbole.`;

export default {
  NEWSLETTER_BASE_TEMPLATE,
  LENGTH_CONFIGS,
  TONE_TEMPLATES,
  NEWSLETTER_SYSTEM_PROMPT
};
