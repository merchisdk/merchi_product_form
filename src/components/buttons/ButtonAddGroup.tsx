'use client';
import * as React from 'react';
import { CgSpinner } from 'react-icons/cg';
import { FaPlus } from 'react-icons/fa';

import { useMerchiFormContext } from '../../context/MerchiProductFormProvider';
import { buildEmptyVariationGroup } from '../utils';

interface Props {
  addGroup: (newGroup: any) => void;
  disabled?: boolean;
}

function ButtonAddGroup({ addGroup, disabled }: Props) {
  const {
    classNameButtonGroupAdd,
    getQuote,
    loading,
    product,
  } = useMerchiFormContext();
  return (
    <button
      className={`${classNameButtonGroupAdd} merchi-embed-form_product-group-button-add-group`}
      color='white'
      onClick={() => {
        const newGroup = buildEmptyVariationGroup(product);
        addGroup(newGroup);
        getQuote();
      }}
      disabled={loading || disabled}
    >
      {loading ? (
        <CgSpinner fontSize='1rem' className='animate_spin mr-1' />
      ) : (
        <FaPlus fontSize='1rem' className='mr-1' />
      )}
      New group
    </button>
  );
}

export default ButtonAddGroup;
