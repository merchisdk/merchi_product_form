import { costsFromSelectedOptions } from './selectedVariationCosts';

test('uses selected option costs for the variation label', () => {
  const variation = {
    onceOffCost: 0,
    unitCost: 0.06,
    currency: 'AUD',
    selectableOptions: [
      { optionId: 100, onceOffCost: 0, unitCost: 0.06, currency: 'AUD' },
      { optionId: 200, onceOffCost: 0, unitCost: 0.05, currency: 'AUD' },
    ],
  };

  expect(costsFromSelectedOptions(variation, '200')).toEqual({
    onceOffCost: 0,
    unitCost: 0.05,
    currency: 'AUD',
  });
});

test('sums costs when multiple options are selected', () => {
  const variation = {
    onceOffCost: 1,
    unitCost: 0.1,
    currency: 'AUD',
    selectableOptions: [
      { optionId: 1, onceOffCost: 2, unitCost: 0.03, currency: 'AUD' },
      { optionId: 2, onceOffCost: 1, unitCost: 0.02, currency: 'AUD' },
    ],
  };

  expect(costsFromSelectedOptions(variation, '1,2')).toEqual({
    onceOffCost: 3,
    unitCost: 0.05,
    currency: 'AUD',
  });
});

test('falls back to variation costs when nothing is selected', () => {
  const variation = {
    onceOffCost: 1,
    unitCost: 0.06,
    currency: 'AUD',
    selectableOptions: [
      { optionId: 100, onceOffCost: 0, unitCost: 0.05, currency: 'AUD' },
    ],
  };

  expect(costsFromSelectedOptions(variation, '')).toEqual({
    onceOffCost: 1,
    unitCost: 0.06,
    currency: 'AUD',
  });
});
