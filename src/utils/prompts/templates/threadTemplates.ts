/**
 * Template strings for thread prompts
 */

// Base template for all thread prompts
export const THREAD_BASE_TEMPLATE = `
Generate a compelling {{platform}} thread about {{topic}}.

THREAD DETAILS:
- Target Audience: {{targetAudience}}
- Writing Style: {{writingStyle}}
- Tone: {{tone}}
- Guidelines: {{additionalGuidelines}}
- Thread Length: {{threadCount}} posts

PLATFORM REQUIREMENTS:
{{platformGuidance}}

THREAD STRUCTURE:
- First post: Strong hook that captures attention (max {{characterLimit}} characters)
- Middle posts: Key points, insights, or narrative development (max {{characterLimit}} characters each)
- Final post: Conclusion with insight, call to action, or question to engagement (max {{characterLimit}} characters)

FORMATTING REQUIREMENTS:
- Format as numbered posts (1/{{threadCount}}, 2/{{threadCount}}, etc.)
- Start each post with "POST [number]/{{threadCount}}:"
- Keep each post under the character limit while maintaining coherence
- Each post should be able to stand alone but also connect to the overall thread narrative
- Include relevant hashtags and/or mentions in appropriate posts
- Use emojis strategically if they enhance the message

Please create a compelling thread that delivers value to the audience:
`;

// Platform-specific guidance for threads
export const PLATFORM_GUIDANCE = {
  twitter: '- Character limit: 280 characters per post\n- Use hashtags strategically in 1-2 posts only\n- Consider adding a call for retweets or replies in the final post',
  x: '- Character limit: 280 characters per post\n- Use hashtags strategically in 1-2 posts only\n- Consider adding a call for retweets or replies in the final post',
  linkedin: '- Character limit: approximately 1,300 characters per post\n- More professional tone appropriate\n- Can include deeper industry insights',
  threads: '- Similar to Twitter format but can be longer\n- Highly visual platform, consider image opportunities\n- Strong on conversational, authentic tone',
  default: '- Keep posts concise and impactful\n- Ensure each post adds unique value\n- Maintain consistent voice throughout the thread'
};

// Character limits by platform
export const CHARACTER_LIMITS = {
  twitter: 280,
  x: 280,
  linkedin: 1300,
  threads: 500,
  default: 500
};

// System prompt for thread generation
export const THREAD_SYSTEM_PROMPT = `You are NOVA (Neural Optimized Virtual Assistant), specializing in creating engaging social media threads. Your task is to craft compelling, sequential posts that tell a cohesive story or develop an idea progressively.

Focus on creating threads that maintain reader interest from start to finish, with each post adding unique value while building toward a satisfying conclusion. Each post should respect platform character limits while maintaining clarity and impact.`;

export default {
  THREAD_BASE_TEMPLATE,
  PLATFORM_GUIDANCE,
  CHARACTER_LIMITS,
  THREAD_SYSTEM_PROMPT
};
