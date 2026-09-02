import {
  DraftTemplateData,
  RenderedDraftPreview,
} from './types';
import {
  designGroupCount,
  templatesForGroup,
} from './draftTemplates';

export function draftStorageKey(productId: number | string): string {
  return `productDraftTemplate-${productId}`;
}

export function loadDrafts(productId: number | string): DraftTemplateData[] {
  if (typeof window === 'undefined' || productId == null) return [];
  try {
    const raw = window.localStorage.getItem(draftStorageKey(productId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveDrafts(
  productId: number | string,
  drafts: DraftTemplateData[],
): void {
  if (typeof window === 'undefined' || productId == null) return;
  window.localStorage.setItem(draftStorageKey(productId), JSON.stringify(drafts));
}

export function clearDrafts(productId: number | string): void {
  if (typeof window === 'undefined' || productId == null) return;
  window.localStorage.removeItem(draftStorageKey(productId));
}

export type ArtworkPath = 'self' | 'service';

export function artworkPathKey(productId: number | string): string {
  return `productArtworkPath-${productId}`;
}

export function loadArtworkPath(productId: number | string): ArtworkPath {
  if (typeof window === 'undefined' || productId == null) return 'self';
  try {
    return window.localStorage.getItem(artworkPathKey(productId)) === 'service'
      ? 'service'
      : 'self';
  } catch {
    return 'self';
  }
}

export function saveArtworkPath(
  productId: number | string,
  path: ArtworkPath,
): void {
  if (typeof window === 'undefined' || productId == null) return;
  window.localStorage.setItem(artworkPathKey(productId), path);
}

export function pruneDrafts(
  drafts: DraftTemplateData[],
  groupCount: number,
): DraftTemplateData[] {
  return (drafts || []).filter((draft) => draft.groupIndex < groupCount);
}

export function savedPreview(
  drafts: DraftTemplateData[],
  groupIndex: number,
  templateId: number,
): RenderedDraftPreview | undefined {
  const group = (drafts || []).find((draft) => draft.groupIndex === groupIndex);
  return (group?.templateData || []).find(
    (item) => item.templateId === templateId
  );
}

export function isPreviewComplete(preview?: RenderedDraftPreview | null): boolean {
  return Boolean(preview?.draft && preview?.canvasPreview);
}

export function upsertGroupTemplateDraft(
  drafts: DraftTemplateData[],
  productId: number,
  groupIndex: number,
  preview: RenderedDraftPreview,
): DraftTemplateData[] {
  const next = (drafts || []).map((draft) => ({
    ...draft,
    templateData: [...(draft.templateData || [])],
    previews: [...(draft.previews || [])],
  }));
  let group = next.find((draft) => draft.groupIndex === groupIndex);
  if (!group) {
    group = { groupIndex, productId, templateData: [], previews: [] };
    next.push(group);
  }
  const index = group.templateData.findIndex(
    (item) => item.templateId === preview.templateId
  );
  if (index >= 0) group.templateData[index] = preview;
  else group.templateData.push(preview);
  return next;
}

export function requiredDesignSlots(product: any, formValues: any) {
  const count = designGroupCount(product, formValues);
  const independent = formValues?.variations || [];
  const groups = formValues?.variationsGroups || [];
  const slots: { groupIndex: number; template: any }[] = [];
  for (let groupIndex = 0; groupIndex < count; groupIndex += 1) {
    const groupVars = groups[groupIndex]?.variations || [];
    for (const template of templatesForGroup(product, independent, groupVars)) {
      slots.push({ groupIndex, template });
    }
  }
  return slots;
}

export function missingDesignSlots(
  product: any,
  formValues: any,
  drafts: DraftTemplateData[],
) {
  const pruned = pruneDrafts(drafts, designGroupCount(product, formValues));
  return requiredDesignSlots(product, formValues).filter(
    ({ groupIndex, template }) =>
      !isPreviewComplete(savedPreview(pruned, groupIndex, template.id))
  );
}

export function completeGroupCount(product: any, formValues: any, drafts: DraftTemplateData[]) {
  const count = designGroupCount(product, formValues);
  const independent = formValues?.variations || [];
  const groups = formValues?.variationsGroups || [];
  let complete = 0;
  for (let groupIndex = 0; groupIndex < count; groupIndex += 1) {
    const templates = templatesForGroup(
      product,
      independent,
      groups[groupIndex]?.variations || [],
    );
    const allSaved = templates.every((template: any) =>
      isPreviewComplete(savedPreview(drafts, groupIndex, template.id))
    );
    if (allSaved) complete += 1;
  }
  return { complete, total: count };
}
