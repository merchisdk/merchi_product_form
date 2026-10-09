import { resolveLinkedProductImage } from './linkedProductImage';

const product = {
  independentVariationFields: [
    {
      options: [
        { id: 1, value: 'Red', linkedProductImage: { id: 'red-file', viewUrl: 'https://img/red' } },
        { id: 2, value: 'Blue' },
      ],
    },
  ],
  groupVariationFields: [
    {
      options: [
        { id: 3, value: 'Large', linkedProductImage: { id: 'large-file', viewUrl: 'https://img/large' } },
      ],
    },
  ],
};

test('first load uses the independent option before a group option', () => {
  const result = resolveLinkedProductImage(product, {
    variations: [{ value: '1' }],
    variationsGroups: [{ variations: [{ value: '3' }] }],
  });
  expect(result.image).toEqual({ id: 'red-file', viewUrl: 'https://img/red' });
  expect(result.winnerId).toBe(1);
});

test('first load uses the group option when independents have no photo', () => {
  const result = resolveLinkedProductImage(product, {
    variations: [{ value: '2' }],
    variationsGroups: [{ variations: [{ value: '3' }] }],
  });
  expect(result.image?.id).toBe('large-file');
});

test('options that arrive together after an empty form use the first photo', () => {
  const next = resolveLinkedProductImage(
    product,
    {
      variations: [{ value: '1' }],
      variationsGroups: [{ variations: [{ value: '3' }] }],
    },
    { ids: [], winnerId: null, ready: true },
  );
  expect(next.image?.id).toBe('red-file');
});

test('the option just selected replaces the current photo', () => {
  const previous = resolveLinkedProductImage(product, {
    variations: [{ value: '1' }],
  });
  const next = resolveLinkedProductImage(
    product,
    {
      variations: [{ value: '1' }],
      variationsGroups: [{ variations: [{ value: '3' }] }],
    },
    { ids: previous.ids, winnerId: previous.winnerId, ready: true },
  );
  expect(next.image?.id).toBe('large-file');
});

test('clearing the winning option falls back to another linked photo', () => {
  const next = resolveLinkedProductImage(
    product,
    { variationsGroups: [{ variations: [{ value: '3' }] }] },
    { ids: [1, 3], winnerId: 1, ready: true },
  );
  expect(next.image?.id).toBe('large-file');
});

test('clearing the last linked option removes the override', () => {
  const next = resolveLinkedProductImage(
    product,
    { variations: [{ value: '2' }] },
    { ids: [1], winnerId: 1, ready: true },
  );
  expect(next.image).toBeNull();
  expect(next.winnerId).toBeNull();
});
