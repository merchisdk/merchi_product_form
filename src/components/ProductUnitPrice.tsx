'use client';
import { formatCurrency } from './currency';
import { useMerchiFormContext } from './MerchiProductFormProvider';

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
  const { bestPrice, currency, unitPrice } = product;
  const currencyOptions = {
    currency,
    codeBeforeSymbol: showCurrencyCode,
    showCodeIfNoSymbol: showCurrency,
    spaceBetweenSymbol
  };
  const productUnitPrice = formatCurrency(unitPrice, currencyOptions);
  const productBestPrice = formatCurrency(
    product.bestPrice, {...currencyOptions, codeBeforeSymbol: false});
  const hasPriceRange = unitPrice !== bestPrice;
  return (
    <span className={classNameUnitPrice}>
      {productUnitPrice} {hasPriceRange ?
      (' ⇄ ' + productBestPrice) : ''} {showUnitPrice && unitPriceText}
    </span>
  );
}

export default ProductUnitPrice;
