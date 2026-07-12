function splitSelectedOptionIds(value: any): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }
  if (typeof value === 'string' && value) {
    return value.split(',').map((id) => id.trim()).filter(Boolean);
  }
  return [];
}

/** Derive label costs from currently selected options (not stale variation.unitCost). */
export function costsFromSelectedOptions(variation: any, selectedValue: any) {
  const selectedIds = splitSelectedOptionIds(selectedValue);
  const options = variation?.selectableOptions || [];
  const selected = options.filter((option: any) =>
    selectedIds.includes(String(option.optionId))
  );

  if (!selected.length) {
    return {
      onceOffCost: variation?.onceOffCost,
      unitCost: variation?.unitCost,
      currency: variation?.currency,
    };
  }

  return {
    onceOffCost: selected.reduce(
      (sum: number, option: any) => sum + (parseFloat(option.onceOffCost) || 0),
      0
    ),
    unitCost: selected.reduce(
      (sum: number, option: any) => sum + (parseFloat(option.unitCost) || 0),
      0
    ),
    currency: selected[0].currency || variation?.currency,
  };
}
