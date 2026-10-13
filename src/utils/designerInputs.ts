import { productHasVariationGroups } from './draftTemplates';
import { DraftTemplateData } from './types';

const NAME_LIMIT = 80;
const DESIGN_PREFIX = '[[client-design-inputs:';
const DESIGN_SUFFIX = ']]';

export interface DesignerTextStyle {
  colour?: string;
  textSize?: number;
  font?: string;
  align?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
}

export interface DesignerInput {
  kind: 'text' | 'file';
  name: string;
  value?: string;
  src?: string;
  textStyle?: DesignerTextStyle;
  groupIndex?: number;
}

export interface CheckoutDesignInput {
  kind: 'text' | 'file';
  name: string;
  value?: string;
  file?: { id: number | string };
  textStyle?: DesignerTextStyle;
  groupIndex?: number;
}

const TEXT_BOX_NUMBERS = [
  'x',
  'y',
  'width',
  'height',
  'rotation',
  'scaleX',
  'scaleY',
] as const;

function finiteNumber(value: unknown): number | undefined {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function textStyleFromObject(obj: {
  fill?: string;
  fontSize?: number;
  fontFamily?: string;
  align?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
}): DesignerTextStyle | undefined {
  const style: DesignerTextStyle = {};
  const colour = String(obj.fill || '').trim();
  if (colour) style.colour = colour;
  const textSize = finiteNumber(obj.fontSize);
  if (textSize != null) style.textSize = textSize;
  const font = String(obj.fontFamily || '').trim();
  if (font) style.font = font;
  const align = String(obj.align || '').trim();
  if (align) style.align = align;
  for (const key of TEXT_BOX_NUMBERS) {
    const number = finiteNumber(obj[key]);
    if (number != null) style[key] = number;
  }
  return Object.keys(style).length ? style : undefined;
}

function clipName(value: string, fallback: string): string {
  const trimmed = value.replace(/\s+/g, ' ').trim();
  const name = trimmed || fallback;
  return name.length > NAME_LIMIT ? name.slice(0, NAME_LIMIT).trim() : name;
}

export function productAllowsAdditionalDesignObjects(product: any): boolean {
  return product?.allowAdditionalDesignObjects !== false;
}

export function collectDesignerInputs(
  product: any,
  drafts: DraftTemplateData[],
): DesignerInput[] {
  if (!productAllowsAdditionalDesignObjects(product)) return [];
  const grouped = productHasVariationGroups(product);
  const inputs: DesignerInput[] = [];
  for (const draft of drafts || []) {
    const groupIndex = grouped ? draft.groupIndex : undefined;
    for (const template of draft.templateData || []) {
      for (const obj of template.canvasJson?.objects || []) {
        if (obj?.merchiFieldId != null) continue;
        if (obj?.type === 'text') {
          const value = String(obj.text || '').trim();
          if (!value) continue;
          const textStyle = textStyleFromObject(obj);
          inputs.push({
            kind: 'text',
            name: clipName(value, 'Custom text'),
            value,
            ...(textStyle ? { textStyle } : {}),
            ...(groupIndex != null ? { groupIndex } : {}),
          });
        } else if (obj?.type === 'image' && obj.src) {
          inputs.push({
            kind: 'file',
            name: 'Custom image',
            src: String(obj.src),
            ...(groupIndex != null ? { groupIndex } : {}),
          });
        }
      }
    }
  }
  return inputs;
}

export function packDesignInputNotes(
  inputs: CheckoutDesignInput[],
): string | undefined {
  const payload = (inputs || [])
    .filter((item) => item.kind === 'text' || item.file?.id != null)
    .map((item) => ({
      kind: item.kind,
      name: item.name,
      ...(item.value != null ? { value: item.value } : {}),
      ...(item.textStyle ? { textStyle: item.textStyle } : {}),
      ...(item.file?.id != null ? { file: { id: item.file.id } } : {}),
      ...(item.groupIndex != null ? { groupIndex: item.groupIndex } : {}),
    }));
  if (!payload.length) return undefined;
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return `${DESIGN_PREFIX}${btoa(binary)}${DESIGN_SUFFIX}`;
}
