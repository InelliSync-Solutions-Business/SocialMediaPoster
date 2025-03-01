/**
 * Adapter file to handle importing prompt functions for the server
 * This file provides a bridge between the server and the TypeScript prompt manager
 * Using ES Module syntax
 */

// Mock implementation of the prompt functions
// These will be used by the server until we can properly import the built JS files

export function buildStandardPostPrompt(platform, topic, style, audience, additionalGuidelines = '') {
  return `
Generate a social media post.
Post Type: ${platform}
Topic: ${topic}
Target Audience: ${audience || 'General audience'}
Style: ${style || 'Informative'}
Guidelines: ${additionalGuidelines || 'Keep it engaging and concise'}

FORMATTING REQUIREMENTS:
- Use clear, structured formatting with proper sections
- Include a compelling headline/title
- Use bullet points or numbered lists where appropriate
- Highlight key points with emphasis
- For longer posts, use clear section headings
- Use emojis strategically where appropriate
- End with a clear call-to-action
  `;
}

export function buildThreadPrompt(platform, topic, style, audience, additionalGuidelines = '') {
  return `
Generate a Twitter thread (4-6 tweets) about the following topic. Each tweet should be separated by "---" and be under 280 characters.

Topic: ${topic}
Target Audience: ${audience || 'General audience'}
Writing Style: ${style || 'Informative'}
Additional Guidelines: ${additionalGuidelines || 'Make it engaging and informative'}

Requirements:
1. Start with a hook tweet that grabs attention
2. Each tweet should flow naturally to the next
3. Include relevant emojis where appropriate
4. End with a call-to-action
5. Keep each tweet under 280 characters
6. Separate tweets with "---"

Example Format:
🧵 First tweet here...
---
Second tweet continues the story...
---
Final tweet with call-to-action 🎯

Please generate the thread now:
  `;
}

export function buildPollPrompt(platform, topic, style, audience, additionalGuidelines = '') {
  return `
Generate an engaging social media poll.
Topic: ${topic}
Target Audience: ${audience || 'General audience'}
Style: ${style || 'Informative'}
Guidelines: ${additionalGuidelines || 'Keep it engaging and concise'}

Please format the response with proper structure and formatting:
# [ENGAGING POLL TITLE]

## Poll Question
[Your question here]

## Options
- Option A: [First option]
- Option B: [Second option]
- Option C: [Third option]
- Option D: [Fourth option]

## Engagement Strategy
[Brief explanation of why this poll is engaging and how it connects with the audience]
`;
}

export function parseThreadContent(content) {
  // Simple implementation to parse thread content
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const threads = [];
  
  let currentThread = '';
  for (const line of lines) {
    if (line.startsWith('Tweet') || line.startsWith('Post')) {
      if (currentThread) {
        threads.push(currentThread.trim());
      }
      currentThread = line.split(':').slice(1).join(':').trim();
    } else {
      currentThread += ' ' + line.trim();
    }
  }
  
  if (currentThread) {
    threads.push(currentThread.trim());
  }
  
  return threads.length > 0 ? threads : [content];
}

export function truncateContent(content, maxLength = 500) {
  if (!content) return '';
  
  // If content is already within limits, return it as is
  if (content.length <= maxLength) return content;
  
  // Log the original content length for debugging
  console.log(`Truncating content from ${content.length} to ~${maxLength} characters`);
  
  // Extract title/headline if it exists (usually in markdown format with # or ** markers)
  let title = '';
  const titleMatch = content.match(/^(#+\s+.*?|\*\*.*?\*\*)$/m);
  if (titleMatch) {
    title = titleMatch[0];
    console.log(`Found title: "${title}"`);
  }
  
  // Extract hashtags if they exist
  let hashtags = '';
  const hashtagMatch = content.match(/(#\w+\s*)+$/m);
  if (hashtagMatch) {
    hashtags = hashtagMatch[0];
    console.log(`Found hashtags: "${hashtags}"`);
  }
  
  // Calculate how much space we have left for the main content
  const reservedLength = title.length + hashtags.length + 20; // 20 chars buffer
  const mainContentLength = maxLength - reservedLength;
  console.log(`Reserved ${reservedLength} characters for title/hashtags, leaving ${mainContentLength} for main content`);
  
  // Extract the first few sentences of the main content
  let mainContent = '';
  const contentWithoutTitleAndHashtags = content
    .replace(title, '')
    .replace(hashtags, '')
    .trim();
  
  // Try to get the first paragraph
  const paragraphs = contentWithoutTitleAndHashtags.split(/\n\n+/);
  const firstParagraph = paragraphs[0];
  
  if (firstParagraph && firstParagraph.length <= mainContentLength) {
    // If the first paragraph fits, use it
    mainContent = firstParagraph;
    
    // If we have space left, try to add more paragraphs
    let remainingLength = mainContentLength - firstParagraph.length;
    let i = 1;
    
    while (i < paragraphs.length && remainingLength > 50) { // Ensure at least 50 chars worth adding
      const nextParagraph = paragraphs[i];
      if (nextParagraph.length <= remainingLength - 4) { // -4 for the '\n\n'
        mainContent += '\n\n' + nextParagraph;
        remainingLength -= (nextParagraph.length + 4);
      } else {
        break;
      }
      i++;
    }
  } else {
    // If first paragraph is too long, take sentences from it
    const sentences = firstParagraph.match(/[^.!?]+[.!?]+/g) || [];
    for (const sentence of sentences) {
      if ((mainContent + sentence).length <= mainContentLength) {
        mainContent += sentence;
      } else {
        // If we can't fit the whole sentence, try to add at least part of it
        if (mainContent.length < mainContentLength / 2) {
          // Only add partial sentence if we've used less than half our budget
          const remainingChars = mainContentLength - mainContent.length - 3; // -3 for '...'
          if (remainingChars > 30) { // Only add if we can include a meaningful chunk
            mainContent += sentence.substring(0, remainingChars) + '...';
          }
        }
        break;
      }
    }
  }
  
  // Combine the parts with appropriate spacing
  let result = '';
  if (title) result += title + '\n\n';
  if (mainContent) result += mainContent + '\n\n';
  if (hashtags) result += hashtags;
  
  const finalResult = result.trim();
  console.log(`Truncated content to ${finalResult.length} characters`);
  
  return finalResult;
}

export function generateImagePrompt(params) {
  const { content, style = '', format = '', platform = '' } = params;
  
  // Log the original request
  console.log('Generating image prompt with params:', {
    contentLength: content ? content.length : 0,
    style,
    format,
    platform
  });
  
  // Truncate content to ensure it fits within OpenAI's limits
  // DALL-E has a limit of ~1000 characters, but we use 500 to leave room for other parameters
  const truncatedContent = truncateContent(content, 500);
  
  // Build the prompt with the truncated content
  const prompt = `Create an image that visually represents the following social media content: ${truncatedContent}
${style ? `\nStyle: ${style}` : ''}
${format ? `\nFormat: Optimize for ${format}` : ''}
${platform ? `\nPlatform: Optimize for ${platform}` : ''}`;
  
  // Log the final prompt length for debugging
  console.log(`Final image prompt length: ${prompt.length} characters`);
  
  return prompt;
}

export function buildNewsletterPrompt(newsletterType, topic, style, audience, additionalGuidelines = '', length = 'medium', tone = 'professional') {
  // Get current date formatted
  const currentDate = new Date();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const formattedDate = `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  // Determine if the date should be included based on topic keywords
  const dateKeywords = ["today", "this week", "current", "latest", "recent", "monthly", "weekly", "annual", "yearly"];
  const includeDate = dateKeywords.some(keyword => 
    topic.toLowerCase().includes(keyword) || 
    (newsletterType && newsletterType.toLowerCase().includes(keyword))
  );
  
  const dateIntro = includeDate ? `Welcome to the ${formattedDate} edition, ` : `Welcome to `;

  // Length configuration
  const lengthConfig = {
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
  }[length] || {
    wordCount: '1200-2000 words',
    sections: '4-6 sections', 
    depth: 'Balanced content with key insights'
  };

  return `
Generate a professional newsletter about ${topic}.

NEWSLETTER DETAILS:
- Type: ${newsletterType}
- Target Audience: ${audience || 'General audience'}
- Writing Style: ${style || 'Informative'}
- Tone: ${tone}
- Length: ${length} (${lengthConfig.wordCount})
${additionalGuidelines ? `- Additional Guidelines: ${additionalGuidelines}` : ''}

STRUCTURE REQUIREMENTS:
- Include a clear, engaging title/headline
- Start with a brief introduction (${dateIntro})
- Create ${lengthConfig.sections}
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
}
