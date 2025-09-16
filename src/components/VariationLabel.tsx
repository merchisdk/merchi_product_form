import * as React from 'react';
import { variationCostDetail } from './utils';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';
import { CgSpinner } from 'react-icons/cg';
import VariationFieldInputInstructions from './VariationFieldInputInstructions';

interface Props {
  forceHideCost?: boolean;
  variation: any;
  variationClassName?: string;
}

function VariationLabel({
  forceHideCost,
  variation = {},
  variationClassName,
}: Props) {
  const { cost, variationField, onceOffCost, unitCost } = variation;
  const { instructions, sellerProductEditable } = variationField;
  const { hideCost, loading } = useMerchiFormContext();
  const hasExtraCost = onceOffCost || unitCost;
  return (
    <>
      <div
        className={`d-flex align-items-center mb-1 ${variationClassName || ''}`}
      >
        <div
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          className={`align-items-center flex-wrap gap-1${variationClassName ? variationClassName + '-title' : ''
            }`}
        >
          {`${variationField?.name ?? ''} `}
          {loading && cost ? (
            <CgSpinner fontSize='1.25rem' className='animate_spin ml-1' />
          ) : hideCost || forceHideCost ? (
            ''
          ) : hasExtraCost && !sellerProductEditable ? (
            <span className='merchi-embed-form_variation-cost-detail'>
              {variationCostDetail(variation)}
            </span>
          ) : (
            ''
          )}
        </div>
      </div>
      {instructions && (
        <VariationFieldInputInstructions instructions={instructions} />
      )}
    </>
  );
}

export default VariationLabel;
