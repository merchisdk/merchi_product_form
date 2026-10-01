import { Accept } from 'react-dropzone';

const EXTENSION_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.ai': 'application/postscript',
  '.eps': 'application/postscript',
  '.psd': 'image/vnd.adobe.photoshop',
};

/** react-dropzone 14 matches `{ mime: ['.ext'] }`, not a comma-separated string. */
export function dropzoneAccept(accept?: string): Accept | undefined {
  if (!accept) return undefined;
  const map: Record<string, string[]> = {};
  for (const part of String(accept).split(',')) {
    const ext = part.trim().toLowerCase();
    if (!ext.startsWith('.')) continue;
    const mime = EXTENSION_MIME[ext] || 'application/octet-stream';
    if (!map[mime]) map[mime] = [];
    if (!map[mime].includes(ext)) map[mime].push(ext);
  }
  return Object.keys(map).length ? map : undefined;
}
