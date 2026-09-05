import { cssFontFamily, ensureDraftFonts } from './draftFonts';
import { isBackgroundFill, isFullArtboardFill } from './draftTemplates';
import { DraftCanvasObject, DraftCanvasState } from './types';

function resolveFileUrl(url: string, apiUrl?: string): string {
  if (!url) return '';
  if (/^(data:|blob:|https?:)/i.test(url)) return url;
  if (!apiUrl) return url;
  try {
    const api = new URL(apiUrl);
    if (url.startsWith('/')) return `${api.origin}${url}`;
    return new URL(url, apiUrl).href;
  } catch {
    return url;
  }
}

export function templateImageSources(template: any, apiUrl?: string): string[] {
  const file = template?.file || {};
  const raw: string[] = [];
  if (apiUrl && file.id) {
    const base = String(apiUrl).replace(/\/?$/, '/');
    raw.push(`${base}public-files/${file.id}/view/`);
  }
  raw.push(
    file.viewUrl,
    file.cachedViewUrl,
    file.downloadUrl,
    file.cachedDownloadUrl,
  );
  return [...new Set(
    raw.filter(Boolean).map((url) => resolveFileUrl(String(url), apiUrl)),
  )];
}

function loadImageElement(src: string, cors: boolean): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (cors) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

export async function loadHtmlImage(
  src: string,
  persistObjectUrl = false,
): Promise<HTMLImageElement> {
  if (!src) throw new Error('Missing image source');
  if (/^(data:|blob:)/i.test(src)) {
    return loadImageElement(src, false);
  }
  try {
    const response = await fetch(src, { mode: 'cors', credentials: 'omit' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const image = await loadImageElement(objectUrl, false);
    if (persistObjectUrl) {
      (image as HTMLImageElement & { _merchiObjectUrl?: string })._merchiObjectUrl = objectUrl;
    } else {
      URL.revokeObjectURL(objectUrl);
    }
    return image;
  } catch {
    return loadImageElement(src, true);
  }
}

export async function loadHtmlImageFromSources(
  sources: string[],
  persistObjectUrl = false,
): Promise<HTMLImageElement> {
  let lastError: unknown;
  for (const src of sources) {
    try {
      return await loadHtmlImage(src, persistObjectUrl);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Failed to load image');
}

export async function waitForDraftFonts(families: string[] = []): Promise<void> {
  ensureDraftFonts();
  if (typeof document === 'undefined' || !document.fonts) return;
  const unique = [...new Set(families.filter(Boolean))];
  await Promise.all([
    document.fonts.ready.catch(() => undefined),
    ...unique.flatMap((family) => ([
      document.fonts.load(`400 48px ${cssFontFamily(family)}`).catch(() => undefined),
      document.fonts.load(`700 48px ${cssFontFamily(family)}`).catch(() => undefined),
    ])),
  ]);
}

export function wrapLines(
  text: string,
  maxWidth: number,
  measure: (value: string) => number,
): string[] {
  const words = String(text).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (line && measure(test) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawText(ctx: CanvasRenderingContext2D, obj: DraftCanvasObject) {
  const fontSize = obj.fontSize || 48;
  const align = (obj.align as CanvasTextAlign) || 'center';
  ctx.fillStyle = obj.fill || '#111111';
  ctx.font = `${fontSize}px ${cssFontFamily(obj.fontFamily)}`;
  ctx.textBaseline = 'top';
  ctx.textAlign = align;
  const lineHeight = fontSize;
  const lines = wrapLines(
    obj.text || '',
    obj.width,
    (value) => ctx.measureText(value).width,
  );
  const blockHeight = lines.length * lineHeight;
  let cursorY = Math.max(0, (obj.height - blockHeight) / 2);
  const x = align === 'center' ? obj.width / 2 : align === 'right' ? obj.width : 0;
  for (const line of lines) {
    ctx.fillText(line, x, cursorY, obj.width);
    cursorY += lineHeight;
  }
}

export function applyKonvaObjectTransform(
  ctx: Pick<CanvasRenderingContext2D, 'translate' | 'rotate' | 'scale'>,
  obj: Pick<DraftCanvasObject, 'x' | 'y' | 'rotation' | 'scaleX' | 'scaleY'>,
) {
  // Konva rotates/scales around the node origin (top-left), not the centre.
  ctx.translate(obj.x, obj.y);
  ctx.rotate(((obj.rotation || 0) * Math.PI) / 180);
  ctx.scale(obj.scaleX || 1, obj.scaleY || 1);
}

function drawObject(
  ctx: CanvasRenderingContext2D,
  obj: DraftCanvasObject,
  image?: HTMLImageElement,
) {
  ctx.save();
  applyKonvaObjectTransform(ctx, obj);

  if (obj.type === 'rect') {
    ctx.fillStyle = obj.fill || '#cccccc';
    ctx.fillRect(0, 0, obj.width, obj.height);
  } else if (obj.type === 'text') {
    drawText(ctx, obj);
  } else if (obj.type === 'image' && image) {
    ctx.drawImage(image, 0, 0, obj.width, obj.height);
  }
  ctx.restore();
}

export function captureStageArtboard(
  stage: { toDataURL: (config: Record<string, unknown>) => string },
  view: { x: number; y: number; scale: number },
  art: { width: number; height: number },
): string {
  const scale = Math.max(view.scale || 0, 0.01);
  return stage.toDataURL({
    mimeType: 'image/png',
    pixelRatio: 1 / scale,
    x: view.x,
    y: view.y,
    width: art.width * scale,
    height: art.height * scale,
  });
}

async function renderState(
  state: DraftCanvasState,
  templateSources: string[],
  objectsOnly = false,
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(state.width));
  canvas.height = Math.max(1, Math.round(state.height));
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const fills = state.objects.filter(isBackgroundFill);
  const content = state.objects.filter((obj) => !isBackgroundFill(obj));

  if (!objectsOnly) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const drawList = async (
    objects: DraftCanvasObject[],
    composite?: 'multiply' | 'source-over',
  ) => {
    for (const obj of objects) {
      let image: HTMLImageElement | undefined;
      if (obj.type === 'image' && obj.src) {
        try {
          image = await loadHtmlImage(obj.src);
        } catch {
          image = undefined;
        }
      }
      ctx.save();
      if (composite) ctx.globalCompositeOperation = composite;
      drawObject(ctx, obj, image);
      ctx.restore();
    }
  };

  if (!objectsOnly && templateSources.length) {
    try {
      const template = await loadHtmlImageFromSources(templateSources);
      ctx.drawImage(template, 0, 0, canvas.width, canvas.height);
    } catch {
      // blank artboard if the template image cannot load
    }
  }
  const sheetFills = fills.filter((obj) => isFullArtboardFill(obj, state.width, state.height));
  const regionFills = fills.filter((obj) => !isFullArtboardFill(obj, state.width, state.height));
  await drawList(sheetFills, objectsOnly ? 'source-over' : 'multiply');
  await drawList(regionFills);
  await drawList(content.filter((obj) => obj.type !== 'image'));
  await drawList(content.filter((obj) => obj.type === 'image'));

  return canvas.toDataURL('image/png');
}

export async function exportDraftPngs(
  state: DraftCanvasState,
  templateSrc?: string | string[] | null,
  apiUrl?: string,
): Promise<{ draft: string; canvasPreview: string }> {
  const sources = Array.isArray(templateSrc)
    ? templateSrc
    : templateSrc
      ? [templateSrc]
      : [];
  const resolved = sources.flatMap((src) => (
    src.startsWith('http') || src.startsWith('data:') || src.startsWith('blob:')
      ? [src]
      : templateImageSources({ file: { viewUrl: src } }, apiUrl)
  ));
  await waitForDraftFonts(
    state.objects
      .filter((obj) => obj.type === 'text')
      .map((obj) => obj.fontFamily || ''),
  );
  const [draft, canvasPreview] = await Promise.all([
    renderState(state, resolved, true),
    renderState(state, resolved, false),
  ]);
  return { draft, canvasPreview };
}
