import {
  buildDesiredVariationsFromFields,
  reconcileVariations,
  syncOptionVisibilityById,
  variationFieldId,
} from './reconcileVariations';

test('variationFieldId reads nested id', () => {
  expect(variationFieldId({ variationField: { id: 12 } })).toBe(12);
  expect(variationFieldId({})).toBeNull();
});

test('syncOptionVisibilityById matches by optionId not index', () => {
  const current = [
    { optionId: 10, isVisible: true, available: true },
    { optionId: 20, isVisible: true, available: true },
  ];
  const source = [
    { optionId: 20, isVisible: false, available: false },
    { optionId: 10, isVisible: true, available: true },
  ];
  expect(syncOptionVisibilityById(current, source)).toBe(true);
  expect(current[0]).toMatchObject({ optionId: 10, isVisible: true, available: true });
  expect(current[1]).toMatchObject({
    optionId: 20,
    isVisible: false,
    available: false,
  });
});

test('reconcileVariations adds newly visible conditional fields', () => {
  const current = [
    {
      value: '1',
      variationField: { id: 1, name: 'Size', fieldType: 6, selectedBy: [] },
      selectableOptions: [{ optionId: 1, isVisible: true }],
    },
  ];
  const desired = [
    {
      value: '1',
      variationField: { id: 1, name: 'Size', fieldType: 6 },
      selectableOptions: [{ optionId: 1, isVisible: true }],
      unitCost: 2,
    },
    {
      value: '9',
      variationField: { id: 2, name: 'Gated', fieldType: 6 },
      selectableOptions: [{ optionId: 9, isVisible: true }],
    },
  ];

  const { variations, membershipChanged, visibilityChanged } =
    reconcileVariations(current, desired);

  expect(membershipChanged).toBe(true);
  expect(visibilityChanged).toBe(true);
  expect(variations).toHaveLength(2);
  expect(variations[0].value).toBe('1');
  expect(variations[0].unitCost).toBe(2);
  // Preserve selectedBy from the form when the desired embed omits it.
  expect(variations[0].variationField.selectedBy).toEqual([]);
  expect(variations[1].variationField.id).toBe(2);
});

test('reconcileVariations removes fields that are no longer visible', () => {
  const current = [
    { value: '1', variationField: { id: 1, fieldType: 6 } },
    { value: '9', variationField: { id: 2, fieldType: 6 } },
  ];
  const desired = [{ value: '1', variationField: { id: 1, fieldType: 6 } }];
  const { variations, membershipChanged } = reconcileVariations(current, desired);
  expect(membershipChanged).toBe(true);
  expect(variations.map((v) => v.variationField.id)).toEqual([1]);
});

test('reconcileVariations detects option visibility changes without membership change', () => {
  const current = [
    {
      value: '1',
      variationField: { id: 1, fieldType: 6 },
      selectableOptions: [{ optionId: 1, isVisible: true, available: true }],
    },
  ];
  const desired = [
    {
      value: '1',
      variationField: { id: 1, fieldType: 6 },
      selectableOptions: [{ optionId: 1, isVisible: false, available: true }],
    },
  ];
  const { membershipChanged, visibilityChanged, variations } =
    reconcileVariations(current, desired);
  expect(membershipChanged).toBe(false);
  expect(visibilityChanged).toBe(true);
  expect(variations[0].selectableOptions[0].isVisible).toBe(false);
});

test('buildDesiredVariationsFromFields keeps current values and builds missing', () => {
  const current = [
    { value: 'picked', variationField: { id: 1, position: 0 } },
  ];
  const fields = [
    { id: 2, position: 1, name: 'Gated' },
    { id: 1, position: 0, name: 'Always' },
  ];
  const desired = buildDesiredVariationsFromFields(
    current,
    fields,
    new Set([1, 2]),
    (field) => ({ value: 'default', variationField: field })
  );
  expect(desired).toHaveLength(2);
  expect(desired[0].value).toBe('picked');
  expect(desired[1].variationField.id).toBe(2);
  expect(desired[1].value).toBe('default');
});

test('buildDesiredVariationsFromFields omits fields not in the visible set', () => {
  const fields = [
    { id: 1, position: 0 },
    { id: 2, position: 1 },
  ];
  const desired = buildDesiredVariationsFromFields(
    [],
    fields,
    new Set([1]),
    (field) => ({ variationField: field })
  );
  expect(desired.map((v) => v.variationField.id)).toEqual([1]);
});

test('buildDesiredVariationsFromFields keeps current when product fields missing', () => {
  const current = [{ value: 'x', variationField: { id: 1 } }];
  expect(
    buildDesiredVariationsFromFields(current, undefined, new Set([1]), () => ({}))
  ).toBe(current);
  expect(
    buildDesiredVariationsFromFields(current, [], new Set([1]), () => ({}))
  ).toBe(current);
});
