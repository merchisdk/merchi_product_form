/** Split product fields that were serialized into the wrong array. */

export function sanitizeProductVariationFields(product: any) {
  if (!product || typeof product !== 'object') return product;

  const independent = [...(product.independentVariationFields || [])];
  const independentIds = new Set(
    independent.map((field: any) => Number(field?.id)).filter(Number.isFinite)
  );
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
  const independentIds = new Set(
    (sanitizeProductVariationFields(sourceProduct)?.independentVariationFields || [])
      .map((field: any) => Number(field?.id))
      .filter(Number.isFinite)
  );

  if (!Array.isArray(job.variationsGroups) || !job.variationsGroups.length) {
    return job;
  }

  const lifted = [...(job.variations || [])];
  const liftedIds = new Set(
    lifted.map(variationFieldId).filter((id: number | null) => id != null)
  );

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
