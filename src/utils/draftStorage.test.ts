import {
  artworkPathKey,
  clearDrafts,
  completeGroupCount,
  draftStorageKey,
  isPreviewComplete,
  checkoutClientFiles,
  templateCheckoutJob,
  loadArtworkPath,
  loadDesignMethod,
  loadDrafts,
  loadTemplateUploads,
  missingDesignSlots,
  pruneDrafts,
  requiredDesignSlots,
  savedPreview,
  saveArtworkPath,
  saveDesignMethod,
  saveDrafts,
  saveTemplateUploads,
  upsertGroupTemplateDraft,
} from './draftStorage';
import { FieldType } from './types';

const product = {
  needsDrafting: true,
  allowClientDraftContribution: true,
  groupVariationFields: [{ id: 9 }],
  draftTemplates: [
    { id: 1, selectedByVariationFieldOptions: [], editedByVariationFields: [] },
  ],
};

test('draftStorageKey is per product', () => {
  expect(draftStorageKey(44)).toBe('productDraftTemplate-44');
});

test('clearDrafts removes saved artwork for a product', () => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  saveDrafts(44, [{ groupIndex: 0, productId: 44, templateData: [], previews: [] }]);
  expect(loadDrafts(44)).toHaveLength(1);
  clearDrafts(44);
  expect(loadDrafts(44)).toEqual([]);
});

test('artwork path defaults to self and can switch to the free design service', () => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  window.localStorage.removeItem(artworkPathKey(44));
  expect(loadArtworkPath(44)).toBe('self');
  saveArtworkPath(44, 'service');
  expect(loadArtworkPath(44)).toBe('service');
  saveArtworkPath(44, 'self');
  expect(loadArtworkPath(44)).toBe('self');
});

test('template uploads are remembered and shaped for checkout', () => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  expect(loadDesignMethod(44)).toBe('designer');
  saveDesignMethod(44, 'templates');
  expect(loadDesignMethod(44)).toBe('templates');
  saveTemplateUploads(44, [{ id: 9, name: 'front.png', viewUrl: 'https://cdn.example/front.png' }]);
  expect(loadTemplateUploads(44)).toEqual([
    { id: 9, name: 'front.png', viewUrl: 'https://cdn.example/front.png' },
  ]);
  expect(checkoutClientFiles(loadTemplateUploads(44))).toEqual([
    { file: { id: 9 }, objectId: '9' },
  ]);
  const quoted = { quantity: 100, ownDrafts: [] as unknown[] };
  const withUpload = templateCheckoutJob(quoted, loadTemplateUploads(44));
  expect(withUpload.clientFiles).toEqual([{ file: { id: 9 }, objectId: '9' }]);
  expect(withUpload.ownDrafts).toEqual([
    { accepted: expect.any(Number), images: [{ id: 9 }] },
  ]);
  const withoutUpload = templateCheckoutJob(quoted, []);
  expect(withoutUpload.clientFiles).toEqual([]);
  expect(withoutUpload.ownDrafts).toBeUndefined();
  saveTemplateUploads(44, []);
  saveDesignMethod(44, 'designer');
});

test('upsert and prune keep per-group template drafts', () => {
  let drafts = upsertGroupTemplateDraft([], 44, 0, {
    templateId: 1,
    draft: 'data:a',
    canvasPreview: 'data:b',
  });
  drafts = upsertGroupTemplateDraft(drafts, 44, 1, {
    templateId: 1,
    draft: 'data:c',
    canvasPreview: 'data:d',
  });
  expect(drafts).toHaveLength(2);
  expect(savedPreview(drafts, 1, 1)?.draft).toBe('data:c');
  expect(pruneDrafts(drafts, 1)).toHaveLength(1);
});

test('missingDesignSlots reports unsaved group templates', () => {
  const formValues = {
    variations: [],
    variationsGroups: [{ variations: [] }, { variations: [] }],
  };
  expect(requiredDesignSlots(product, formValues)).toHaveLength(2);
  expect(missingDesignSlots(product, formValues, [])).toHaveLength(2);
  const saved = upsertGroupTemplateDraft([], 1, 0, {
    templateId: 1,
    draft: 'x',
    canvasPreview: 'y',
  });
  expect(missingDesignSlots(product, formValues, saved)).toHaveLength(1);
  expect(completeGroupCount(product, formValues, saved)).toEqual({
    complete: 1,
    total: 2,
  });
});

test('isPreviewComplete requires both pngs', () => {
  expect(isPreviewComplete({ templateId: 1, draft: '', canvasPreview: 'a' })).toBe(false);
  expect(isPreviewComplete({ templateId: 1, draft: 'a', canvasPreview: 'b' })).toBe(true);
});

test('gated templates drop out of required slots', () => {
  const gated = {
    ...product,
    draftTemplates: [{
      id: 2,
      selectedByVariationFieldOptions: [{ id: 77 }],
      editedByVariationFields: [{ id: 3, fieldType: FieldType.TEXT_INPUT }],
    }],
  };
  const hidden = missingDesignSlots(gated, {
    variations: [],
    variationsGroups: [{ variations: [] }],
  }, []);
  expect(hidden[0].template.id).toBe(0);
  const shown = missingDesignSlots(gated, {
    variations: [{ value: '77' }],
    variationsGroups: [{ variations: [] }],
  }, []);
  expect(shown[0].template.id).toBe(2);
});
