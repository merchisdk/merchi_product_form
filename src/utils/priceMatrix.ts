export interface PriceMatrixBand {
  quantity: number;
  upperLimit: number | null;
  label: string;
}

export interface PriceMatrixCell {
  quantity: number;
  costPerUnit: number;
  unitPrice: number;
  cost: number;
  taxAmount: number;
  totalCost: number;
}

export interface PriceMatrix {
  currency: string;
  taxPercent: number;
  bands: PriceMatrixBand[];
  cells: PriceMatrixCell[];
}

interface PricingRulesLike {
  unsupported?: string;
  currency?: string;
  taxPercent?: number;
  product?: {
    unitPrice?: number;
    minimumPrice?: number | null;
    setupPrice?: number;
    setupPerGroup?: boolean;
    discountGroup?: { groupRestricted?: boolean; discounts?: any[] } | null;
  };
  fields?: any[];
  groupFields?: any[];
  hasGroups?: boolean;
}

/** Compact pricing-rules bundle from product JSON when the live bundle is absent. */
export function pricingRulesFromProduct(product: any): PricingRulesLike | null {
  const raw = product?.unitPriceDiscountGroup || product?.discountGroup;
  const discounts = (raw?.discounts || [])
    .map((discount: any) => ({
      lowerLimit: Number(discount.lowerLimit),
      amount: Number(discount.amount),
    }))
    .filter(
      (discount: { lowerLimit: number; amount: number }) =>
        Number.isFinite(discount.lowerLimit) && Number.isFinite(discount.amount)
    );
  if (!discounts.length) return null;
  const minimumPrice = product?.minimumPrice;
  return {
    currency: product?.currency || 'AUD',
    taxPercent: Number(product?.taxType?.taxPercent) || 0,
    product: {
      unitPrice: Number(product?.unitPrice) || 0,
      minimumPrice:
        minimumPrice == null || minimumPrice === ''
          ? null
          : Number(minimumPrice),
      setupPrice: Number(product?.setupPrice) || 0,
      setupPerGroup: Boolean(product?.setupPerGroup),
      discountGroup: {
        groupRestricted: Boolean(raw.groupRestricted),
        discounts,
      },
    },
    fields: [],
    groupFields: [],
    hasGroups: false,
  };
}

export function resolvePricingRules(
  pricingRules: PricingRulesLike | null | undefined,
  product: any
): PricingRulesLike | null {
  if (pricingRules && !pricingRules.unsupported) return pricingRules;
  return pricingRulesFromProduct(product);
}

export function currentOrderQuantity(job: any, product: any): number {
  const hasGroups = Array.isArray(product?.groupVariationFields)
    && product.groupVariationFields.length > 0;
  if (hasGroups && Array.isArray(job?.variationsGroups)) {
    return job.variationsGroups.reduce((sum: number, group: any) => {
      const n = Number(group?.quantity);
      return sum + (Number.isFinite(n) ? n : 0);
    }, 0);
  }
  const n = Number(job?.quantity);
  return Number.isFinite(n) ? n : 0;
}

export function activeBandIndex(matrix: PriceMatrix, quantity: number): number {
  if (!matrix.bands.length || quantity < matrix.bands[0].quantity) return -1;
  for (let i = matrix.bands.length - 1; i >= 0; i--) {
    if (quantity >= matrix.bands[i].quantity) return i;
  }
  return -1;
}
