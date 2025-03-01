/**
 * Template strings for poll prompts
 */

// Base template for all poll prompts
export const POLL_BASE_TEMPLATE = `
Generate an engaging social media poll for {{platform}}.

POLL DETAILS:
- Topic: {{topic}}
- Target Audience: {{targetAudience}}
- Style: {{writingStyle}}
- Tone: {{tone}}
- Guidelines: {{additionalGuidelines}}

PLATFORM REQUIREMENTS:
{{platformGuidance}}

POLL STRUCTURE:
- Create a compelling headline/title that grabs attention
- Craft a clear, specific poll question related to the topic
- Provide {{optionCount}} distinct, balanced options
- Include a brief engagement strategy explaining why this poll will resonate with the audience

FORMATTING REQUIREMENTS:
- Use markdown formatting with proper headings (# and ##)
- Structure the response clearly with sections
- Keep options concise and easy to understand
- Include a brief explanation of why each option might appeal to different segments

OUTPUT FORMAT:
# [ENGAGING POLL TITLE]

## Poll Question
[Your question here]

## Options
- Option A: [First option]
- Option B: [Second option]
- Option C: [Third option]
- Option D: [Fourth option] (if appropriate)

## Engagement Strategy
[Brief explanation of why this poll is engaging and how it connects with the audience]
`;

// Platform-specific guidance for polls
export const PLATFORM_GUIDANCE = {
  twitter: '- Twitter polls allow 2-4 options with a maximum of 25 characters per option\n- Poll duration can be set from 5 minutes to 7 days',
  x: '- Twitter polls allow 2-4 options with a maximum of 25 characters per option\n- Poll duration can be set from 5 minutes to 7 days',
  linkedin: '- LinkedIn polls allow up to 4 options with a 30 character limit per option\n- Include a professional, thought-provoking question',
  facebook: '- Facebook polls work best with visual elements\n- Consider questions that encourage personal sharing',
  instagram: '- Instagram polls work best in Stories with simple yes/no questions\n- For feed posts, create a visually appealing graphic with the poll question',
  threads: '- Keep your poll question simple and focused\n- Consider visual elements to accompany the poll',
  default: '- Create 2-4 clear, concise options\n- Ensure options are mutually exclusive\n- Keep the question focused and specific'
};

// System prompt for poll generation
export const POLL_SYSTEM_PROMPT = `You are NOVA (Neural Optimized Virtual Assistant), specializing in creating engaging social media polls. Your task is to craft compelling polls that drive audience engagement and generate meaningful insights.

Focus on creating polls that are relevant to the target audience, easy to understand, and generate useful data. Ensure all options are balanced, distinct, and cover the range of likely responses.`;

export default {
  POLL_BASE_TEMPLATE,
  PLATFORM_GUIDANCE,
  POLL_SYSTEM_PROMPT
};
