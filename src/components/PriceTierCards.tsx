'use client';
import * as React from 'react';
import { formatCurrency } from './currency';
import {
  type PriceMatrixData,
  productUnitPriceFromCell,
  volumetricDiscountPercent,
} from '../utils/priceMatrix';

export interface PriceTierCardsClassNames {
  root?: string;
  section?: string;
  headline?: string;
  headlineUnit?: string;
  subtitle?: string;
  grid?: string;
  card?: string;
  cardActive?: string;
  cardInactive?: string;
  cardSelectable?: string;
  cardContent?: string;
  bandLabel?: string;
  unitPrice?: string;
  unitPriceActive?: string;
  saveLabel?: string;
  setupLabel?: string;
}

export interface PriceTierCardsProps {
  matrix: PriceMatrixData;
  activeIndex: number;
  currency?: string;
  setupLabel?: string | null;
  canSelect?: boolean;
  discountGroup?: { discounts?: { lowerLimit: number; amount: number }[] } | null;
  onSelectBand?: (quantity: number) => void;
  className?: string;
  classNames?: PriceTierCardsClassNames;
  subtitle?: string;
  product?: any;
  showCurrency?: boolean;
  showCurrencyCode?: boolean;
}

function joinClasses(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

function PriceTierCards({
  matrix,
  activeIndex,
  currency: currencyProp,
  setupLabel = null,
  canSelect: canSelectProp,
  discountGroup,
  onSelectBand,
  className,
  classNames = {},
  subtitle = 'Price varies by quantity',
  product,
  showCurrency = false,
  showCurrencyCode = false,
}: PriceTierCardsProps) {
  const currency = currencyProp || matrix.currency || product?.currency || 'AUD';
  const canSelect = canSelectProp ?? Boolean(onSelectBand);
  const firstCell = matrix.cells[0];
  const activeCell = activeIndex >= 0 ? matrix.cells[activeIndex] : firstCell;
  const displayUnitPrice = activeCell ? productUnitPriceFromCell(activeCell) : 0;

  const currencyOptions = {
    currency,
    codeBeforeSymbol: showCurrencyCode,
    showCodeIfNoSymbol: showCurrency,
  };

  const rootClass = joinClasses(
    classNames.root ?? className ?? 'merchi-price-tier-cards',
  );
  const sectionClass = joinClasses(
    classNames.section ?? 'merchi-price-tier-cards_section',
  );
  const headlineClass = joinClasses(
    classNames.headline ?? 'merchi-price-tier-cards_headline',
  );
  const headlineUnitClass = joinClasses(
    classNames.headlineUnit ?? 'merchi-price-tier-cards_headline-unit',
  );
  const subtitleClass = joinClasses(
    classNames.subtitle ?? 'merchi-price-tier-cards_subtitle',
  );
  const gridClass = joinClasses(
    classNames.grid ?? 'merchi-price-tier-cards_grid',
  );
  const cardContentClass = joinClasses(
    classNames.cardContent ?? 'merchi-price-tier-cards_card-content',
  );
  const bandLabelClass = joinClasses(
    classNames.bandLabel ?? 'merchi-price-tier-cards_band-label',
  );
  const setupLabelClass = joinClasses(
    classNames.setupLabel ?? 'merchi-price-tier-cards_setup-label',
  );
  const saveLabelClass = joinClasses(
    classNames.saveLabel ?? 'merchi-price-tier-cards_save-label',
  );

  return (
    <div className={rootClass}>
      <div className={sectionClass}>
        <p className={headlineClass}>
          {formatCurrency(displayUnitPrice, currencyOptions)}
          <span className={headlineUnitClass}> / unit</span>
        </p>
        {subtitle ? <p className={subtitleClass}>{subtitle}</p> : null}

        <div className={gridClass}>
          {matrix.bands.map((band, index) => {
            const cell = matrix.cells[index];
            if (!cell) return null;
            const isActive = index === activeIndex;
            const unitPrice = productUnitPriceFromCell(cell);
            const discount =
              index > 0 ? volumetricDiscountPercent(discountGroup, band.quantity) : 0;

            const cardClass = joinClasses(
              classNames.card ?? 'merchi-price-tier-cards_card',
              isActive
                ? classNames.cardActive ?? 'merchi-price-tier-cards_card-active'
                : classNames.cardInactive ?? 'merchi-price-tier-cards_card-inactive',
              canSelect && (
                classNames.cardSelectable ?? 'merchi-price-tier-cards_card-selectable'
              ),
            );

            const unitPriceClass = joinClasses(
              classNames.unitPrice ?? 'merchi-price-tier-cards_unit-price',
              isActive && (classNames.unitPriceActive ?? 'merchi-price-tier-cards_unit-price-active'),
            );

            const content = (
              <div className={cardContentClass}>
                <p className={bandLabelClass}>{band.label}</p>
                <p className={unitPriceClass}>
                  {formatCurrency(unitPrice, currencyOptions)}
                </p>
                {discount > 0 ? (
                  <p className={saveLabelClass}>Save {discount}%</p>
                ) : null}
              </div>
            );

            if (canSelect && onSelectBand) {
              return (
                <button
                  key={band.quantity}
                  type="button"
                  className={cardClass}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => onSelectBand(band.quantity)}
                >
                  {content}
                </button>
              );
            }

            return (
              <div
                key={band.quantity}
                className={cardClass}
                aria-current={isActive ? 'true' : undefined}
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
      {setupLabel ? <p className={setupLabelClass}>{setupLabel}</p> : null}
    </div>
  );
}

export default PriceTierCards;
