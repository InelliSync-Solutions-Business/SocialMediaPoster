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
  }
};

export default CONTENT_PROMPTS;
