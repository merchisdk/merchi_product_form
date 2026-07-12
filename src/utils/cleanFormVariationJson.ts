/**
 * Keep this helper free of merchi_sdk_ts so Jest can import it directly.
 * The implementation must stay in sync with cleanFormVariationJson in utils.ts.
 */
export function cleanFormVariationJson(variation: any) {
  const { json, ...rest } = variation || {};
  let fromJson: any = null;
  if (typeof json === 'string' && json && json !== 'undefined') {
    try {
      fromJson = JSON.parse(json);
    } catch {
      fromJson = null;
    }
  }
  const cleanVariation: any = {
    ...(fromJson || {}),
    ...rest,
    value: variation?.value,
    variationFiles:
      variation?.variationFiles ||
      rest.variationFiles ||
      fromJson?.variationFiles ||
      [],
    variationField: rest.variationField || fromJson?.variationField,
    selectableOptions: rest.selectableOptions || fromJson?.selectableOptions,
  };
  delete cleanVariation.id;
  delete cleanVariation.variationArrayFieldId;
  delete cleanVariation.json;
  delete cleanVariation.groupId;
  return cleanVariation;
}
