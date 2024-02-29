import * as React from 'react';
import TooltipElement from '../TooltipElement';
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
    <TooltipElement
      id={`merchi-submit-job-button-${product.id}`}
      tooltip='Insufficient inventory'
    >
      <button className={classNameButtonSubmit} disabled={true}>
        {text}
      </button>
    </TooltipElement>
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
