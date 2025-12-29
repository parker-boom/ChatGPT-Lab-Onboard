/**
 * Utility functions for the ChatGPT Lab app
 */

/**
 * Parses Beaker's markdown-style dialogue into HTML.
 * Supports **bold** and _italic_ syntax.
 */
export function parseBeakerMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-lab-black font-semibold">$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>');
}

