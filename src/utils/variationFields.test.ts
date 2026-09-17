import {
  liftIndependentVariationsFromGroups,
  sanitizeProductVariationFields,
} from './variationFields';
import {
  needsProductLevelQuantity,
  productHasGroupRows,
  productHasGroups,
} from './products';

const dateRequired = {
  id: 356203,
  independent: true,
  name: 'Date required',
};
const notes = {
  id: 219073,
  independent: true,
  name: 'Notes / Comments',
};
const colour = {
  id: 219076,
  independent: false,
  name: 'Lanyard colour (CMYK)',
};
const message = {
  id: 219075,
  independent: false,
  name: 'Enter your custom lanyard message',
};

test('sanitizeProductVariationFields moves independent fields out of the group list', () => {
  const product = sanitizeProductVariationFields({
    groupVariationFields: [colour, dateRequired, notes, message],
    independentVariationFields: [dateRequired, notes],
  });

  expect(product.groupVariationFields.map((field: any) => field.id)).toEqual([
    219076,
    219075,
  ]);
  expect(product.independentVariationFields.map((field: any) => field.id)).toEqual([
    356203,
    219073,
  ]);
});

test('sanitizeProductVariationFields recovers independent fields missing from that array', () => {
  const product = sanitizeProductVariationFields({
    groupVariationFields: [colour, dateRequired, message],
    independentVariationFields: [],
  });

  expect(product.groupVariationFields.map((field: any) => field.id)).toEqual([
    219076,
    219075,
  ]);
  expect(product.independentVariationFields.map((field: any) => field.id)).toEqual([
    356203,
  ]);
});

test('productHasGroups ignores independent fields parked in the group list', () => {
  expect(productHasGroups({ groupVariationFields: [dateRequired, notes] })).toBe(false);
  expect(productHasGroups({ groupVariationFields: [colour, dateRequired] })).toBe(true);
  expect(productHasGroups({ groupVariationFields: [] })).toBe(false);
  expect(productHasGroups({})).toBe(false);
});

test('needsProductLevelQuantity shows a product qty when groups never materialise', () => {
  expect(productHasGroupRows({ variationsGroups: [] })).toBe(false);
  expect(needsProductLevelQuantity({ groupVariationFields: [] }, {})).toBe(true);
  expect(
    needsProductLevelQuantity(
      { groupVariationFields: [colour] },
      { variationsGroups: [] }
    )
  ).toBe(true);
  expect(
    needsProductLevelQuantity(
      { groupVariationFields: [colour] },
      { variationsGroups: [{ quantity: 10, variations: [] }] }
    )
  ).toBe(false);
});

test('liftIndependentVariationsFromGroups moves whole-order rows to job.variations', () => {
  const job = liftIndependentVariationsFromGroups(
    {
      variations: [],
      variationsGroups: [
        {
          quantity: 120,
          variations: [
            { value: '#ffffff', variationField: colour },
            { value: '991905', variationField: dateRequired },
            { value: 'hello', variationField: message },
          ],
        },
      ],
    },
    {
      groupVariationFields: [colour, dateRequired, message],
      independentVariationFields: [dateRequired],
    }
  );

  expect(job.variations).toEqual([
    { value: '991905', variationField: dateRequired },
  ]);
  expect(job.variationsGroups[0].variations.map((v: any) => v.variationField.id)).toEqual([
    219076,
    219075,
  ]);
});
