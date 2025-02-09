// Content prompts for different types of content generation

const CONTENT_PROMPTS = {
  newsletter: {
    standard: `Create a professional newsletter that effectively communicates the following topic. 
    Focus on delivering value to the readers through well-structured, engaging content.
    Include relevant insights, updates, and actionable takeaways where appropriate.`,
    
    educational: `Create an educational newsletter that breaks down complex topics into easily digestible content.
    Focus on clear explanations, practical examples, and key learning points.
    Include relevant case studies or real-world applications where appropriate.`,
    
    promotional: `Create a promotional newsletter that highlights key offerings while maintaining reader engagement.
    Focus on value proposition and benefits while avoiding overly aggressive sales language.
    Include clear calls-to-action and relevant social proof where appropriate.`,
    
    community: `Create a community-focused newsletter that fosters engagement and connection.
    Focus on sharing community updates, highlights, and opportunities for involvement.
    Include member spotlights, upcoming events, or collaborative opportunities where appropriate.`,
    
    update: `Create an update-style newsletter that effectively communicates recent developments or changes.
    Focus on clarity, transparency, and relevant context for the updates.
    Include timelines, impact assessments, and next steps where appropriate.`
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
