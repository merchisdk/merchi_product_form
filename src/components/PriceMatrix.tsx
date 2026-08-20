'use client';
import * as React from 'react';
import { formatCurrency } from './currency';
import {
  activeBandIndex,
  resolvePriceMatrix,
  type PriceMatrixData,
} from '../utils/priceMatrix';

export interface PriceMatrixProps {
  /** Precomputed table. Wins over `rules` / `product`. */
  matrix?: PriceMatrixData | null;
  /** Live pricing-rules bundle from `/products/:id/pricing-rules/`. */
  rules?: any;
  /** Product JSON; used for fallback breaks and MOQ when `rules` is absent. */
  product?: any;
  selections?: {
    quantity?: number;
    fieldValues?: Record<number, any>;
    groups?: any[];
  };
  minQuantity?: number;
  /** Current order quantity; highlights the matching column. */
  quantity?: number;
  onSelectBand?: (quantity: number) => void;
  /** When false, quantity labels are not buttons. Defaults to whether `onSelectBand` is set. */
  selectable?: boolean;
  className?: string;
  caption?: string;
  showCurrency?: boolean;
  showCurrencyCode?: boolean;
}

function PriceMatrix({
  matrix: matrixProp,
  rules,
  product,
  selections,
  minQuantity,
  quantity = 0,
  onSelectBand,
  selectable,
  className,
  caption = 'Bulk price',
  showCurrency = false,
  showCurrencyCode = false,
}: PriceMatrixProps) {
  const matrix = resolvePriceMatrix({
    matrix: matrixProp,
    rules,
    product,
    selections,
    minQuantity,
  });
  if (!matrix) return null;

  const active = activeBandIndex(matrix, quantity);
  const canSelect = selectable ?? Boolean(onSelectBand);
  const currencyOptions = {
    currency: matrix.currency || product?.currency || 'AUD',
    codeBeforeSymbol: showCurrencyCode,
    showCodeIfNoSymbol: showCurrency,
  };

  return (
    <div className={className || 'merchi-price-matrix'}>
      <table className='merchi-price-matrix_table'>
        {caption ? (
          <caption className='merchi-price-matrix_caption'>{caption}</caption>
        ) : null}
        <thead>
          <tr>
            <th scope='row' className='merchi-price-matrix_corner'>
              Qty
            </th>
            {matrix.bands.map((band, index) => {
              const isActive = index === active;
              const classNameTh = [
                'merchi-price-matrix_th',
                isActive ? 'merchi-price-matrix_col-active' : '',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <th
                  key={band.quantity}
                  scope='col'
                  className={classNameTh}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {canSelect ? (
                    <button
                      type='button'
                      className='merchi-price-matrix_band'
                      onClick={() => onSelectBand?.(band.quantity)}
                    >
                      {band.label}
                    </button>
                  ) : (
                    band.label
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
            {matrix.cells.map((cell, index) => (
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
            {matrix.cells.map((cell, index) => (
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

export default PriceMatrix;
