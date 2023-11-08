import * as React from 'react';
import { currencyTotalCostShowIncTax } from './currency';
import { CgSpinner } from 'react-icons/cg';
import { useMerchiFormContext } from './MerchiProductFormProvider';
import { isProductSupplierMOD } from './utils';

function ProductTotalCost() {
  const {
    classNameProductTotal,
    classNameProductTotalContainer,
    isCartItem = false,
    job,
    loading,
    product,
  } = useMerchiFormContext();
  const isSupplierMOD = isProductSupplierMOD(product);
  const needsShipping = Boolean(job && job.needsShipping);

  function Cost({ cost, showShipping }: any) {
    return (
      <>
        <strong className='mb-0'>Total</strong>
        {loading ? (
          <div style={{ height: '52px' }}>
            <CgSpinner fontSize='1.25rem' className='animate_spin ml-1' />
          </div>
        ) : cost !== null && cost !== undefined ? (
          <div
            style={{ display: 'flex', flexDirection: 'column', height: '52px' }}
          >
            <strong>{currencyTotalCostShowIncTax(job)}</strong>
            {isSupplierMOD && <small>approximate</small>}
            {Boolean(!loading && showShipping) && <small>+ shipping</small>}
          </div>
        ) : null}
      </>
    );
  }

  return (
    <div className={classNameProductTotalContainer}>
      <div
        style={{
          width: '100%',
          borderBottom: '1px solid #fff',
          borderTop: '1px solid rgb(227, 228, 247)',
          height: 0,
        }}
      />
      <div
        className={classNameProductTotal}
        style={{
          flex: '1 1 auto',
          textAlign: 'right',
        }}
      >
        {isCartItem ? (
          <Cost cost={job.totalCost} />
        ) : (
          <Cost cost={job.totalCost} showShipping={needsShipping} />
        )}
      </div>
    </div>
  );
}

export default ProductTotalCost;
