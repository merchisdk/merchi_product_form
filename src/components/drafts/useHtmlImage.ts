import { useEffect, useState } from 'react';
import { loadHtmlImageFromSources } from '../../utils/draftExport';

function asSources(src?: string | string[] | null): string[] {
  if (!src) return [];
  return (Array.isArray(src) ? src : [src]).filter(Boolean);
}

export function useHtmlImage(src?: string | string[] | null): HTMLImageElement | undefined {
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  const sources = asSources(src);
  const sourceKey = sources.join('|');

  useEffect(() => {
    if (!sources.length) {
      setImage(undefined);
      return undefined;
    }
    let cancelled = false;
    let objectUrl = '';

    loadHtmlImageFromSources(sources, true).then((img) => {
      if (cancelled) {
        const persisted = (img as HTMLImageElement & { _merchiObjectUrl?: string })._merchiObjectUrl;
        if (persisted) URL.revokeObjectURL(persisted);
        return;
      }
      objectUrl = (img as HTMLImageElement & { _merchiObjectUrl?: string })._merchiObjectUrl || '';
      setImage(img);
    }).catch(() => {
      if (!cancelled) setImage(undefined);
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [sourceKey]);

  return image;
}
