import {
  BLANK_TEMPLATE_ID,
  DEFAULT_ARTBOARD,
  DraftCanvasObject,
  DraftCanvasObjectType,
  DraftCanvasState,
  FieldType,
} from './types';

export function productAllowsClientDesign(product: any): boolean {
  return Boolean(product?.needsDrafting && product?.allowClientDraftContribution);
}

export function productHasVariationGroups(product: any): boolean {
  return Array.isArray(product?.groupVariationFields)
    && product.groupVariationFields.length > 0;
}

export function designGroupCount(product: any, formValues: any): number {
  if (!productHasVariationGroups(product)) return 1;
  const groups = formValues?.variationsGroups;
  return Array.isArray(groups) && groups.length > 0 ? groups.length : 1;
}

export function parseSelectedOptionIds(value: any): number[] {
  if (value === undefined || value === null || value === '') return [];
  return String(value)
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n));
}

export function selectedOptionIdsFromVariations(variations: any[]): Set<number> {
  const ids = new Set<number>();
  for (const variation of variations || []) {
    for (const id of parseSelectedOptionIds(variation?.value)) {
      ids.add(id);
    }
  }
  return ids;
}

export function isTemplateVisible(
  template: any,
  selectedOptionIds: Set<number>,
): boolean {
  const required = template?.selectedByVariationFieldOptions;
  if (!Array.isArray(required) || required.length === 0) return true;
  return required.every((opt: any) => opt?.id && selectedOptionIds.has(opt.id));
}

export function visibleTemplatesForGroup(
  product: any,
  independentVariations: any[],
  groupVariations: any[],
): any[] {
  const selected = selectedOptionIdsFromVariations([
    ...(independentVariations || []),
    ...(groupVariations || []),
  ]);
  return (product?.draftTemplates || []).filter((template: any) =>
    isTemplateVisible(template, selected)
  );
}

export function blankTemplate(product?: any) {
  const fromProduct = Number(product?.draftTemplates?.[0]?.width)
    || Number(product?.featureImage?.width)
    || DEFAULT_ARTBOARD.width;
  const height = Number(product?.draftTemplates?.[0]?.height)
    || Number(product?.featureImage?.height)
    || DEFAULT_ARTBOARD.height;
  return {
    id: BLANK_TEMPLATE_ID,
    name: 'Artwork',
    width: fromProduct,
    height,
    file: null,
    editedByVariationFields: [],
    selectedByVariationFieldOptions: [],
  };
}

export function templatesForGroup(
  product: any,
  independentVariations: any[],
  groupVariations: any[],
): any[] {
  const visible = visibleTemplatesForGroup(
    product,
    independentVariations,
    groupVariations,
  );
  return visible.length ? visible : [blankTemplate(product)];
}

export function canvasKindForFieldType(
  fieldType: any,
): DraftCanvasObjectType | null {
  switch (parseInt(String(fieldType), 10)) {
    case FieldType.TEXT_INPUT:
    case FieldType.TEXT_AREA:
    case FieldType.NUMBER_INPUT:
    case FieldType.SELECT:
    case FieldType.RADIO:
    case FieldType.CHECKBOX:
      return 'text';
    case FieldType.FILE_UPLOAD:
    case FieldType.IMAGE_SELECT:
      return 'image';
    case FieldType.COLOUR_PICKER:
    case FieldType.COLOUR_SELECT:
    case FieldType.COLOUR_EXTRACT:
      return 'rect';
    default:
      return null;
  }
}

function optionById(variation: any, id: number): any | undefined {
  const fromSelectable = (variation?.selectableOptions || []).find(
    (option: any) => option.optionId === id || option.id === id
  );
  if (fromSelectable) return fromSelectable;
  return (variation?.variationField?.options || []).find(
    (option: any) => option.id === id || option.optionId === id
  );
}

export function variationCanvasContent(variation: any): {
  kind: DraftCanvasObjectType | null;
  text?: string;
  src?: string;
  fill?: string;
} {
  const field = variation?.variationField;
  const kind = canvasKindForFieldType(field?.fieldType);
  if (!kind) return { kind: null };

  const type = parseInt(String(field.fieldType), 10);

  if (kind === 'text') {
    if (
      type === FieldType.SELECT
      || type === FieldType.RADIO
      || type === FieldType.CHECKBOX
    ) {
      const names = parseSelectedOptionIds(variation.value)
        .map((id) => optionById(variation, id)?.value)
        .filter(Boolean);
      return { kind, text: names.join(', ') };
    }
    return {
      kind,
      text: variation?.value != null && variation.value !== ''
        ? String(variation.value)
        : '',
    };
  }

  if (kind === 'image') {
    if (type === FieldType.FILE_UPLOAD) {
      const file = (variation?.variationFiles || [])[0];
      return {
        kind,
        src: file?.viewUrl || file?.cachedViewUrl || '',
      };
    }
    const ids = parseSelectedOptionIds(variation.value);
    const option = ids.length ? optionById(variation, ids[0]) : null;
    const file = option?.linkedFile;
    return { kind, src: file?.viewUrl || file?.cachedViewUrl || '' };
  }

  if (type === FieldType.COLOUR_PICKER) {
    return { kind, fill: variation?.value || '#000000' };
  }
  const ids = parseSelectedOptionIds(variation.value);
  const option = ids.length ? optionById(variation, ids[0]) : null;
  return {
    kind,
    fill: option?.colour || option?.value || variation?.value || '#000000',
  };
}

export function linkedVariationsForTemplate(
  template: any,
  variations: any[],
): any[] {
  const linkedIds = new Set(
    (template?.editedByVariationFields || [])
      .map((field: any) => field?.id)
      .filter((id: any) => id != null)
  );
  if (!linkedIds.size) return [];
  return (variations || []).filter((variation) =>
    linkedIds.has(variation?.variationField?.id)
  );
}

export function variationsForGroup(
  formValues: any,
  groupIndex: number,
): any[] {
  const independent = formValues?.variations || [];
  const group = formValues?.variationsGroups?.[groupIndex]?.variations || [];
  return [...independent, ...group];
}

function isValidBbox(bbox: any): bbox is number[] {
  if (!Array.isArray(bbox) || bbox.length !== 4) return false;
  const [x, y, w, h] = bbox.map(Number);
  return w > 0 && h > 0 && x >= 0 && x <= 1 && y >= 0 && y <= 1;
}

export function regionsForRole(customisationMap: any, role: string): number[][] {
  const regions = customisationMap?.regions;
  if (!Array.isArray(regions)) return [];
  return regions
    .filter((region: any) => region?.role === role && isValidBbox(region.bbox))
    .map((region: any) => region.bbox.map(Number));
}

export function bboxToPixels(
  bbox: number[],
  width: number,
  height: number,
): { x: number; y: number; width: number; height: number } {
  const [x, y, w, h] = bbox;
  return {
    x: x * width,
    y: y * height,
    width: w * width,
    height: h * height,
  };
}

export function defaultPlacement(
  kind: DraftCanvasObjectType,
  index: number,
  artWidth: number,
  artHeight: number,
): { x: number; y: number; width: number; height: number } {
  const pad = Math.max(24, artWidth * 0.04);
  if (kind === 'image') {
    return {
      x: artWidth * 0.2,
      y: artHeight * 0.2,
      width: artWidth * 0.6,
      height: artHeight * 0.6,
    };
  }
  if (kind === 'rect') {
    return { x: 0, y: 0, width: artWidth, height: artHeight };
  }
  return {
    x: pad,
    y: pad + index * Math.max(64, artHeight * 0.08),
    width: artWidth - pad * 2,
    height: Math.max(56, artHeight * 0.07),
  };
}

export function createObjectId(): string {
  return `obj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const ROLE_FOR_KIND: Record<DraftCanvasObjectType, string> = {
  image: 'print_area',
  text: 'text_placeholder',
  rect: 'body_colour_fill',
};

export function seedOrSyncCanvas(
  existing: DraftCanvasState | null | undefined,
  template: any,
  variations: any[],
): DraftCanvasState {
  const width = Number(template?.width) || DEFAULT_ARTBOARD.width;
  const height = Number(template?.height) || DEFAULT_ARTBOARD.height;
  const objects: DraftCanvasObject[] = (existing?.objects || []).map((obj) => ({
    ...obj,
  }));
  const detached = new Set(existing?.detachedFieldIds || []);
  const linked = linkedVariationsForTemplate(template, variations);
  const usedRegions: Record<string, number> = {};

  for (const variation of linked) {
    const fieldId = variation?.variationField?.id;
    const content = variationCanvasContent(variation);
    if (!content.kind || fieldId == null || detached.has(fieldId)) continue;

    const found = objects.find((obj) => obj.merchiFieldId === fieldId);
    if (found) {
      if (content.kind === 'text' && content.text != null) found.text = content.text;
      if (content.kind === 'image' && content.src) found.src = content.src;
      if (content.kind === 'rect' && content.fill) found.fill = content.fill;
      continue;
    }

    if (content.kind === 'text' && !content.text) continue;
    if (content.kind === 'image' && !content.src) continue;

    const role = ROLE_FOR_KIND[content.kind];
    const boxes = regionsForRole(template?.customisationMap, role);
    const regionIndex = usedRegions[role] || 0;
    usedRegions[role] = regionIndex + 1;
    const box = boxes[regionIndex] || boxes[0];
    const place = box
      ? bboxToPixels(box, width, height)
      : defaultPlacement(content.kind, objects.length, width, height);

    const next: DraftCanvasObject = {
      id: createObjectId(),
      type: content.kind,
      merchiFieldId: fieldId,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      ...place,
      text: content.text,
      src: content.src,
      fill: content.fill || (content.kind === 'text' ? '#111111' : undefined),
      fontSize: Math.max(24, Math.round(place.height * 0.55)),
    };

    if (content.kind === 'rect') objects.unshift(next);
    else objects.push(next);
  }

  return {
    width,
    height,
    objects,
    detachedFieldIds: Array.from(detached),
  };
}

export function detachField(
  state: DraftCanvasState,
  objectId: string,
): DraftCanvasState {
  const target = state.objects.find((obj) => obj.id === objectId);
  const detachedFieldIds = [...(state.detachedFieldIds || [])];
  if (target?.merchiFieldId != null && !detachedFieldIds.includes(target.merchiFieldId)) {
    detachedFieldIds.push(target.merchiFieldId);
  }
  return {
    ...state,
    objects: state.objects.filter((obj) => obj.id !== objectId),
    detachedFieldIds,
  };
}

export function printAreaGuides(template: any): Array<{
  x: number;
  y: number;
  width: number;
  height: number;
}> {
  const width = Number(template?.width) || DEFAULT_ARTBOARD.width;
  const height = Number(template?.height) || DEFAULT_ARTBOARD.height;
  return regionsForRole(template?.customisationMap, 'print_area').map((bbox) =>
    bboxToPixels(bbox, width, height)
  );
}
