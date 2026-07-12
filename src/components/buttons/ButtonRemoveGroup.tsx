'use client';
import * as React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useMerchiFormContext } from '../../context/MerchiProductFormProvider';
import { quoteAfterMutation } from '../quoteAfterFieldChange';

interface Props {
  count: number;
  disabled?: boolean;
  remove: () => void;
}

function ButtonRemoveGroup({ count, disabled, remove }: Props) {
  const { classNameButtonGroupRemove, getQuote } = useMerchiFormContext();
  return (
    <button
      className={`${classNameButtonGroupRemove} merchi-embed-form_product-group-button-remove`}
      onClick={() => quoteAfterMutation(remove, getQuote)}
      disabled={disabled}
    >
      <FaTrash /> {`Group (${count})`}
    </button>
  );
}

export default ButtonRemoveGroup;
