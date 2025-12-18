'use client';
import * as React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useMerchiFormContext } from '../../context/MerchiProductFormProvider';

interface Props {
  count: number;
  disabled?: boolean;
  remove: () => void;
}

function ButtonRemoveGroup({ count, disabled, remove }: Props) {
  const { classNameButtonGroupRemove } = useMerchiFormContext();
  return (
    <button
      className={`${classNameButtonGroupRemove} merchi-embed-form_product-group-button-remove`}
      onClick={remove}
      disabled={disabled}
    >
      <FaTrash /> {`Group (${count})`}
    </button>
  );
}

export default ButtonRemoveGroup;
