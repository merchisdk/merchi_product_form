/** Product MOQ as a number, or 0 when unset / invalid. */
export function productMinimumQuantity(product: any): number {
  const n = Number(product?.minimum);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Floor used for quantity inputs: at least 1, or the product MOQ when higher. */
export function productMoqFloor(product: any): number {
  return Math.max(1, productMinimumQuantity(product));
}

export function enforceMoqPerGroup(product: any): boolean {
  return Boolean(product?.minimumPerGroup);
}

/** Quantity to seed on a newly added variation group. */
export function defaultGroupQuantity(product: any): number {
  return productMoqFloor(product);
}
