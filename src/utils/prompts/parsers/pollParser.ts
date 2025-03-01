/**
 * Parser for poll content
 */

interface PollData {
  title: string;
  question: string;
  options: string[];
  engagementStrategy?: string;
}

/**
 * Parses poll data from AI-generated content
 * 
 * @param content The AI-generated content to parse
 * @returns Structured poll data
 */
export function parsePollContent(content: string): PollData {
  const result: PollData = {
    title: '',
    question: '',
    options: []
  };

  try {
    // Extract title (typically after # or in all caps)
    const titleMatch = content.match(/^#\s*(.*?)(?:\n|$)/) || 
                      content.match(/^([A-Z][A-Z\s!?:]+)(?:\n|$)/);
    if (titleMatch && titleMatch[1]) {
      result.title = titleMatch[1].trim();
    }

    // Extract question (typically after ## Poll Question or similar heading)
    const questionMatch = content.match(/##\s*(?:Poll\s*)?Question\s*\n+(.*?)(?:\n+##|$)/s) ||
                         content.match(/(?:POLL QUESTION|Question):\s*(.*?)(?:\n+|$)/s);
    if (questionMatch && questionMatch[1]) {
      result.question = questionMatch[1].trim();
    } else if (!result.title && content.includes('?')) {
      // If no explicit question found, use the first sentence with a question mark
      const firstQuestion = content.split('\n').find(line => line.includes('?'));
      if (firstQuestion) {
        result.question = firstQuestion.trim();
      }
    }

    // Extract options (typically after ## Options or as a list)
    const optionsSection = content.match(/##\s*Options\s*\n+([\s\S]*?)(?:\n+##|$)/s) ||
                          content.match(/(?:OPTIONS|Poll Options):\s*\n+([\s\S]*?)(?:\n+##|$)/s);
    
    if (optionsSection && optionsSection[1]) {
      // Extract options from list items
      const optionItems = optionsSection[1].match(/[-*]\s*(.*?)(?:\n|$)/g);
      if (optionItems && optionItems.length > 0) {
        result.options = optionItems.map(opt => 
          opt.replace(/^[-*]\s*(?:Option [A-D]:)?\s*/, '').trim()
        ).filter(Boolean);
      }
    }

    // If options section wasn't found, look for any list items in the content
    if (result.options.length === 0) {
      const optionItems = content.match(/[-*]\s*(.*?)(?:\n|$)/g);
      if (optionItems && optionItems.length > 0) {
        result.options = optionItems.map(opt => 
          opt.replace(/^[-*]\s*(?:Option [A-D]:)?\s*/, '').trim()
        ).filter(Boolean);
      }
    }

    // Extract engagement strategy if present
    const strategyMatch = content.match(/##\s*(?:Engagement\s*Strategy|Why This Poll Works)\s*\n+([\s\S]*?)(?:\n+##|$)/s);
    if (strategyMatch && strategyMatch[1]) {
      result.engagementStrategy = strategyMatch[1].trim();
    }

    // If we couldn't extract structured data, make best guesses
    if (!result.title && !result.question && result.options.length === 0) {
      const lines = content.split('\n').filter(line => line.trim().length > 0);
      
      // First non-empty line is probably the title or question
      if (lines.length > 0) {
        if (lines[0].includes('?')) {
          result.question = lines[0].trim();
        } else {
          result.title = lines[0].trim();
        }
      }
      
      // Look for a question if we found a title but no question
      if (result.title && !result.question) {
        const questionLine = lines.find(line => line.includes('?'));
        if (questionLine) {
          result.question = questionLine.trim();
        }
      }
      
      // Remaining lines that are short could be options
      if (result.options.length === 0) {
        result.options = lines
          .filter(line => line !== result.title && line !== result.question)
          .filter(line => line.length < 100)
          .slice(0, 4);
      }
    }

    // Ensure we have at least 2 options
    if (result.options.length < 2) {
      // Generate some generic options if we have a question
      if (result.question) {
        result.options = ['Yes', 'No'];
      }
    }

    // Limit to 4 options maximum
    result.options = result.options.slice(0, 4);

    return result;
  } catch (error) {
    console.error('Error parsing poll content:', error);
    
    // Return basic structure with whatever we have
    return {
      title: result.title || 'Poll',
      question: result.question || 'What do you think?',
      options: result.options.length >= 2 ? result.options : ['Yes', 'No']
    };
  }
}

/**
 * Format poll options based on platform constraints
 * 
 * @param options Array of poll options
 * @param platform The target platform
 * @returns Formatted options within character limits
 */
export function formatPollOptions(
  options: string[],
  platform: string
): string[] {
  const platformLower = (platform || '').toLowerCase();
  
  // Character limits by platform
  const charLimits: Record<string, number> = {
    twitter: 25,
    x: 25,
    linkedin: 30,
    facebook: 40,
    instagram: 20,
    default: 50
  };
  
  const limit = charLimits[platformLower] || charLimits.default;
  
  return options.map(option => {
    if (option.length <= limit) {
      return option;
    }
    
    // Try to find a breakpoint
    if (option.length > limit) {
      const breakpoint = option.lastIndexOf(' ', limit - 3);
      if (breakpoint > 0) {
        return option.substring(0, breakpoint) + '...';
      }
      return option.substring(0, limit - 3) + '...';
    }
    
    return option;
  });
}

export default {
  parsePollContent,
  formatPollOptions
};
