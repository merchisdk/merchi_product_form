import { FieldType } from './types';

function splitSelectedOptionIds(value: any): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }
  if (typeof value === 'string' && value) {
    return value.split(',').map((id) => id.trim()).filter(Boolean);
  }
  return [];
}

function optionOnceOff(option: any): number {
  return (
    parseFloat(option?.onceOffCost) ||
    parseFloat(option?.variationCost) ||
    0
  );
}

function optionUnit(option: any): number {
  return (
    parseFloat(option?.unitCost) ||
    parseFloat(option?.variationUnitCost) ||
    0
  );
}

/** Derive label costs from currently selected options (not stale variation.unitCost). */
export function costsFromSelectedOptions(variation: any, selectedValue: any) {
  const selectedIds = splitSelectedOptionIds(selectedValue);
  const selectable = variation?.selectableOptions || [];
  let selected = selectable.filter((option: any) =>
    selectedIds.includes(String(option.optionId))
  );
  let fromExtractedSelectedOptions = false;

  // Colour extract keeps live choices on selectedOptions (id, not optionId).
  if (!selected.length && Array.isArray(variation?.selectedOptions)) {
    selected = variation.selectedOptions.filter((option: any) =>
      selectedIds.includes(String(option.id ?? option.optionId))
    );
    fromExtractedSelectedOptions = selected.length > 0;
  }

  if (!selected.length) {
    return {
      onceOffCost: variation?.onceOffCost,
      unitCost: variation?.unitCost,
      currency: variation?.currency,
    };
  }

  const isColourExtract =
    Number(variation?.variationField?.fieldType) === FieldType.COLOUR_EXTRACT;
  const includeFieldCosts = fromExtractedSelectedOptions || isColourExtract;
  const fieldOnce = includeFieldCosts
    ? parseFloat(variation?.variationField?.variationCost) || 0
    : 0;
  const fieldUnit = includeFieldCosts
    ? parseFloat(variation?.variationField?.variationUnitCost) || 0
    : 0;

  return {
    onceOffCost:
      fieldOnce +
      selected.reduce((sum: number, option: any) => sum + optionOnceOff(option), 0),
    unitCost:
      fieldUnit +
      selected.reduce((sum: number, option: any) => sum + optionUnit(option), 0),
    currency: selected[0].currency || variation?.currency,
  };
}
