import { useEffect, useMemo, useState } from 'react';
import { toSelections } from '../utils/selections';
import { productMoqFloor } from '../utils/quantity';
import {
  activeBandIndex,
  currentOrderQuantity,
  matrixVariationKey,
  resolvePriceMatrix,
  resolvePricingRules,
  type PriceMatrixData,
  type PricingRulesLike,
} from '../utils/priceMatrix';

export interface UseProductPriceMatrixOptions {
  getQuote?: (options?: { immediate?: boolean }) => void;
  hideCalculatedPrice?: boolean;
  hideCost?: boolean;
  hideQuantityField?: boolean;
  hookForm?: {
    setValue: (
      name: string,
      value: unknown,
      options?: { shouldDirty?: boolean; shouldValidate?: boolean },
    ) => void;
    getValues: (name: string) => unknown;
    trigger: (name?: string | string[]) => Promise<boolean>;
  } | null;
  job?: any;
  pricingRules?: PricingRulesLike | null;
  product?: any;
  showPriceMatrix?: boolean;
}

export interface UseProductPriceMatrixResult {
  visible: boolean;
  matrix: PriceMatrixData | null;
  activeIndex: number;
  currency: string;
  quantity: number;
  canSelect: boolean;
  selectBand: (bandQuantity: number) => void;
  discountGroup: { discounts?: { lowerLimit: number; amount: number }[] } | null | undefined;
  rules: PricingRulesLike | null;
}

export function useProductPriceMatrix(
  options: UseProductPriceMatrixOptions,
): UseProductPriceMatrixResult {
  const {
    getQuote,
    hideCalculatedPrice = false,
    hideCost = false,
    hideQuantityField = false,
    hookForm,
    job,
    pricingRules,
    product,
    showPriceMatrix = true,
  } = options;

  const [optimisticQuantity, setOptimisticQuantity] = useState<number | null>(null);

  const rules = resolvePricingRules(pricingRules, product);
  const variationKey = useMemo(
    () => (rules ? matrixVariationKey(job ?? {}, rules) : ''),
    [job, rules],
  );

  const matrix = useMemo(() => {
    if (!showPriceMatrix || !rules) return null;
    return resolvePriceMatrix({
      rules,
      product,
      selections: toSelections(job ?? {}, rules),
      minQuantity: productMoqFloor(product),
    });
  }, [showPriceMatrix, rules, product, variationKey]);

  const jobQuantity = currentOrderQuantity(job, product);

  useEffect(() => {
    if (optimisticQuantity != null && jobQuantity === optimisticQuantity) {
      setOptimisticQuantity(null);
    }
  }, [jobQuantity, optimisticQuantity]);

  const hasGroups =
    Array.isArray(product?.groupVariationFields) && product.groupVariationFields.length > 0;
  const hasGroupRows =
    hasGroups && Array.isArray(job?.variationsGroups) && job.variationsGroups.length > 0;
  const quantity = optimisticQuantity ?? jobQuantity;
  const activeIndex = matrix ? activeBandIndex(matrix, quantity) : -1;
  const currency = matrix?.currency || product?.currency || 'AUD';
  const canSelect =
    Boolean(hookForm?.setValue) && (hasGroupRows || (!hasGroups && !hideQuantityField));

  function selectBand(bandQuantity: number) {
    if (!hookForm?.setValue) return;

    if (hasGroupRows) {
      const groups = hookForm.getValues('variationsGroups');
      if (!Array.isArray(groups) || groups.length === 0) return;

      const updatedGroups = groups.map((group: any, index: number) =>
        index === 0 ? { ...group, quantity: bandQuantity } : group,
      );

      const nextTotal = updatedGroups.reduce((sum: number, group: any) => {
        const n = Number(group?.quantity);
        return sum + (Number.isFinite(n) ? n : 0);
      }, 0);
      setOptimisticQuantity(nextTotal);

      hookForm.setValue('variationsGroups', updatedGroups, {
        shouldDirty: true,
        shouldValidate: true,
      });
      hookForm.trigger(
        updatedGroups.map((_: unknown, index: number) => `variationsGroups[${index}].quantity`),
      );
    } else if (!hasGroups && !hideQuantityField) {
      setOptimisticQuantity(bandQuantity);
      hookForm.setValue('quantity', bandQuantity, {
        shouldDirty: true,
        shouldValidate: true,
      });
      hookForm.trigger('quantity');
    } else {
      return;
    }

    getQuote?.({ immediate: true });
  }

  const discountGroup = rules?.product?.discountGroup;

  return {
    visible: !hideCost && !hideCalculatedPrice,
    matrix,
    activeIndex,
    currency,
    quantity,
    canSelect,
    selectBand,
    discountGroup,
    rules,
  };
}
