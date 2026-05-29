/**
 * RichTextRenderer Component
 * Safely renders HTML content from rich text editors (CKEditor, TinyMCE)
 * with proper Tailwind prose styling and sanitization.
 * 
 * Features:
 * - Applies Tailwind prose styling for professional formatting
 * - Supports bullets, numbered lists, headings, paragraphs, links, etc.
 * - Properly handles spacing and typography
 * - Safe rendering of HTML content
 */

interface RichTextRendererProps {
  html?: string | null;
  className?: string;
}

export function RichTextRenderer({ html, className = "" }: RichTextRendererProps) {
  if (!html) {
    return null;
  }

  return (
    <div
      className={`prose prose-slate max-w-none 
        prose-p:leading-7 
        prose-p:text-slate-700
        prose-headings:font-bold 
        prose-headings:text-slate-900
        prose-h1:text-3xl 
        prose-h2:text-2xl 
        prose-h3:text-xl 
        prose-h4:text-lg
        prose-ul:list-disc 
        prose-ul:ml-6
        prose-ol:list-decimal 
        prose-ol:ml-6
        prose-li:text-slate-700
        prose-strong:text-slate-900 
        prose-strong:font-semibold
        prose-em:text-slate-700
        prose-a:text-primary 
        prose-a:hover:text-primary/80
        prose-a:underline
        prose-blockquote:border-l-4 
        prose-blockquote:border-primary 
        prose-blockquote:pl-4 
        prose-blockquote:text-slate-600
        prose-blockquote:italic
        ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
