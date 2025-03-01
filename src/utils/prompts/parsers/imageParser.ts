/**
 * Parser for image generation content
 */

interface ImagePromptData {
  subject: string;
  style: string;
  mood: string;
  details: string;
  colorScheme?: string;
  composition?: string;
  fullPrompt: string;
}

/**
 * Parse image generation data from AI response
 * 
 * @param content The AI-generated content
 * @returns Structured image prompt data
 */
export function parseImagePrompt(content: string): ImagePromptData {
  // Initialize with default values
  const result: ImagePromptData = {
    subject: '',
    style: '',
    mood: '',
    details: '',
    fullPrompt: content
  };

  try {
    // Extract subject
    const subjectMatch = content.match(/Subject(?:\s*\/?\s*Main Focus)?(?:\s*:)?\s*([^\n]+)/i);
    if (subjectMatch && subjectMatch[1]) {
      result.subject = subjectMatch[1].trim();
    }

    // Extract style
    const styleMatch = content.match(/Style(?:\s*:)?\s*([^\n]+)/i);
    if (styleMatch && styleMatch[1]) {
      result.style = styleMatch[1].trim();
    }

    // Extract mood
    const moodMatch = content.match(/(?:Mood|Atmosphere)(?:\s*:)?\s*([^\n]+)/i);
    if (moodMatch && moodMatch[1]) {
      result.mood = moodMatch[1].trim();
    }

    // Extract color scheme
    const colorMatch = content.match(/(?:Color Scheme|Colors|Palette)(?:\s*:)?\s*([^\n]+)/i);
    if (colorMatch && colorMatch[1]) {
      result.colorScheme = colorMatch[1].trim();
    }

    // Extract composition
    const compositionMatch = content.match(/(?:Composition|Layout)(?:\s*:)?\s*([^\n]+)/i);
    if (compositionMatch && compositionMatch[1]) {
      result.composition = compositionMatch[1].trim();
    }

    // Extract details
    const detailsMatch = content.match(/(?:Details|Additional Elements|Background)(?:\s*:)?\s*([^\n]+)/i);
    if (detailsMatch && detailsMatch[1]) {
      result.details = detailsMatch[1].trim();
    } else {
      // If no explicit details section, use any remaining content
      const sections = ["Subject:", "Style:", "Mood:", "Color Scheme:", "Composition:"];
      let remainingContent = content;
      
      sections.forEach(section => {
        const regex = new RegExp(`${section.replace(':', '')}(?:\\s*:)?\\s*([^\\n]+)`, 'i');
        const match = remainingContent.match(regex);
        if (match) {
          remainingContent = remainingContent.replace(match[0], '');
        }
      });
      
      // Clean up remaining content
      remainingContent = remainingContent
        .replace(/^[\s\n]+|[\s\n]+$/g, '')
        .replace(/\n{2,}/g, '\n');
      
      if (remainingContent && !result.details) {
        result.details = remainingContent;
      }
    }

    // If we have no structured data, try to extract intelligently
    if (!result.subject && !result.style && !result.mood) {
      // Just use the whole content as the prompt
      result.fullPrompt = content;
      
      // Try to extract a subject from the first sentence
      const firstSentence = content.split(/[.!?]\s/)[0];
      if (firstSentence && firstSentence.length < 100) {
        result.subject = firstSentence;
      }
    } else {
      // Build full prompt from structured data
      result.fullPrompt = buildFullPrompt(result);
    }

    return result;
  } catch (error) {
    console.error('Error parsing image prompt:', error);
    
    // Return with whatever we have
    result.fullPrompt = content; // Use original content as fallback
    return result;
  }
}

/**
 * Build a complete image prompt from structured data
 */
function buildFullPrompt(data: ImagePromptData): string {
  let prompt = '';
  
  // Subject is always first and most important
  if (data.subject) {
    prompt += data.subject;
  }
  
  // Add style if available
  if (data.style) {
    prompt += prompt ? ', ' : '';
    prompt += `in ${data.style} style`;
  }
  
  // Add mood if available
  if (data.mood) {
    prompt += prompt ? ', ' : '';
    prompt += `with ${data.mood} mood`;
  }
  
  // Add color scheme if available
  if (data.colorScheme) {
    prompt += prompt ? ', ' : '';
    prompt += `using ${data.colorScheme} colors`;
  }
  
  // Add composition if available
  if (data.composition) {
    prompt += prompt ? ', ' : '';
    prompt += data.composition;
  }
  
  // Add details if available
  if (data.details) {
    prompt += prompt ? '. ' : '';
    prompt += data.details;
  }
  
  return prompt;
}

/**
 * Truncate image prompt to fit within model limits
 * 
 * @param prompt The image prompt to truncate
 * @param maxLength Maximum allowed length
 * @returns Truncated prompt
 */
export function truncateImagePrompt(prompt: string, maxLength: number = 1000): string {
  if (!prompt || prompt.length <= maxLength) {
    return prompt;
  }
  
  try {
    // Parse the prompt if it appears to be structured
    if (prompt.includes('Subject:') || prompt.includes('Style:')) {
      const parsedPrompt = parseImagePrompt(prompt);
      
      // Rebuild with truncated elements
      const subject = truncateField(parsedPrompt.subject, 100);
      const style = truncateField(parsedPrompt.style, 50);
      const mood = truncateField(parsedPrompt.mood, 50);
      const colorScheme = truncateField(parsedPrompt.colorScheme, 30);
      const composition = truncateField(parsedPrompt.composition, 70);
      
      // Calculate remaining space for details
      const usedLength = subject.length + style.length + mood.length + 
                         (colorScheme?.length || 0) + (composition?.length || 0) +
                         20; // Account for separators and formatting
      
      const maxDetailsLength = maxLength - usedLength;
      const details = truncateField(parsedPrompt.details, maxDetailsLength);
      
      // Rebuild prompt
      let truncatedPrompt = '';
      if (subject) truncatedPrompt += `Subject: ${subject}\n`;
      if (style) truncatedPrompt += `Style: ${style}\n`;
      if (mood) truncatedPrompt += `Mood: ${mood}\n`;
      if (colorScheme) truncatedPrompt += `Color Scheme: ${colorScheme}\n`;
      if (composition) truncatedPrompt += `Composition: ${composition}\n`;
      if (details) truncatedPrompt += `Details: ${details}`;
      
      return truncatedPrompt;
    } else {
      // If not structured, intelligently truncate
      // Try to keep complete sentences where possible
      const sentences = prompt.match(/[^.!?]+[.!?]+/g) || [];
      let result = '';
      
      for (const sentence of sentences) {
        if ((result + sentence).length <= maxLength) {
          result += sentence;
        } else {
          // If we can't add a full sentence, add as much as possible
          const remaining = maxLength - result.length;
          if (remaining > 30) { // Only add partial if it's substantial
            const partial = sentence.substring(0, remaining - 3) + '...';
            result += partial;
          }
          break;
        }
      }
      
      // If we couldn't extract sentences properly, just truncate
      if (!result) {
        result = prompt.substring(0, maxLength - 3) + '...';
      }
      
      return result;
    }
  } catch (error) {
    console.error('Error truncating image prompt:', error);
    // Simple fallback truncation
    return prompt.substring(0, maxLength - 3) + '...';
  }
}

/**
 * Helper to truncate a single field intelligently
 */
function truncateField(text: string | undefined, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  // Try to find a sentence break
  const sentenceBreak = Math.max(
    text.lastIndexOf('. ', maxLength - 3),
    text.lastIndexOf('! ', maxLength - 3),
    text.lastIndexOf('? ', maxLength - 3)
  );
  
  if (sentenceBreak > maxLength * 0.5) {
    return text.substring(0, sentenceBreak + 1);
  }
  
  // Try to find word break
  const wordBreak = text.lastIndexOf(' ', maxLength - 3);
  if (wordBreak > 0) {
    return text.substring(0, wordBreak) + '...';
  }
  
  // Just truncate
  return text.substring(0, maxLength - 3) + '...';
}

export default {
  parseImagePrompt,
  truncateImagePrompt
};
