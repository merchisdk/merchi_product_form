import { FieldType } from './types';

const SINGLE_OPTION_FIELD_TYPES = new Set<number>([
  FieldType.SELECT,
  FieldType.RADIO,
  FieldType.COLOUR_SELECT,
  FieldType.IMAGE_SELECT,
  FieldType.TURNAROUND_TIME,
]);

export function visibleSelectableOptions(variation: any): any[] {
  const options = variation?.selectableOptions;
  if (Array.isArray(options) && options.length > 0) {
    return options.filter((option: any) => option?.isVisible !== false);
  }
  const fieldOptions = variation?.variationField?.options ?? [];
  return fieldOptions.filter((option: any) => option?.include !== false);
}

export function shouldHideSingleOptionSelection(variation: any): boolean {
  const fieldType = Number(variation?.variationField?.fieldType);
  if (!SINGLE_OPTION_FIELD_TYPES.has(fieldType)) return false;
  return visibleSelectableOptions(variation).length <= 1;
}
