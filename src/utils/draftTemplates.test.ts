import { FieldType } from './types';
import {
  blankTemplate,
  bboxToPixels,
  canvasKindForFieldType,
  defaultPlacement,
  designGroupCount,
  detachField,
  fitInside,
  inferArtworkRole,
  isTemplateVisible,
  resolveArtworkRole,
  linkedVariationsForTemplate,
  productAllowsClientDesign,
  regionsForRole,
  seedOrSyncCanvas,
  selectedOptionIdsFromVariations,
  variationCanvasContent,
  visibleTemplatesForGroup,
} from './draftTemplates';

test('productAllowsClientDesign requires both flags', () => {
  expect(productAllowsClientDesign({})).toBe(false);
  expect(productAllowsClientDesign({ needsDrafting: true })).toBe(false);
  expect(productAllowsClientDesign({ allowClientDraftContribution: true })).toBe(false);
  expect(productAllowsClientDesign({
    needsDrafting: true,
    allowClientDraftContribution: true,
  })).toBe(true);
});

test('designGroupCount is 1 without group fields', () => {
  expect(designGroupCount({}, { variationsGroups: [{}, {}] })).toBe(1);
  expect(designGroupCount(
    { groupVariationFields: [{ id: 1 }] },
    { variationsGroups: [{}, {}, {}] }
  )).toBe(3);
});

test('isTemplateVisible requires every selectedBy option', () => {
  const selected = new Set([10, 20]);
  expect(isTemplateVisible({ selectedByVariationFieldOptions: [] }, selected)).toBe(true);
  expect(isTemplateVisible(
    { selectedByVariationFieldOptions: [{ id: 10 }] },
    selected
  )).toBe(true);
  expect(isTemplateVisible(
    { selectedByVariationFieldOptions: [{ id: 10 }, { id: 20 }] },
    selected
  )).toBe(true);
  expect(isTemplateVisible(
    { selectedByVariationFieldOptions: [{ id: 10 }, { id: 30 }] },
    selected
  )).toBe(false);
});

test('visibleTemplatesForGroup uses independent and group selections', () => {
  const product = {
    draftTemplates: [
      { id: 1, selectedByVariationFieldOptions: [] },
      { id: 2, selectedByVariationFieldOptions: [{ id: 99 }] },
    ],
  };
  expect(visibleTemplatesForGroup(product, [], []).map((t: any) => t.id)).toEqual([1]);
  expect(visibleTemplatesForGroup(
    product,
    [{ value: '99' }],
    []
  ).map((t: any) => t.id)).toEqual([1, 2]);
});

test('canvasKindForFieldType maps injectable types and skips the rest', () => {
  expect(canvasKindForFieldType(FieldType.TEXT_INPUT)).toBe('text');
  expect(canvasKindForFieldType(FieldType.FILE_UPLOAD)).toBe('image');
  expect(canvasKindForFieldType(FieldType.COLOUR_PICKER)).toBe('rect');
  expect(canvasKindForFieldType(FieldType.FIELD_INSTRUCTIONS)).toBe(null);
  expect(canvasKindForFieldType(FieldType.AREA)).toBe(null);
});

test('variationCanvasContent reads text, option labels, files and colours', () => {
  expect(variationCanvasContent({
    value: 'Hello',
    variationField: { fieldType: FieldType.TEXT_INPUT },
  })).toEqual({ kind: 'text', text: 'Hello' });

  expect(variationCanvasContent({
    value: '5,6',
    selectableOptions: [
      { optionId: 5, value: 'Red' },
      { optionId: 6, value: 'Large' },
    ],
    variationField: { fieldType: FieldType.CHECKBOX },
  })).toEqual({ kind: 'text', text: 'Red, Large' });

  expect(variationCanvasContent({
    variationFiles: [{ viewUrl: 'https://cdn.example/logo.png' }],
    variationField: { fieldType: FieldType.FILE_UPLOAD },
  })).toEqual({ kind: 'image', src: 'https://cdn.example/logo.png' });

  expect(variationCanvasContent({
    value: '#ff00aa',
    variationField: { fieldType: FieldType.COLOUR_PICKER },
  })).toEqual({ kind: 'rect', fill: '#ff00aa' });
});

test('linkedVariationsForTemplate only returns editedBy fields', () => {
  const template = { editedByVariationFields: [{ id: 2 }] };
  const variations = [
    { variationField: { id: 1, fieldType: FieldType.TEXT_INPUT } },
    { variationField: { id: 2, fieldType: FieldType.TEXT_INPUT }, value: 'A' },
  ];
  expect(linkedVariationsForTemplate(template, variations)).toHaveLength(1);
  expect(linkedVariationsForTemplate({ editedByVariationFields: [] }, variations)).toHaveLength(0);
});

test('seedOrSyncCanvas places linked fields and updates content only', () => {
  const template = {
    id: 8,
    width: 1000,
    height: 1000,
    editedByVariationFields: [{ id: 1 }, { id: 2 }],
    customisationMap: {
      regions: [
        { role: 'text_placeholder', bbox: [0.1, 0.1, 0.4, 0.1] },
        { role: 'print_area', bbox: [0.2, 0.3, 0.5, 0.4] },
      ],
    },
  };
  const first = seedOrSyncCanvas(null, template, [
    { variationField: { id: 1, fieldType: FieldType.TEXT_INPUT }, value: 'Acme' },
    {
      variationField: { id: 2, fieldType: FieldType.FILE_UPLOAD },
      variationFiles: [{ viewUrl: 'https://cdn.example/a.png' }],
    },
  ]);
  expect(first.objects).toHaveLength(2);
  const text = first.objects.find((o) => o.type === 'text')!;
  expect(text.text).toBe('Acme');
  expect(text.x).toBeCloseTo(100);
  expect(text.merchiFieldId).toBe(1);
  const image = first.objects.find((o) => o.type === 'image')!;
  expect(image.src).toBe('https://cdn.example/a.png');
  expect(image.x).toBeCloseTo(200);

  text.x = 333;
  const synced = seedOrSyncCanvas(first, template, [
    { variationField: { id: 1, fieldType: FieldType.TEXT_INPUT }, value: 'Beta' },
    {
      variationField: { id: 2, fieldType: FieldType.FILE_UPLOAD },
      variationFiles: [{ viewUrl: 'https://cdn.example/a.png' }],
    },
  ]);
  const syncedText = synced.objects.find((o) => o.merchiFieldId === 1)!;
  expect(syncedText.text).toBe('Beta');
  expect(syncedText.x).toBe(333);
});

test('detachField prevents re-seeding that field', () => {
  const template = {
    width: 500,
    height: 500,
    editedByVariationFields: [{ id: 1 }],
  };
  const seeded = seedOrSyncCanvas(null, template, [
    { variationField: { id: 1, fieldType: FieldType.TEXT_INPUT }, value: 'Keep' },
  ]);
  const detached = detachField(seeded, seeded.objects[0].id);
  expect(detached.objects).toHaveLength(0);
  const again = seedOrSyncCanvas(detached, template, [
    { variationField: { id: 1, fieldType: FieldType.TEXT_INPUT }, value: 'Keep' },
  ]);
  expect(again.objects).toHaveLength(0);
});

test('regionsForRole and bboxToPixels convert fractional boxes', () => {
  expect(regionsForRole({
    regions: [
      { role: 'print_area', bbox: [0.1, 0.2, 0.3, 0.4] },
      { role: 'text_placeholder', bbox: [0, 0, 1, 1] },
    ],
  }, 'print_area')).toEqual([[0.1, 0.2, 0.3, 0.4]]);
  expect(bboxToPixels([0.1, 0.2, 0.3, 0.4], 1000, 500)).toEqual({
    x: 100,
    y: 100,
    width: 300,
    height: 200,
  });
});

test('inferArtworkRole maps colour fields to text or base', () => {
  expect(inferArtworkRole({ fieldType: FieldType.FILE_UPLOAD })).toBe('image');
  expect(inferArtworkRole({ fieldType: FieldType.TEXT_INPUT })).toBe('text');
  expect(inferArtworkRole({
    fieldType: FieldType.COLOUR_PICKER,
    name: 'Text Colour',
  })).toBe('text_fill');
  expect(inferArtworkRole({
    fieldType: FieldType.COLOUR_SELECT,
    name: 'Wristband Colour',
  })).toBe('body_colour_fill');
});

test('resolveArtworkRole keeps named base-colour fields as body fills', () => {
  expect(resolveArtworkRole({
    id: 3,
    fieldType: FieldType.COLOUR_PICKER,
    name: 'Wristband Colour',
  }, {
    customisationMap: {
      fieldBindings: [{ fieldId: 3, role: 'text_fill', targetFieldId: 1 }],
    },
  }, [{ id: 1, fieldType: FieldType.TEXT_INPUT }])).toBe('body_colour_fill');
});

test('fitInside preserves ratio inside a box', () => {
  const fitted = fitInside({ x: 0, y: 0, width: 200, height: 100 }, 100, 100, true);
  expect(fitted.width).toBe(100);
  expect(fitted.height).toBe(100);
  expect(fitted.x).toBe(50);
  expect(fitInside({ x: 0, y: 0, width: 200, height: 100 }, 100, 100, false)).toEqual({
    x: 0, y: 0, width: 200, height: 100,
  });
});

test('seedOrSyncCanvas applies a linked colour to text instead of a rect', () => {
  const template = {
    width: 1000,
    height: 1000,
    editedByVariationFields: [{ id: 1 }, { id: 2 }],
    customisationMap: {
      fieldBindings: [
        { fieldId: 1, role: 'text' },
        { fieldId: 2, role: 'text_fill', targetFieldId: 1 },
      ],
    },
  };
  const seeded = seedOrSyncCanvas(null, template, [
    { variationField: { id: 1, fieldType: FieldType.TEXT_INPUT }, value: 'Hello' },
    { variationField: { id: 2, fieldType: FieldType.COLOUR_PICKER }, value: '#ff0000' },
  ]);
  expect(seeded.objects).toHaveLength(1);
  expect(seeded.objects[0].text).toBe('Hello');
  expect(seeded.objects[0].fill).toBe('#ff0000');
});

test('seedOrSyncCanvas paints base colour even without a mapped region', () => {
  const template = {
    width: 1000,
    height: 1000,
    editedByVariationFields: [{ id: 3 }],
  };
  const variations = [
    {
      variationField: { id: 3, fieldType: FieldType.COLOUR_PICKER, name: 'Base colour' },
      value: '#00aa00',
    },
  ];
  const fallback = seedOrSyncCanvas(null, template, variations);
  expect(fallback.objects).toHaveLength(1);
  expect(fallback.objects[0].type).toBe('rect');
  expect(fallback.objects[0].fill).toBe('#00aa00');
  expect(fallback.objects[0].width).toBe(1000);
  expect(fallback.objects[0].locked).toBe(true);
  const withRegion = seedOrSyncCanvas(null, {
    ...template,
    customisationMap: {
      regions: [{ role: 'body_colour_fill', bbox: [0, 0.8, 1, 0.2] }],
    },
  }, variations);
  expect(withRegion.objects[0].y).toBeCloseTo(800);
});

test('defaultPlacement stacks text and centres images', () => {
  const image = defaultPlacement('image', 0, 1000, 1000);
  expect(image.width).toBe(600);
  const text = defaultPlacement('text', 1, 1000, 1000);
  expect(text.y).toBeGreaterThan(40);
});

test('blankTemplate uses fallback artboard size', () => {
  expect(blankTemplate().id).toBe(0);
  expect(blankTemplate().width).toBe(1000);
});

test('selectedOptionIdsFromVariations parses csv values', () => {
  expect(Array.from(selectedOptionIdsFromVariations([
    { value: '1, 2' },
    { value: '2' },
  ])).sort()).toEqual([1, 2]);
});
