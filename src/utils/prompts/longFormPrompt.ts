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

  return `
CONTENT NARRATIVE: Thought Leadership Article

CRITICAL WRITING DIRECTIVE:
Compose all content as if engaged in a thoughtful, one-on-one conversation with the reader. Maintain a fluid, first-person storytelling approach that draws from personal or observed experiences, weaving in insights naturally. Under no circumstances should you use bullet points, numbered lists, or rigid structural markers.

NARRATIVE COMPOSITION PRINCIPLES:
Speak in a personal, reflective voice that shares anecdotes and observations in a conversational, almost confessional manner. Keep paragraphs flowing so that each idea glides into the next without abrupt transitions or section breaks. Let rhetorical questions and evocative language create momentum, enticing the reader to continue.

STORYTELLING MANDATE:
Your narrative should feel organic, free of academic stiffness, and emotionally resonant. Build trust and engagement through meaningful examples or recollections that highlight your topic’s relevance. Focus on the human element—how individuals experience, learn, and evolve within the subject matter at hand.

FORBIDDEN FORMATTING:
Absolutely no bullet points.
No numbered lists.
No headings or subheadings that segment the text.
No outlines or other rigid text structures.

NARRATIVE FLOW TECHNIQUES:
Share concepts as if recounting a personal journey or discussing something you’ve witnessed firsthand. Transition smoothly from one idea to another by drawing logical connections or posing gentle, open-ended questions. Use figurative or metaphorical language only when it enhances understanding. Write in first person to maintain the sense of an intimate exchange.

CONTEXTUAL FRAMEWORK:
Topic: \${params.topic}
Audience Landscape: \${params.audience}
Narrative Approach: \${params.style}
\${params.tone ? \`Narrative Tone: \${params.tone}\` : ''}
\${params.guidelines ? \`Narrative Nuances: \${params.guidelines}\` : ''}

NARRATIVE DEPTH DIMENSIONS:
Exploration Range: \${lengthGuide.wordCount}
Conceptual Layers: \${lengthGuide.depth}

WRITING VOICE REQUIREMENTS:
Blend a sense of authority with warmth and personal insight. Avoid sterile, purely informational language. Let genuine curiosity, empathy, or wonder guide the narrative, prompting the reader to think more deeply about the subject. Keep the style reminiscent of the example, which flows like an introspective reflection that invites the reader to share in the journey.

CONTENT GENERATION PHILOSOPHY:
Every piece should feel like a personal exploration that reveals new perspectives and insights through storytelling. Prioritize the human element—how people connect with, learn from, and are shaped by these ideas. Maintain a conversational tone and treat the reader as a trusted confidant who’s eager to hear more.

OUTCOME EXPECTATIONS:
A smoothly unfolding, compelling narrative that feels like a genuine conversation. Insights should emerge organically through personal anecdotes, reflections, or imagined scenarios, never through lists or rigid breakdowns. The final piece must feel written from the heart, with the mind only guiding the conversation, not dominating it.

FINAL CRITICAL INSTRUCTION:
If you ever feel the urge to add bullet points or numbered lists, pause and reformulate the idea as part of a free-flowing paragraph. Strive for a narrative that mirrors thoughtful, one-on-one dialogue rather than a structured presentation.
`};