// These types mirror the pricing shapes exported by `merchi_sdk_ts`
// (`merchi_sdk_ts/dist/pricing`). They are declared locally because the linked
// SDK build ships no type declarations, so importing the types directly does
// not resolve under this repo's TypeScript/Jest setup. The runtime logic below
// only reads plain object fields and does not depend on any SDK runtime code.
interface FieldSelection {
  selectedOptionIds?: number[];
  value?: string | number | null;
  colourCount?: number;
  hasFiles?: boolean;
}

interface Selections {
  quantity?: number;
  fieldValues: Record<number, FieldSelection>;
  groups?: { quantity: number; fieldValues: Record<number, FieldSelection> }[];
}

interface PricingField {
  id: number;
  isSelectable: boolean;
  fieldType?: number;
}

const COLOUR_EXTRACT = 13;

function uploadedFilePresent(variation: any): boolean {
  const files = variation?.variationFiles;
  if (!Array.isArray(files)) return false;
  return files.some((file) => file && (file.id || file.file));
}

function colourSelection(variation: any): { ids: number[]; count: number } {
  const fromValue = parseOptionIds(variation?.value);
  const fromOptions = Array.isArray(variation?.selectedOptions)
    ? variation.selectedOptions
        .map((option: any) => Number(option?.id ?? option?.optionId))
        .filter((id: number) => Number.isFinite(id))
    : [];
  const ids = fromValue.length ? fromValue : fromOptions;
  const listed = Array.isArray(variation?.selectedOptions)
    ? variation.selectedOptions.length
    : 0;
  return { ids, count: Math.max(ids.length, listed) };
}

interface PricingRules {
  fields?: PricingField[];
  groupFields?: PricingField[];
  hasGroups?: boolean;
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
  fieldById: Record<number, PricingField>
): Record<number, FieldSelection> {
  const out: Record<number, FieldSelection> = {};
  for (const variation of variations || []) {
    const fieldId = variation?.variationField?.id;
    if (fieldId === undefined || fieldId === null) continue;
    const field = fieldById[fieldId];
    if (Number(field?.fieldType) === COLOUR_EXTRACT) {
      const colours = colourSelection(variation);
      out[fieldId] = {
        selectedOptionIds: colours.ids,
        colourCount: colours.count,
        hasFiles: uploadedFilePresent(variation),
      };
      continue;
    }
    if (field?.isSelectable) {
      out[fieldId] = { selectedOptionIds: parseOptionIds(variation.value) };
    } else {
      out[fieldId] = { value: variation.value ?? null };
    }
  }
  return out;
}

export function toSelections(formValues: any, rules: PricingRules): Selections {
  const fieldById: Record<number, PricingField> = {};
  for (const f of [...(rules.fields || []), ...(rules.groupFields || [])] as PricingField[]) {
    fieldById[f.id] = f;
  }

  if (rules.hasGroups) {
    return {
      fieldValues: buildFieldValues(formValues.variations || [], fieldById),
      groups: (formValues.variationsGroups || []).map((g: any) => ({
        quantity: toQuantity(g.quantity),
        fieldValues: buildFieldValues(g.variations || [], fieldById),
      })),
    };
  }
  return {
    quantity: toQuantity(formValues.quantity),
    fieldValues: buildFieldValues(formValues.variations || [], fieldById),
  };
}
