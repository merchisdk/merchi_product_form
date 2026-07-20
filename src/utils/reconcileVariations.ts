/**
 * Reconcile form variation arrays with a desired list (server quote or
 * client-side visible fields). Membership is matched by variationField.id so
 * conditional fields the server/client adds or removes are adopted without a
 * full form reset that would throw away in-progress quantity edits.
 */

export function variationFieldId(variation: any): number | null {
  const id = variation?.variationField?.id;
  if (id === undefined || id === null || id === '') return null;
  const n = Number(id);
  return Number.isFinite(n) ? n : null;
}

function optionId(option: any): number | null {
  const id = option?.optionId ?? option?.id;
  if (id === undefined || id === null || id === '') return null;
  const n = Number(id);
  return Number.isFinite(n) ? n : null;
}

/** Sync isVisible / available onto current options by optionId (not index). */
export function syncOptionVisibilityById(
  currentOptions: any[] | undefined,
  sourceOptions: any[] | undefined
): boolean {
  if (!Array.isArray(currentOptions) || !Array.isArray(sourceOptions)) {
    return false;
  }
  const sourceById = new Map<number, any>();
  for (const option of sourceOptions) {
    const id = optionId(option);
    if (id != null) sourceById.set(id, option);
  }
  let changed = false;
  for (const option of currentOptions) {
    const id = optionId(option);
    if (id == null) continue;
    const source = sourceById.get(id);
    if (!source) continue;
    if (
      source.isVisible !== undefined &&
      option.isVisible !== source.isVisible
    ) {
      option.isVisible = source.isVisible;
      changed = true;
    }
    if (
      source.available !== undefined &&
      option.available !== source.available
    ) {
      option.available = source.available;
      changed = true;
    }
  }
  return changed;
}

function preferVariationField(current: any, desired: any): any {
  // Keep the richer client/product metadata (e.g. selectedBy) when the desired
  // list comes from an estimate embed that omits it.
  if (!current) return desired;
  if (!desired) return current;
  const currentHasSelectedBy = Array.isArray(current.selectedBy);
  const desiredHasSelectedBy = Array.isArray(desired.selectedBy);
  if (currentHasSelectedBy && !desiredHasSelectedBy) {
    return { ...desired, ...current, selectedBy: current.selectedBy };
  }
  if (current.fieldType != null && desired.fieldType == null) {
    return { ...desired, ...current };
  }
  return {
    ...current,
    ...desired,
    selectedBy: desired.selectedBy ?? current.selectedBy,
  };
}

function sameFieldMembership(
  currentVariations: any[] | undefined,
  desiredVariations: any[] | undefined
): boolean {
  const currentIds = (currentVariations || []).map(variationFieldId);
  const desiredIds = (desiredVariations || []).map(variationFieldId);
  if (currentIds.length !== desiredIds.length) return false;
  return currentIds.every((id, index) => id === desiredIds[index]);
}

/**
 * Build the next variations array from `desiredVariations`, preserving user
 * `value` / `variationFiles` for fields that already exist on the form.
 */
export function reconcileVariations(
  currentVariations: any[] | undefined,
  desiredVariations: any[] | undefined
): { variations: any[]; membershipChanged: boolean; visibilityChanged: boolean } {
  const currentByFieldId = new Map<number, any>();
  for (const variation of currentVariations || []) {
    const id = variationFieldId(variation);
    if (id != null) currentByFieldId.set(id, variation);
  }

  const membershipChanged = !sameFieldMembership(
    currentVariations,
    desiredVariations
  );
  let visibilityChanged = false;

  const variations = (desiredVariations || []).map((desired) => {
    const fieldId = variationFieldId(desired);
    const current = fieldId != null ? currentByFieldId.get(fieldId) : undefined;
    if (!current) {
      return desired;
    }

    const mergedSelectable =
      Array.isArray(desired.selectableOptions) &&
      desired.selectableOptions.length > 0
        ? desired.selectableOptions.map((desiredOption: any) => {
            const id = optionId(desiredOption);
            const currentOption = (current.selectableOptions || []).find(
              (option: any) => optionId(option) === id
            );
            if (!currentOption) return desiredOption;
            // Detect visibility diffs against the previous form state.
            if (
              desiredOption.isVisible !== undefined &&
              currentOption.isVisible !== desiredOption.isVisible
            ) {
              visibilityChanged = true;
            }
            if (
              desiredOption.available !== undefined &&
              currentOption.available !== desiredOption.available
            ) {
              visibilityChanged = true;
            }
            return { ...currentOption, ...desiredOption };
          })
        : current.selectableOptions;

    return {
      ...desired,
      value: current.value,
      variationFiles: current.variationFiles ?? desired.variationFiles,
      variationField: preferVariationField(
        current.variationField,
        desired.variationField
      ),
      selectableOptions: mergedSelectable,
    };
  });

  return {
    variations,
    membershipChanged,
    visibilityChanged: visibilityChanged || membershipChanged,
  };
}

/**
 * Filter/order product fields by a visible-id set and reuse current values
 * when present; otherwise use `buildEmptyVariation(field)`.
 */
export function buildDesiredVariationsFromFields(
  currentVariations: any[] | undefined,
  productFields: any[] | undefined,
  visibleFieldIds: Set<number>,
  buildEmptyVariation: (field: any) => any
): any[] {
  // Without product field templates we cannot materialise gated fields — leave
  // the current list alone rather than wiping the form.
  if (!Array.isArray(productFields) || productFields.length === 0) {
    return currentVariations || [];
  }

  const currentByFieldId = new Map<number, any>();
  for (const variation of currentVariations || []) {
    const id = variationFieldId(variation);
    if (id != null) currentByFieldId.set(id, variation);
  }

  const sortedFields = [...productFields].sort(
    (a, b) => (a?.position || 0) - (b?.position || 0)
  );

  const desired: any[] = [];
  for (const field of sortedFields) {
    const id = field?.id;
    if (id == null || !visibleFieldIds.has(Number(id))) continue;
    const current = currentByFieldId.get(Number(id));
    if (current) {
      desired.push(current);
    } else {
      desired.push(buildEmptyVariation(field));
    }
  }
  return desired;
}
