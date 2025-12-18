'use client';
import * as React from 'react';
import { supplierSellerEditableProductTypes } from './utils';
import { FaClipboardCheck } from 'react-icons/fa';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';

function isTrue(value: any) {
  return [true, 'true'].includes(value);
}

interface Props {
  variationField: any;
}

function AlertVariationSellerEditable({ variationField }: Props) {
  const { classNameAlertSellerEditable,  product } = useMerchiFormContext();
  const { productType } = product;
  const { sellerProductEditable } = variationField;
  const show = isTrue(sellerProductEditable) && productType === undefined ||
  productType && isTrue(sellerProductEditable) && supplierSellerEditableProductTypes.
      includes(Number(productType));
  return (
    show ?
      <div
        className={classNameAlertSellerEditable}
        style={{display: 'flex', fontSize: 18, fontWeight: 600, justifyContent: 'space-between'}}
      >
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <div
            style={{
              marginRight: '1rem',
            }}
          >
            <FaClipboardCheck size={32} />
          </div>
          <div>
            Select variation options you would like
            to offer your customers on your product.
          </div>
        </div>
      </div> : <></>
  );
}

export default AlertVariationSellerEditable;
