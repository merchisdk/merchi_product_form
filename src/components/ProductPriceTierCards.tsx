'use client';
import * as React from 'react';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';
import { useProductPriceMatrix } from '../hooks/useProductPriceMatrix';
import PriceTierCards, {
  type PriceTierCardsClassNames,
} from './PriceTierCards';
import ProductUnitPrice from './ProductUnitPrice';

export interface ProductPriceTierCardsProps {
  className?: string;
  classNames?: PriceTierCardsClassNames;
  subtitle?: string;
  formatSetupLabel?: (product: any, job?: any) => string | null;
  renderFallback?: () => React.ReactNode;
}

function ProductPriceTierCards({
  className,
  classNames,
  subtitle,
  formatSetupLabel,
  renderFallback,
}: ProductPriceTierCardsProps) {
  const {
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

  const {
    visible,
    matrix,
    activeIndex,
    currency,
    canSelect,
    selectBand,
    discountGroup,
  } = useProductPriceMatrix({
    getQuote,
    hideCalculatedPrice,
    hideCost,
    hideQuantityField,
    hookForm,
    job,
    pricingRules,
    product,
    showPriceMatrix,
  });

  if (!visible) return null;

  if (!matrix) {
    if (renderFallback) return <>{renderFallback()}</>;
    return (
      <ProductUnitPrice
        unitPriceText="per unit"
        spaceBetweenSymbol={false}
      />
    );
  }

  const setupLabel = formatSetupLabel
    ? formatSetupLabel(product, job)
    : null;

  return (
    <PriceTierCards
      matrix={matrix}
      activeIndex={activeIndex}
      currency={currency}
      setupLabel={setupLabel}
      canSelect={canSelect}
      discountGroup={discountGroup}
      onSelectBand={selectBand}
      className={className}
      classNames={classNames}
      subtitle={subtitle}
      product={product}
      showCurrency={showCurrency}
      showCurrencyCode={showCurrencyCode}
    />
  );
}

export default ProductPriceTierCards;
