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

test('colour extract sends colour count even when value is empty', () => {
  const colourRules: any = {
    hasGroups: false,
    fields: [{ id: 13, fieldType: 13, isSelectable: true, options: [] }],
    groupFields: [],
  };
  const values = {
    quantity: 30,
    variations: [{
      variationField: { id: 13, fieldType: 13 },
      value: '',
      selectedOptions: [{ id: 4 }, { id: 5 }, { id: 6 }],
      variationFiles: [],
    }],
  };
  expect(toSelections(values, colourRules)).toEqual({
    quantity: 30,
    fieldValues: {
      13: {
        selectedOptionIds: [4, 5, 6],
        colourCount: 3,
        hasFiles: false,
      },
    },
  });
});

test('colour extract marks an uploaded file', () => {
  const colourRules: any = {
    hasGroups: false,
    fields: [{ id: 13, fieldType: 13, isSelectable: true }],
    groupFields: [],
  };
  const values = {
    quantity: 1,
    variations: [{
      variationField: { id: 13 },
      value: '9',
      variationFiles: [{ id: 'file-1' }],
    }],
  };
  expect(toSelections(values, colourRules).fieldValues[13]).toEqual({
    selectedOptionIds: [9],
    colourCount: 1,
    hasFiles: true,
  });
});

test('area field value is passed through as a non-selectable string', () => {
  const areaRules: any = {
    hasGroups: false,
    fields: [{ id: 14, isSelectable: false, options: [] }],
    groupFields: [],
  };
  const values = {
    quantity: 1,
    variations: [
      { variationField: { id: 14, fieldType: 14 }, value: '7,4' },
    ],
  };
  expect(toSelections(values, areaRules)).toEqual({
    quantity: 1,
    fieldValues: {
      14: { value: '7,4' },
    },
  });
});

 test('accepts pricing rules without optional field collections', () => {
   expect(toSelections({ quantity: 2 }, {})).toEqual({ quantity: 2, fieldValues: {} });
 });
