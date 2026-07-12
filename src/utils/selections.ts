// These types mirror the pricing shapes exported by `merchi_sdk_ts`
// (`merchi_sdk_ts/dist/pricing`). They are declared locally because the linked
// SDK build ships no type declarations, so importing the types directly does
// not resolve under this repo's TypeScript/Jest setup. The runtime logic below
// only reads plain object fields and does not depend on any SDK runtime code.
interface FieldSelection {
  selectedOptionIds?: number[];
  value?: string | number | null;
}

interface Selections {
  quantity?: number;
  fieldValues: Record<number, FieldSelection>;
  groups?: { quantity: number; fieldValues: Record<number, FieldSelection> }[];
}

interface PricingField {
  id: number;
  isSelectable: boolean;
}

interface PricingRules {
  fields: PricingField[];
  groupFields: PricingField[];
  hasGroups: boolean;
}

function parseOptionIds(value: any): number[] {
  if (value === undefined || value === null || value === '') return [];
  return String(value)
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n));
}

function toQuantity(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function buildFieldValues(
  variations: any[],
  selectableByField: Record<number, boolean>
): Record<number, FieldSelection> {
  const out: Record<number, FieldSelection> = {};
  for (const variation of variations || []) {
    const fieldId = variation?.variationField?.id;
    if (fieldId === undefined || fieldId === null) continue;
    if (selectableByField[fieldId]) {
      out[fieldId] = { selectedOptionIds: parseOptionIds(variation.value) };
    } else {
      out[fieldId] = { value: variation.value ?? null };
    }
  }
  return out;
}

export function toSelections(formValues: any, rules: PricingRules): Selections {
  const selectableByField: Record<number, boolean> = {};
  for (const f of [...rules.fields, ...rules.groupFields] as PricingField[]) {
    selectableByField[f.id] = f.isSelectable;
  }

  if (rules.hasGroups) {
    return {
      fieldValues: buildFieldValues(formValues.variations || [], selectableByField),
      groups: (formValues.variationsGroups || []).map((g: any) => ({
        quantity: toQuantity(g.quantity),
        fieldValues: buildFieldValues(g.variations || [], selectableByField),
      })),
    };
  }
  return {
    quantity: toQuantity(formValues.quantity),
    fieldValues: buildFieldValues(formValues.variations || [], selectableByField),
  };
}
