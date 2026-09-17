/** Split product fields that were serialized into the wrong array. */

function numericIds(values: unknown[]): Set<number> {
  const ids = new Set<number>();
  for (const value of values) {
    const id = Number(value);
    if (Number.isFinite(id)) ids.add(id);
  }
  return ids;
}

export function sanitizeProductVariationFields(product: any) {
  if (!product || typeof product !== 'object') return product;

  const independent = [...(product.independentVariationFields || [])];
  const independentIds = numericIds(independent.map((field: any) => field?.id));
  const group: any[] = [];

  for (const field of product.groupVariationFields || []) {
    if (field?.independent === true) {
      const id = Number(field?.id);
      if (Number.isFinite(id) && !independentIds.has(id)) {
        independent.push(field);
        independentIds.add(id);
      }
      continue;
    }
    group.push(field);
  }

  return {
    ...product,
    groupVariationFields: group,
    independentVariationFields: independent.filter(
      (field: any) => field?.independent !== false
    ),
  };
}

export function groupFieldTemplates(product: any): any[] {
  return (sanitizeProductVariationFields(product)?.groupVariationFields || []);
}

function variationFieldId(variation: any): number | null {
  const id = variation?.variationField?.id;
  if (id === undefined || id === null || id === '') return null;
  const n = Number(id);
  return Number.isFinite(n) ? n : null;
}

function isIndependentVariation(variation: any, independentIds: Set<number>) {
  if (variation?.variationField?.independent === true) return true;
  const id = variationFieldId(variation);
  return id != null && independentIds.has(id);
}

/** Move whole-order fields out of variation groups before quote/buy submit. */
export function liftIndependentVariationsFromGroups(job: any, product?: any) {
  if (!job || typeof job !== 'object') return job;
  const sourceProduct = product || job.product;
  const independentIds = numericIds(
    (sanitizeProductVariationFields(sourceProduct)?.independentVariationFields || [])
      .map((field: any) => field?.id)
  );

  if (!Array.isArray(job.variationsGroups) || !job.variationsGroups.length) {
    return job;
  }

  const lifted = [...(job.variations || [])];
  const liftedIds = numericIds(lifted.map(variationFieldId));

  const variationsGroups = job.variationsGroups.map((group: any) => ({
    ...group,
    variations: (group?.variations || []).filter((variation: any) => {
      if (!isIndependentVariation(variation, independentIds)) return true;
      const id = variationFieldId(variation);
      if (id != null && !liftedIds.has(id)) {
        lifted.push(variation);
        liftedIds.add(id);
      }
      return false;
    }),
  }));

  return { ...job, variations: lifted, variationsGroups };
}
