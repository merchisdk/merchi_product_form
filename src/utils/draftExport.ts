import { DraftCanvasObject, DraftCanvasState } from './types';

function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

function drawObject(
  ctx: CanvasRenderingContext2D,
  obj: DraftCanvasObject,
  image?: HTMLImageElement,
) {
  ctx.save();
  const cx = obj.x + obj.width / 2;
  const cy = obj.y + obj.height / 2;
  ctx.translate(cx, cy);
  ctx.rotate(((obj.rotation || 0) * Math.PI) / 180);
  ctx.scale(obj.scaleX || 1, obj.scaleY || 1);
  ctx.translate(-obj.width / 2, -obj.height / 2);

  if (obj.type === 'rect') {
    ctx.fillStyle = obj.fill || '#cccccc';
    ctx.fillRect(0, 0, obj.width, obj.height);
  } else if (obj.type === 'text') {
    ctx.fillStyle = obj.fill || '#111111';
    ctx.font = `${obj.fontSize || 48}px ${obj.fontFamily || 'sans-serif'}`;
    ctx.textBaseline = 'top';
    ctx.textAlign = (obj.align as CanvasTextAlign) || 'left';
    wrapText(ctx, obj.text || '', 0, 0, obj.width, (obj.fontSize || 48) * 1.2);
  } else if (obj.type === 'image' && image) {
    ctx.drawImage(image, 0, 0, obj.width, obj.height);
  }
  ctx.restore();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = String(text).split(/\s+/);
  let line = '';
  let cursorY = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY, maxWidth);
      line = word;
      cursorY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cursorY, maxWidth);
}

async function renderState(
  state: DraftCanvasState,
  templateSrc?: string | null,
  objectsOnly = false,
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(state.width));
  canvas.height = Math.max(1, Math.round(state.height));
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  if (!objectsOnly) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (templateSrc) {
      try {
        const template = await loadHtmlImage(templateSrc);
        ctx.drawImage(template, 0, 0, canvas.width, canvas.height);
      } catch {
        // blank artboard if the template image cannot load
      }
    }
  }

  for (const obj of state.objects) {
    let image: HTMLImageElement | undefined;
    if (obj.type === 'image' && obj.src) {
      try {
        image = await loadHtmlImage(obj.src);
      } catch {
        image = undefined;
      }
    }
    drawObject(ctx, obj, image);
  }

  return canvas.toDataURL('image/png');
}

export async function exportDraftPngs(
  state: DraftCanvasState,
  templateSrc?: string | null,
): Promise<{ draft: string; canvasPreview: string }> {
  const [draft, canvasPreview] = await Promise.all([
    renderState(state, templateSrc, true),
    renderState(state, templateSrc, false),
  ]);
  return { draft, canvasPreview };
}
