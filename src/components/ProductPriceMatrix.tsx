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
    if (hasGroups || !hookForm?.setValue) return;
    hookForm.setValue('quantity', bandQuantity, {
      shouldDirty: true,
      shouldValidate: true,
    });
    getQuote();
  }

  return (
    <PriceMatrix
      rules={rules}
      product={product}
      selections={rules ? toSelections(job, rules) : undefined}
      minQuantity={productMoqFloor(product)}
      quantity={currentOrderQuantity(job, product)}
      onSelectBand={hasGroups ? undefined : selectBand}
      className={classNamePriceMatrix}
      showCurrency={showCurrency}
      showCurrencyCode={showCurrencyCode}
    />
  );
}

export default ProductPriceMatrix;
