'use client';
import * as React from 'react';
import { pricing } from 'merchi_sdk_ts';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';
import { formatCurrency } from './currency';
import { toSelections } from '../utils/selections';
import { productMoqFloor } from '../utils/quantity';
import {
  activeBandIndex,
  currentOrderQuantity,
  resolvePricingRules,
} from '../utils/priceMatrix';

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

  const rules = resolvePricingRules(pricingRules, product);
  const minQuantity = productMoqFloor(product);
  const hasGroups = Array.isArray(product?.groupVariationFields)
    && product.groupVariationFields.length > 0;
  const matrix =
    showPriceMatrix &&
    !hideCost &&
    !hideCalculatedPrice &&
    rules &&
    typeof pricing.buildPriceMatrix === 'function'
      ? pricing.buildPriceMatrix(rules, toSelections(job, rules), { minQuantity })
      : null;

  if (!matrix) return null;

  const quantity = currentOrderQuantity(job, product);
  const active = activeBandIndex(matrix, quantity);
  const currencyOptions = {
    currency: matrix.currency || product?.currency || 'AUD',
    codeBeforeSymbol: showCurrencyCode,
    showCodeIfNoSymbol: showCurrency,
  };

  function selectBand(bandQuantity: number) {
    if (hasGroups || !hookForm?.setValue) return;
    hookForm.setValue('quantity', bandQuantity, {
      shouldDirty: true,
      shouldValidate: true,
    });
    getQuote();
  }

  return (
    <div className={classNamePriceMatrix || 'merchi-price-matrix'}>
      <table className='merchi-price-matrix_table'>
        <caption className='merchi-price-matrix_caption'>Bulk price</caption>
        <thead>
          <tr>
            <th scope='row' className='merchi-price-matrix_corner'>
              Qty
            </th>
            {matrix.bands.map((band: any, index: number) => {
              const isActive = index === active;
              const className = [
                'merchi-price-matrix_th',
                isActive ? 'merchi-price-matrix_col-active' : '',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <th
                  key={band.quantity}
                  scope='col'
                  className={className}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {hasGroups ? (
                    band.label
                  ) : (
                    <button
                      type='button'
                      className='merchi-price-matrix_band'
                      onClick={() => selectBand(band.quantity)}
                    >
                      {band.label}
                    </button>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope='row' className='merchi-price-matrix_row-label'>
              Unit
            </th>
            {matrix.cells.map((cell: any, index: number) => (
              <td
                key={`unit-${cell.quantity}`}
                className={
                  index === active ? 'merchi-price-matrix_col-active' : undefined
                }
              >
                {formatCurrency(cell.unitPrice, currencyOptions)}
              </td>
            ))}
          </tr>
          <tr>
            <th scope='row' className='merchi-price-matrix_row-label'>
              Total
            </th>
            {matrix.cells.map((cell: any, index: number) => (
              <td
                key={`total-${cell.quantity}`}
                className={
                  index === active ? 'merchi-price-matrix_col-active' : undefined
                }
              >
                {formatCurrency(cell.totalCost, currencyOptions)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ProductPriceMatrix;
