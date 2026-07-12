import { cleanFormVariationJson } from './cleanFormVariationJson';

test('keeps live variationField when hidden json snapshot is incomplete', () => {
  const cleaned = cleanFormVariationJson({
    value: '200',
    json: JSON.stringify({ value: '100', selectableOptions: [] }),
    variationField: { id: 9, name: 'Lanyard clip', fieldType: 6 },
    selectableOptions: [{ optionId: 200, value: 'Trigger Clip' }],
  });

  expect(cleaned.variationField).toEqual({
    id: 9,
    name: 'Lanyard clip',
    fieldType: 6,
  });
  expect(cleaned.selectableOptions).toEqual([
    { optionId: 200, value: 'Trigger Clip' },
  ]);
  expect(cleaned.value).toBe('200');
  expect(cleaned.json).toBeUndefined();
});

test('falls back to json snapshot when live metadata is missing', () => {
  const cleaned = cleanFormVariationJson({
    value: '200',
    json: JSON.stringify({
      value: '100',
      variationField: { id: 9, fieldType: 6 },
      selectableOptions: [{ optionId: 200 }],
    }),
  });

  expect(cleaned.variationField).toEqual({ id: 9, fieldType: 6 });
  expect(cleaned.selectableOptions).toEqual([{ optionId: 200 }]);
  expect(cleaned.value).toBe('200');
});
