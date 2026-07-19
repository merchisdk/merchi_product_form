import {
  defaultGroupQuantity,
  enforceMoqPerGroup,
  productMinimumQuantity,
  productMoqFloor,
} from './quantity';

describe('product MOQ helpers', () => {
  test('productMinimumQuantity reads numeric minimum', () => {
    expect(productMinimumQuantity({ minimum: 50 })).toBe(50);
    expect(productMinimumQuantity({ minimum: '25' })).toBe(25);
    expect(productMinimumQuantity({ minimum: 0 })).toBe(0);
    expect(productMinimumQuantity({})).toBe(0);
  });

  test('productMoqFloor is at least 1', () => {
    expect(productMoqFloor({ minimum: 50 })).toBe(50);
    expect(productMoqFloor({ minimum: 0 })).toBe(1);
    expect(productMoqFloor({})).toBe(1);
  });

  test('enforceMoqPerGroup follows minimumPerGroup', () => {
    expect(enforceMoqPerGroup({ minimumPerGroup: true })).toBe(true);
    expect(enforceMoqPerGroup({ minimumPerGroup: false })).toBe(false);
    expect(enforceMoqPerGroup({})).toBe(false);
  });

  test('defaultGroupQuantity seeds at MOQ floor', () => {
    expect(defaultGroupQuantity({ minimum: 100 })).toBe(100);
    expect(defaultGroupQuantity({ minimum: 0 })).toBe(1);
  });
});
