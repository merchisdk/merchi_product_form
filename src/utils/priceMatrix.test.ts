import {
  activeBandIndex,
  currentOrderQuantity,
  pricingRulesFromProduct,
  resolvePricingRules,
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
