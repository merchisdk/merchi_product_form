import {
  completeGroupCount,
  draftStorageKey,
  isPreviewComplete,
  missingDesignSlots,
  pruneDrafts,
  requiredDesignSlots,
  savedPreview,
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
