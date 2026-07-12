import { toSelections } from './selections';

const rules: any = {
  hasGroups: false,
  fields: [
    { id: 1, isSelectable: true, options: [] },
    { id: 2, isSelectable: false, options: [] },
  ],
  groupFields: [],
};

test('parses comma-joined option ids for selectable fields', () => {
  const values = {
    quantity: 10,
    variations: [
      { variationField: { id: 1 }, value: '101,102' },
      { variationField: { id: 2 }, value: 'hello' },
    ],
  };
  expect(toSelections(values, rules)).toEqual({
    quantity: 10,
    fieldValues: {
      1: { selectedOptionIds: [101, 102] },
      2: { value: 'hello' },
    },
  });
});

test('reads per-group quantities and variations', () => {
  const groupRules: any = {
    hasGroups: true,
    fields: [],
    groupFields: [{ id: 5, isSelectable: true, options: [] }],
  };
  const values = {
    variations: [],
    variationsGroups: [
      { quantity: 3, variations: [{ variationField: { id: 5 }, value: '501' }] },
    ],
  };
  expect(toSelections(values, groupRules)).toEqual({
    fieldValues: {},
    groups: [{ quantity: 3, fieldValues: { 5: { selectedOptionIds: [501] } } }],
  });
});

test('coerces string quantities from form inputs to numbers', () => {
  const groupRules: any = {
    hasGroups: true,
    fields: [],
    groupFields: [],
  };
  const values = {
    variations: [],
    variationsGroups: [
      { quantity: '100', variations: [] },
      { quantity: '1', variations: [] },
    ],
  };
  expect(toSelections(values, groupRules)).toEqual({
    fieldValues: {},
    groups: [
      { quantity: 100, fieldValues: {} },
      { quantity: 1, fieldValues: {} },
    ],
  });
});

test('empty/absent values produce empty selections', () => {
  const values = { quantity: 0, variations: [{ variationField: { id: 1 }, value: '' }] };
  expect(toSelections(values, rules)).toEqual({
    quantity: 0,
    fieldValues: { 1: { selectedOptionIds: [] } },
  });
});
