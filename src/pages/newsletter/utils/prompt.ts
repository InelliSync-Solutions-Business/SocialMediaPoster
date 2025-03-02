import { Newsletter } from '../types/newsletter';

const LENGTH_GUIDELINES = {
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

const TYPE_GUIDELINES = {
  'tech-trends': {
    focus: 'Latest technology trends and innovations',
    elements: ['Emerging technologies', 'Market impact', 'Future predictions']
  },
  'industry-insights': {
    focus: 'Industry analysis and expert perspectives',
    elements: ['Market analysis', 'Expert opinions', 'Best practices']
  },
  'product-updates': {
    focus: 'Product features and development updates',
    elements: ['Feature highlights', 'Use cases', 'Implementation tips']
  },
  'company-news': {
    focus: 'Company developments and achievements',
    elements: ['Milestones', 'Team highlights', 'Future plans']
  }
};

export const generateNewsletterPrompt = (params: Newsletter): string => {
  const lengthGuide = LENGTH_GUIDELINES[params.length];
  
  // Check if the newsletter type exists in TYPE_GUIDELINES
  // If not, use a default or generic guideline
  const typeGuide = TYPE_GUIDELINES[params.type as keyof typeof TYPE_GUIDELINES] || {
    focus: `Content related to ${params.type.replace(/-/g, ' ')}`,
    elements: ['Key insights', 'Actionable information', 'Relevant examples']
  };

  return `Generate a ${params.tone} newsletter about ${params.topic}.

NEWSLETTER TYPE: ${params.type}
Focus Area: ${typeGuide.focus}
Key Elements: ${typeGuide.elements.join(', ')}

CONTENT PARAMETERS:
- Target Audience: ${params.targetAudience}
- Writing Style: ${params.writingStyle}
- Length: ${lengthGuide.wordCount}
- Sections: ${lengthGuide.sections}
- Depth: ${lengthGuide.depth}
${params.additionalGuidelines ? `- Additional Guidelines: ${params.additionalGuidelines}` : ''}

REQUIRED SECTIONS:
1. Title: Create an attention-grabbing title
2. Introduction: Brief, engaging overview
3. Main Content: ${lengthGuide.sections}
4. Conclusion: Summarize key points
5. Call-to-Action: Compelling next steps

TONE AND STYLE GUIDELINES:
- Maintain a ${params.tone} tone throughout
- Use ${params.writingStyle} writing style
- Focus on providing value to ${params.targetAudience}
- Include relevant examples and data points
- Ensure content is actionable and engaging

OUTPUT FORMAT:
{
  "title": "Newsletter title",
  "introduction": "Opening paragraph",
  "sections": [
    {
      "title": "Section title",
      "content": "Section content"
    }
  ],
  "conclusion": "Closing paragraph",
  "callToAction": "Call to action message"
}`;
};
