/**
 * Parser for newsletter content
 */

interface NewsletterParsed {
  title: string;
  subject: string;
  sections: NewsletterSection[];
  callToAction?: string;
  footer?: string;
}

interface NewsletterSection {
  title: string;
  content: string;
}

/**
 * Parses newsletter content from AI-generated markdown
 * 
 * @param content The AI-generated content to parse
 * @returns Structured newsletter data
 */
export function parseNewsletterContent(content: string): NewsletterParsed {
  const result: NewsletterParsed = {
    title: '',
    subject: '',
    sections: []
  };

  try {
    // Extract title (typically the first h1 heading)
    const titleMatch = content.match(/^#\s*(.*?)(?:\n|$)/);
    if (titleMatch && titleMatch[1]) {
      result.title = titleMatch[1].trim();
    }

    // Extract subject line (typically after ## Subject line:)
    const subjectMatch = content.match(/##\s*(?:Subject(?:\s*Line)?|Email Subject)(?:\s*:)?\s*\n+(.*?)(?:\n+##|$)/is);
    if (subjectMatch && subjectMatch[1]) {
      result.subject = subjectMatch[1].trim();
    } else if (result.title) {
      // If no subject specified, use the title
      result.subject = result.title;
    }

    // Extract sections (anything between ## headings)
    const sectionRegex = /##\s*((?!Subject|CTA|Call to Action|Footer).+?)(?:\s*:)?\s*\n+([\s\S]*?)(?=\n+##|$)/g;
    let sectionMatch;
    
    while ((sectionMatch = sectionRegex.exec(content)) !== null) {
      const sectionTitle = sectionMatch[1].trim();
      const sectionContent = sectionMatch[2].trim();
      
      // Avoid adding empty sections or special sections like subject/CTA
      if (
        sectionContent &&
        !sectionTitle.match(/subject|cta|call to action|footer/i)
      ) {
        result.sections.push({
          title: sectionTitle,
          content: sectionContent
        });
      }
    }

    // If no sections extracted via headings, try to parse the content as-is
    if (result.sections.length === 0) {
      // Remove the title and subject lines if already extracted
      let remaining = content;
      if (titleMatch) {
        remaining = remaining.replace(titleMatch[0], '');
      }
      if (subjectMatch) {
        remaining = remaining.replace(subjectMatch[0], '');
      }
      
      // Split by blank lines to create paragraphs
      const paragraphs = remaining
        .split(/\n{2,}/)
        .map(p => p.trim())
        .filter(Boolean);
      
      if (paragraphs.length > 0) {
        // Use the first paragraph as main content
        result.sections.push({
          title: 'Main Content',
          content: paragraphs.join('\n\n')
        });
      }
    }

    // Extract call to action
    const ctaMatch = content.match(/##\s*(?:CTA|Call to Action)(?:\s*:)?\s*\n+([\s\S]*?)(?=\n+##|$)/i);
    if (ctaMatch && ctaMatch[1]) {
      result.callToAction = ctaMatch[1].trim();
    }

    // Extract footer
    const footerMatch = content.match(/##\s*Footer(?:\s*:)?\s*\n+([\s\S]*?)$/i);
    if (footerMatch && footerMatch[1]) {
      result.footer = footerMatch[1].trim();
    }

    // If no footer and call to action found, look for them at the end
    if (!result.callToAction && !result.footer) {
      const lines = content.split('\n');
      // Check the last 5 lines for CTA-like or footer-like content
      for (let i = lines.length - 5; i < lines.length; i++) {
        if (i >= 0) {
          const line = lines[i].trim();
          if (
            line.match(/click here|sign up|learn more|visit|contact|subscribe/i) &&
            !result.callToAction
          ) {
            result.callToAction = line;
          } else if (
            line.match(/copyright|rights reserved|unsubscribe/i) &&
            !result.footer
          ) {
            result.footer = line;
          }
        }
      }
    }

    return result;
    
  } catch (error) {
    console.error('Error parsing newsletter content:', error);
    
    // Return basic structure with whatever we have
    if (!result.title && content.length > 0) {
      // Use first line as title
      const firstLine = content.split('\n')[0].trim();
      result.title = firstLine;
      result.subject = firstLine;
    }
    
    if (result.sections.length === 0 && content.length > 0) {
      // Use content as a single section
      result.sections.push({
        title: 'Content',
        content: content
      });
    }
    
    return result;
  }
}

/**
 * Format newsletter for HTML email
 * 
 * @param newsletter Parsed newsletter data
 * @returns HTML formatted newsletter
 */
export function formatNewsletterForHTML(newsletter: NewsletterParsed): string {
  try {
    let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${newsletter.title || 'Newsletter'}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; color: #333; }
    h1 { color: #2c3e50; }
    h2 { color: #3498db; margin-top: 20px; }
    .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 0.8em; color: #7f8c8d; }
    .cta { margin: 25px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #3498db; }
    a { color: #3498db; }
  </style>
</head>
<body>
  <h1>${newsletter.title || 'Newsletter'}</h1>`;

    // Add each section
    newsletter.sections.forEach(section => {
      html += `
  <h2>${section.title}</h2>
  <div>${formatMarkdownToHTML(section.content)}</div>`;
    });

    // Add call to action if present
    if (newsletter.callToAction) {
      html += `
  <div class="cta">${formatMarkdownToHTML(newsletter.callToAction)}</div>`;
    }

    // Add footer if present
    if (newsletter.footer) {
      html += `
  <div class="footer">${formatMarkdownToHTML(newsletter.footer)}</div>`;
    }

    html += `
</body>
</html>`;

    return html;
  } catch (error) {
    console.error('Error formatting newsletter to HTML:', error);
    return `<html><body><p>Error formatting newsletter. Please check the content.</p></body></html>`;
  }
}

/**
 * Simple Markdown to HTML converter
 * 
 * @param markdown Markdown content
 * @returns HTML content
 */
function formatMarkdownToHTML(markdown: string): string {
  if (!markdown) return '';
  
  // Process markdown formatting
  return markdown
    // Replace links: [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    
    // Replace bold: **text**
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    
    // Replace italic: *text*
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    
    // Replace headers: ### text
    .replace(/###\s+([^\n]+)/g, '<h3>$1</h3>')
    
    // Replace lists: - item
    .replace(/^-\s+([^\n]+)/gm, '<li>$1</li>')
    
    // Wrap lists
    .replace(/(<li>[^<]+<\/li>\n)+/g, '<ul>$&</ul>')
    
    // Replace paragraphs: blank line between text
    .replace(/\n\n([^<#].*?)\n/g, '<p>$1</p>\n')
    
    // Replace remaining line breaks
    .replace(/\n(?!<)/g, '<br>');
}

export default {
  parseNewsletterContent,
  formatNewsletterForHTML
};
