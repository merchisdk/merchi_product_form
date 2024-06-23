'use client';
import { useMerchiFormContext } from './MerchiProductFormProvider';
import { ButtonProductSubmit } from './buttons';
import { isProductSupplierMOD } from './utils';

function ProductButtonsSubmit() {
  const {
    allowAddToCart,
    classNameButtonSubmit,
    classNameButtonsSubmitContainer,
    btnNameAddToCart = 'Add To Cart',
    loading,
    onAddToCart,
    onBuyNow,
    onGetQuote,
    product,
    productFormId,
    hidePaymentUpfrontButton,
    hideRequestQuotationButton,
  } = useMerchiFormContext();
  const isSupplierMOD = isProductSupplierMOD(product);
  const { allowPaymentUpfront, allowQuotation } = product;
  return (
    <>
      {!productFormId && (
        <div className={classNameButtonsSubmitContainer}>
          {isSupplierMOD ? (
            <button className={classNameButtonSubmit} onClick={onGetQuote}>
              Request Customisation
            </button>
          ) : (
            <>
              {!!(allowAddToCart && onAddToCart) && (
                <ButtonProductSubmit
                  onClick={onAddToCart}
                  text={btnNameAddToCart}
                />
              )}
              {!!(
                allowPaymentUpfront &&
                !hidePaymentUpfrontButton &&
                onBuyNow
              ) && <ButtonProductSubmit onClick={onBuyNow} text='Buy Now' />}
              {!!(
                allowQuotation &&
                !hideRequestQuotationButton &&
                onGetQuote
              ) && (
                <button
                  disabled={loading}
                  className={classNameButtonSubmit}
                  onClick={onGetQuote}
                >
                  {loading ? 'Loading...' : 'Get Quote'}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}

export default ProductButtonsSubmit;
