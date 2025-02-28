/**
 * Utility functions for text formatting in the application
 */

/**
 * Format text with links, hashtags, and mentions for platform previews
 * @param text - The text content to format
 * @returns Object with __html property containing the formatted HTML
 */
export const formatTextWithLinks = (text: string): { __html: string } => {
  // First strip any existing HTML tags for safety
  const strippedText = text.replace(/<\/?[^>]+(>|$)/g, "");
  
  // Replace URLs with clickable links
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let formattedText = strippedText.replace(urlRegex, '<a href="$1" class="text-blue-500 hover:underline">$1</a>');
  
  // Replace hashtags with blue text
  const hashtagRegex = /#(\w+)/g;
  formattedText = formattedText.replace(hashtagRegex, '<span class="text-blue-500">#$1</span>');
  
  // Replace mentions with blue text
  const mentionRegex = /@(\w+)/g;
  formattedText = formattedText.replace(mentionRegex, '<span class="text-blue-500">@$1</span>');
  
  // Format paragraphs
  formattedText = formattedText.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('');
  
  // Format line breaks within paragraphs
  formattedText = formattedText.replace(/\n/g, '<br>');
  
  return { __html: formattedText };
};

/**
 * Parse markdown content and convert to HTML
 * @param content - The markdown content to parse
 * @returns Parsed HTML content
 */
export const parseContentWithHTMLTags = (content: string): string => {
  if (!content) return '';

  // Replace markdown headings with HTML headings
  let htmlContent = content
    // Replace markdown headings with HTML headings
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    
    // Replace markdown bold with HTML bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    
    // Replace markdown italic with HTML italic
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    
    // Replace markdown bullet lists with HTML lists
    .replace(/^\s*[-*+]\s+(.*$)/gim, '<li>$1</li>')
    
    // Replace markdown numbered lists with HTML ordered lists
    .replace(/^\s*(\d+)\.\s+(.*$)/gim, '<li value="$1">$2</li>');
  
  // Wrap adjacent list items in ul/ol tags
  htmlContent = htmlContent
    .replace(/<li>(.*?)<\/li>(\s*<li>)/gim, '<li>$1</li>$2')
    .replace(/(<li>[^<]+<\/li>\s*)+/gim, (match) => {
      // Determine if this is a numbered list by checking for value attributes
      if (match.includes('value=')) {
        return `<ol>${match}</ol>`;
      } else {
        return `<ul>${match}</ul>`;
      }
    });
  
  // Split content into sections, handling both lists and paragraphs
  const sections = htmlContent.split(/\n\n+/);
  
  // Process each section
  return sections.map(section => {
    // If the section already has HTML tags, return it as is
    if (section.trim().startsWith('<')) {
      return section;
    }
    
    // Check if the section starts with a number (for numbered lists)
    const numberMatch = section.match(/^(\d+)\.\s*(.+)/);
    
    if (numberMatch) {
      // If it's a numbered list item, create an <h3> for headings
      return `<h3>${numberMatch[1]}. ${numberMatch[2]}</h3>`;
    } else {
      // For regular paragraphs, use <p> tags
      return `<p>${section}</p>`;
    }
  }).join('');
};

/**
 * Format content into Twitter thread format
 * @param content - The content to format as a thread
 * @returns Array of thread posts
 */
export const formatThreadedPost = (content: string): string[] => {
  if (!content) return [];
  
  // If content already contains thread separators, use them
  if (content.includes('---')) {
    return content.split('---')
      .map((tweet, index) => tweet.trim())
      .filter(tweet => tweet.length > 0)
      .map((tweet, index) => `${index + 1}/${content.split('---').filter(t => t.trim().length > 0).length} ${tweet}`);
  }
  
  // Otherwise, intelligently split the content into threads
  const MAX_CHARS = 280; // Twitter's character limit
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
  const threads: string[] = [];
  let currentThread = '';
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    // Account for thread number in character count (e.g., "1/4 ")
    const threadNumberLength = (threads.length + 2).toString().length * 2 + 2; // "X/Y "
    const potentialThread = currentThread ? `${currentThread} ${trimmedSentence}` : trimmedSentence;
    
    // If adding this sentence would exceed the limit (including thread number), start a new thread
    if ((potentialThread.length + threadNumberLength) > MAX_CHARS && currentThread) {
      threads.push(currentThread.trim());
      currentThread = trimmedSentence;
    } else {
      currentThread = potentialThread;
    }
  }
  
  // Add the last thread if there's content
  if (currentThread) {
    threads.push(currentThread.trim());
  }
  
  // Add thread numbers to each thread
  return threads.map((thread, index) => `${index + 1}/${threads.length} ${thread}`);
};

/**
 * Parse content into thread posts
 * @param content - The content to parse as threads
 * @returns Array of thread post objects
 */
export const parseThreads = (content: string): { id: string; content: string; characterCount: number }[] => {
  // Split content by numbered points (1., 2., 3., etc)
  const parts = content.split(/\d+\.\s+/);
  
  // Get the introduction (everything before the first number)
  const intro = parts[0];
  
  // Get the numbered points (excluding the intro)
  const points = parts.slice(1);
  
  const threads: { id: string; content: string; characterCount: number }[] = [];
  
  // Add intro as the first thread if it's not empty
  if (intro.trim()) {
    threads.push({
      id: `thread-${0}`,
      content: intro.trim(),
      characterCount: intro.trim().length
    });
  }
  
  // Add each point as a separate thread
  points.forEach((point, index) => {
    if (point.trim()) {
      threads.push({
        id: `thread-${index + 1}`,
        content: `${index + 1}. ${point.trim()}`,
        characterCount: point.trim().length
      });
    }
  });
  
  return threads;
};
