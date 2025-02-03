import { UserPreferences } from '@/types/preferences';

export interface LongFormPromptParams {
  topic: string;
  style: string;
  audience: string;
  guidelines?: string;
  tone?: 'professional' | 'casual' | 'inspirational' | 'humorous';
  length?: 'short' | 'medium' | 'long';
}

const LENGTH_GUIDELINES = {
  short: {
    wordCount: '800-1200 words',
    sections: '3-4 main sections',
    depth: 'Focused overview with key insights'
  },
  medium: {
    wordCount: '1200-2000 words',
    sections: '4-6 main sections',
    depth: 'Comprehensive coverage with detailed examples'
  },
  long: {
    wordCount: '2000-3000 words',
    sections: '6-8 main sections',
    depth: 'In-depth analysis with expert insights'
  }
};

export const generateLongFormPrompt = (
  params: LongFormPromptParams,
  preferences?: UserPreferences
) => {
  const lengthGuide = LENGTH_GUIDELINES[params.length || 'medium'];

  return `CONTENT TYPE: Long-Form Tech Article

CORE OBJECTIVE:
Create an authoritative, in-depth piece that establishes thought leadership while providing actionable insights for the target audience.

CONTENT PARAMETERS:
Topic: ${params.topic}
Target Audience: ${params.audience}
Writing Style: ${params.style}
${params.tone ? `Tone: ${params.tone}` : ''}
${params.guidelines ? `Additional Guidelines: ${params.guidelines}` : ''}

STRUCTURAL REQUIREMENTS:
- Target Length: ${lengthGuide.wordCount}
- Section Structure: ${lengthGuide.sections}
- Depth Level: ${lengthGuide.depth}

CONTENT FRAMEWORK:
1. Introduction
   - Compelling hook that establishes relevance
   - Clear value proposition for the reader
   - Overview of key points to be covered

2. Core Content Structure
   - Logical progression of ideas
   - Clear section headers and subheaders
   - Strategic use of bullet points and lists
   - Integration of relevant statistics and data
   - Real-world examples and case studies

3. Technical Depth
   - Balance technical accuracy with accessibility
   - Define complex terms when introduced
   - Use analogies to explain complex concepts
   - Include practical applications

4. Engagement Elements
   - Incorporate relevant visuals/diagrams
   - Use callout boxes for key insights
   - Include expert quotes or perspectives
   - Add interactive elements where appropriate

5. SEO Optimization
   - Strategic keyword placement
   - Optimized meta description
   - Clear heading hierarchy
   - Internal and external linking

WRITING GUIDELINES:
1. Tech Leadership
   - Demonstrate deep domain expertise
   - Connect to broader industry trends
   - Provide forward-looking insights
   - Include expert analysis

2. Accessibility
   - Clear, concise explanations
   - Progressive disclosure of complex topics
   - Relevant examples and use cases
   - Actionable takeaways

3. Engagement
   - Conversational yet authoritative tone
   - Regular engagement hooks
   - Discussion prompts
   - Clear calls-to-action

OUTPUT REQUIREMENTS:
1. Complete article with proper formatting
2. Suggested title and meta description
3. Key takeaways summary
4. Recommended internal/external links
5. Image/visual suggestions`;
}
