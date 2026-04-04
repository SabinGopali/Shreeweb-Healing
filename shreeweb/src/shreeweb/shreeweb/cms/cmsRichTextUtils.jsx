import React from 'react';

/** Plain text for labels / nav (strip tags from stored HTML). */
export function stripHtmlToText(html) {
  const text = String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text;
}

/** True when editor HTML has no visible text (empty or only empty paragraphs). */
export function isEditorEmpty(html) {
  const text = String(html || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return !text;
}

/** Renders stored TipTap HTML safely in lists / previews (trusted CMS-local data only). */
export function CmsHtmlPreview({ html, className = '' }) {
  if (!html || isEditorEmpty(html)) return null;
  return (
    <div
      className={`cms-html-preview max-w-none text-sm text-stone-700 [&_a]:text-amber-900 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-stone-300 [&_blockquote]:pl-3 [&_code]:rounded [&_code]:bg-stone-100 [&_code]:px-1 [&_h1]:font-serif [&_h1]:text-xl [&_h2]:font-serif [&_h2]:text-lg [&_h3]:font-medium [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1.5 [&_p:first-child]:mt-0 [&_ul]:list-disc [&_ul]:pl-5 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
