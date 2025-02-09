// Content prompts for different types of content generation

const CONTENT_PROMPTS = {
  newsletter: {
    professional: `Create a professional newsletter that demonstrates expertise and credibility.
    Focus on delivering high-quality, authoritative content with clear, concise language.
    Include data-driven insights, expert analysis, and strategic recommendations.
    Maintain a formal, polished tone that resonates with professional audiences.
    Use precise industry terminology and structured, logical presentation.`,
    
    casual: `Create a conversational, approachable newsletter that feels like a friendly chat.
    Focus on creating a warm, relatable tone that makes complex topics feel accessible.
    Use everyday language, personal anecdotes, and a light-hearted writing style.
    Engage readers through a conversational approach that feels natural and easy to read.
    Incorporate humor and colloquial expressions where appropriate.`,
    
    inspirational: `Create an uplifting newsletter that motivates and empowers the reader.
    Focus on storytelling that sparks emotion, hope, and personal growth.
    Use powerful narratives, motivational quotes, and transformative insights.
    Craft a tone that is encouraging, optimistic, and deeply meaningful.
    Highlight success stories, personal journeys, and potential for positive change.`,
    
    technical: `Create a detailed, in-depth newsletter for technically-minded readers.
    Focus on providing comprehensive, precise technical information and analysis.
    Use advanced technical terminology, detailed explanations, and in-depth research.
    Include code snippets, technical diagrams, and rigorous methodological breakdowns.
    Maintain a precise, analytical tone that prioritizes accuracy and depth of information.`,
    
    trendingHashtags: `Create a trend-focused newsletter that captures the pulse of current industry conversations.
    Focus on emerging trends, viral topics, and timely insights.
    Incorporate trending hashtags and social media buzz to demonstrate real-time relevance.
    Use a dynamic, energetic tone that reflects the fast-paced nature of trending content.`,
    
    characterLimitOptimization: `Create a concise, information-dense newsletter that maximizes impact within tight constraints.
    Focus on delivering key insights through succinct, carefully crafted messaging.
    Use strategic formatting, bullet points, and precise language to convey complex ideas efficiently.
    Maintain a crisp, no-fluff tone that respects the reader's time and attention.`,
    
    threadedDiscussions: `Create a narrative-driven newsletter that tells a cohesive, multi-part story.
    Focus on building a compelling narrative arc across different sections.
    Use interconnected content that encourages readers to follow the entire thread.
    Employ a storytelling approach that maintains suspense and reader engagement.`
  },
  threadPrompt: `
    You are an expert social media content creator specializing in generating engaging, interconnected thread posts.

    Thread Generation Principles:
    1. Create a narrative arc across multiple posts
    2. Ensure each post builds upon the previous one
    3. Maintain a consistent tone and style
    4. Use strategic hooks to keep the audience engaged
    5. Include relevant hashtags and emojis
    6. Balance information density with readability

    Thread Structure Guidelines:
    - First Post: Introduce the topic with a compelling hook
    - Middle Posts: Provide depth, insights, and supporting details
    - Final Post: Conclude with a strong call-to-action or thought-provoking statement

    Formatting Requirements:
    - STRICT Character Limit: EACH post MUST be between 140-240 characters
    - Maximum 6 thread posts
    - Use clear, concise language
    - Incorporate storytelling techniques
    - Every post must be meaningful and contribute to the overall narrative

    Character Count Enforcement:
    - Posts shorter than 140 characters will be REJECTED
    - Posts longer than 240 characters will be TRUNCATED
    - Focus on precision and impact within the character constraint
  `
};

export default CONTENT_PROMPTS;
