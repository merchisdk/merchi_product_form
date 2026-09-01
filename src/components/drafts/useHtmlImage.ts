import { useEffect, useState } from 'react';

export function useHtmlImage(src?: string | null): HTMLImageElement | undefined {
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);

  useEffect(() => {
    if (!src) {
      setImage(undefined);
      return undefined;
    }
    let cancelled = false;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!cancelled) setImage(img);
    };
    img.onerror = () => {
      if (cancelled) return;
      const fallback = new window.Image();
      fallback.onload = () => {
        if (!cancelled) setImage(fallback);
      };
      fallback.onerror = () => {
        if (!cancelled) setImage(undefined);
      };
      fallback.src = src;
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return image;
}
