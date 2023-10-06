import * as React from 'react';
import Tooltip from '../Tooltip';
import { useMerchiFormContext } from '../MerchiProductFormProvider';

interface Props {
  onClick: () => void;
  text: string;
}

function ButtonProductSubmit({ onClick, text }: Props) {
  const {
    classNameButtonSubmit = 'btn btn-primary merchi-embed-form_button-submit w-100',
    job,
    loading,
    product,
  } = useMerchiFormContext();
  const { needsInventory, inventoriesOpen } = product;
  const { inventorySufficient } = job;
  return needsInventory && !inventoriesOpen && !inventorySufficient ? (
    <Tooltip tooltip='Insufficient inventory'>
      <button className={classNameButtonSubmit} disabled={true}>
        {text}
      </button>
    </Tooltip>
  ) : (
    <button
      className={classNameButtonSubmit}
      disabled={loading}
      onClick={onClick}
    >
      {loading ? 'Loading...' : text}
    </button>
  );
}

export default ButtonProductSubmit;
