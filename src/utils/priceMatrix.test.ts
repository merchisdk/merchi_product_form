import {
  activeBandIndex,
  currentOrderQuantity,
  matrixVariationKey,
  pricingRulesFromProduct,
  resolvePriceMatrix,
  resolvePricingRules,
  volumetricDiscountPercent,
} from './priceMatrix';

test('pricingRulesFromProduct maps unit-price discount groups', () => {
  const rules = pricingRulesFromProduct({
    currency: 'USD',
    unitPrice: 12,
    minimumPrice: 0,
    setupPrice: 5,
    setupPerGroup: true,
    taxType: { taxPercent: 10 },
    unitPriceDiscountGroup: {
      groupRestricted: true,
      discounts: [
        { lowerLimit: 50, amount: 10 },
        { lowerLimit: 'nope', amount: 5 },
      ],
    },
  });
  expect(rules).toMatchObject({
    currency: 'USD',
    taxPercent: 10,
    product: {
      unitPrice: 12,
      minimumPrice: 0,
      setupPrice: 5,
      setupPerGroup: true,
      discountGroup: {
        groupRestricted: true,
        discounts: [{ lowerLimit: 50, amount: 10 }],
      },
    },
  });
});

test('pricingRulesFromProduct falls back to discountGroup and defaults', () => {
  expect(pricingRulesFromProduct({})).toBeNull();
  expect(
    pricingRulesFromProduct({
      discountGroup: { discounts: [{ lowerLimit: 10, amount: 5 }] },
    })
  ).toMatchObject({
    currency: 'AUD',
    taxPercent: 0,
    product: { unitPrice: 0, minimumPrice: null, setupPrice: 0 },
  });
});

test('resolvePricingRules prefers a live bundle', () => {
  const live = { currency: 'NZD', product: { unitPrice: 1 } };
  expect(resolvePricingRules(live, {})).toBe(live);
  expect(resolvePricingRules({ unsupported: 'group_buy' }, {})).toBeNull();
  expect(
    resolvePricingRules(null, {
      unitPriceDiscountGroup: { discounts: [{ lowerLimit: 5, amount: 1 }] },
    })?.currency
  ).toBe('AUD');
});

test('currentOrderQuantity sums groups or reads job.quantity', () => {
  expect(
    currentOrderQuantity(
      { variationsGroups: [{ quantity: 4 }, { quantity: '6' }, { quantity: 'x' }] },
      { groupVariationFields: [{ id: 1 }] }
    )
  ).toBe(10);
  expect(currentOrderQuantity({ quantity: 7 }, {})).toBe(7);
  expect(currentOrderQuantity({}, {})).toBe(0);
});

test('activeBandIndex highlights the highest matching break', () => {
  const matrix = {
    currency: 'AUD',
    taxPercent: 0,
    bands: [
      { quantity: 1, upperLimit: 49, label: '1–49' },
      { quantity: 50, upperLimit: null, label: '50+' },
    ],
    cells: [],
  };
  expect(activeBandIndex(matrix, 0)).toBe(-1);
  expect(activeBandIndex(matrix, 1)).toBe(0);
  expect(activeBandIndex(matrix, 49)).toBe(0);
  expect(activeBandIndex(matrix, 50)).toBe(1);
  expect(activeBandIndex({ ...matrix, bands: [] }, 10)).toBe(-1);
});

test('resolvePriceMatrix returns a provided matrix', () => {
  const matrix = {
    currency: 'AUD',
    taxPercent: 10,
    bands: [{ quantity: 1, upperLimit: null, label: '1+' }],
    cells: [],
  };
  expect(resolvePriceMatrix({ matrix })).toBe(matrix);
});

test('resolvePriceMatrix builds from a product discount group', () => {
  const matrix = resolvePriceMatrix({
    product: {
      currency: 'AUD',
      unitPrice: 10,
      unitPriceDiscountGroup: {
        discounts: [{ lowerLimit: 100, amount: 10 }],
      },
    },
    buildPriceMatrix: (rules) => ({
      currency: rules.currency,
      taxPercent: rules.taxPercent,
      bands: [
        { quantity: 1, upperLimit: 99, label: '1–99' },
        { quantity: 100, upperLimit: null, label: '100+' },
      ],
      cells: [
        { quantity: 1, costPerUnit: 10, unitPrice: 10, cost: 10, taxAmount: 0, totalCost: 10 },
        { quantity: 100, costPerUnit: 9, unitPrice: 9, cost: 900, taxAmount: 0, totalCost: 900 },
      ],
    }),
  });
  expect(matrix?.bands.map((band) => band.quantity)).toEqual([1, 100]);
  expect(matrix?.cells[1].costPerUnit).toBe(9);
});

test('resolvePriceMatrix returns null without breaks or a matrix', () => {
  expect(resolvePriceMatrix({ product: { unitPrice: 10 } })).toBeNull();
  expect(resolvePriceMatrix({})).toBeNull();
});

test('volumetricDiscountPercent reads configured tier amount', () => {
  const group = {
    discounts: [
      { lowerLimit: 100, amount: 5 },
      { lowerLimit: 500, amount: 12.4 },
    ],
  };
  expect(volumetricDiscountPercent(group, 50)).toBe(0);
  expect(volumetricDiscountPercent(group, 100)).toBe(5);
  expect(volumetricDiscountPercent(group, 500)).toBe(12);
  expect(volumetricDiscountPercent(null, 500)).toBe(0);
});

test('matrixVariationKey ignores quantity changes', () => {
  const rules = {
    fields: [{ id: 1, isSelectable: true }],
    groupFields: [],
    hasGroups: false,
  };
  const base = {
    quantity: 10,
    variations: [{ variationField: { id: 1 }, value: '2' }],
  };
  const changedQty = { ...base, quantity: 500 };
  expect(matrixVariationKey(base, rules)).toBe(matrixVariationKey(changedQty, rules));
});
