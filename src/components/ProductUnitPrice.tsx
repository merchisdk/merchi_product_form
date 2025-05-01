'use client';
import * as React from 'react';
import { formatCurrency } from './currency';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';

interface Props {
  unitPriceText?: string;
  spaceBetweenSymbol?: boolean;
}

function ProductUnitPrice({
    unitPriceText = 'unit price',
    spaceBetweenSymbol = false
  }: Props) {
  const {
    classNameUnitPrice,
    product,
    showCurrency = false,
    showCurrencyCode = false,
    showUnitPrice =  true,
  } = useMerchiFormContext();
  const { bestPrice = 0, currency, unitPrice = 0 } = product;
  const currencyOptions = {
    currency,
    codeBeforeSymbol: showCurrencyCode,
    showCodeIfNoSymbol: showCurrency,
    spaceBetweenSymbol
  };
  const productUnitPrice = formatCurrency(unitPrice || 0, currencyOptions);
  const productBestPrice = formatCurrency(bestPrice || 0, {...currencyOptions, codeBeforeSymbol: false});
  const hasPriceRange = unitPrice !== bestPrice;
  return (
    <span className={classNameUnitPrice}>
      {productUnitPrice} {hasPriceRange ?
      (' ⇄ ' + productBestPrice) : ''} {showUnitPrice && unitPriceText}
    </span>
  );
}

export default ProductUnitPrice;
