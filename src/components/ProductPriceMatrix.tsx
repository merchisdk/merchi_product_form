'use client';
import * as React from 'react';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';
import { toSelections } from '../utils/selections';
import { productMoqFloor } from '../utils/quantity';
import {
  currentOrderQuantity,
  resolvePricingRules,
} from '../utils/priceMatrix';
import PriceMatrix from './PriceMatrix';

function ProductPriceMatrix() {
  const {
    classNamePriceMatrix,
    getQuote,
    hideCalculatedPrice,
    hideCost,
    hideQuantityField,
    hookForm,
    job,
    pricingRules,
    product,
    showCurrency = false,
    showCurrencyCode = false,
    showPriceMatrix = true,
  } = useMerchiFormContext();

  if (!showPriceMatrix || hideCost || hideCalculatedPrice) return null;

  const rules = resolvePricingRules(pricingRules, product);
  const hasGroups = Array.isArray(product?.groupVariationFields)
    && product.groupVariationFields.length > 0;

  function selectBand(bandQuantity: number) {
    if (!hookForm?.setValue) return;

    if (hasGroups) {
      const groups = hookForm.getValues('variationsGroups');
      if (!Array.isArray(groups) || groups.length === 0) return;

      const updatedGroups = groups.map((group: any, index: number) =>
        index === 0 ? { ...group, quantity: bandQuantity } : group,
      );

      hookForm.setValue('variationsGroups', updatedGroups, {
        shouldDirty: true,
        shouldValidate: true,
      });
      hookForm.trigger(
        updatedGroups.map((_: unknown, index: number) => `variationsGroups[${index}].quantity`),
      );
    } else {
      hookForm.setValue('quantity', bandQuantity, {
        shouldDirty: true,
        shouldValidate: true,
      });
      hookForm.trigger('quantity');
    }
    getQuote({ immediate: true });
  }

  const hasGroupRows =
    hasGroups && Array.isArray(job?.variationsGroups) && job.variationsGroups.length > 0;
  const canSelectBands = Boolean(hookForm?.setValue)
    && (hasGroupRows || (!hasGroups && !hideQuantityField));

  return (
    <PriceMatrix
      rules={rules}
      product={product}
      selections={rules ? toSelections(job, rules) : undefined}
      minQuantity={productMoqFloor(product)}
      quantity={currentOrderQuantity(job, product)}
      onSelectBand={canSelectBands ? selectBand : undefined}
      className={classNamePriceMatrix}
      showCurrency={showCurrency}
      showCurrencyCode={showCurrencyCode}
    />
  );
}

export default ProductPriceMatrix;
