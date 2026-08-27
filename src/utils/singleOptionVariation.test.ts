import {
  shouldHideSingleOptionSelection,
  visibleSelectableOptions,
} from './singleOptionVariation';
import { FieldType } from './types';

test('counts only visible selectable options', () => {
  expect(
    visibleSelectableOptions({
      selectableOptions: [
        { optionId: 1, isVisible: true },
        { optionId: 2, isVisible: false },
      ],
    })
  ).toHaveLength(1);
});

test('hides colour and select fields with one visible option', () => {
  expect(
    shouldHideSingleOptionSelection({
      variationField: { fieldType: FieldType.COLOUR_SELECT },
      selectableOptions: [{ optionId: 1, isVisible: true }],
    })
  ).toBe(true);
  expect(
    shouldHideSingleOptionSelection({
      variationField: { fieldType: FieldType.SELECT },
      selectableOptions: [{ optionId: 1, isVisible: true }],
    })
  ).toBe(true);
});

test('keeps the picker when more than one option is visible', () => {
  expect(
    shouldHideSingleOptionSelection({
      variationField: { fieldType: FieldType.RADIO },
      selectableOptions: [
        { optionId: 1, isVisible: true },
        { optionId: 2, isVisible: true },
      ],
    })
  ).toBe(false);
});

test('still shows a checkbox even with one option', () => {
  expect(
    shouldHideSingleOptionSelection({
      variationField: { fieldType: FieldType.CHECKBOX },
      selectableOptions: [{ optionId: 1, isVisible: true }],
    })
  ).toBe(false);
});
