import * as React from 'react';
import { variationCostDetail } from './utils';
import VariationFieldNameAndCostInputs from './VariationFieldNameAndCostInputs';
import { useMerchiFormContext } from './MerchiProductFormProvider';
import { CgSpinner } from 'react-icons/cg';
import VariationFieldInputInstructions from './VariationFieldInputInstructions';

interface Props {
  forceHideCost?: boolean;
  name: string;
  variation: any;
  variationClassName?: string;
}

function VariationLabel({
  forceHideCost,
  name,
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
          className={`align-items-center flex-wrap gap-1${variationClassName ? variationClassName + '-title' : ''
            }`}
        >
          {`${variationField!.name} `}
          {hideCost || forceHideCost ? (
            ''
          ) : hasExtraCost && !sellerProductEditable ? (
            <span className='merchi-embed-form_variation-cost-detail'>
              {variationCostDetail(variation)}
            </span>
          ) : (
            ''
          )}
        </div>
        <VariationFieldNameAndCostInputs name={name} variation={variation} />
      </div>
      {instructions && <VariationFieldInputInstructions instructions={instructions} />}
    </>
  );
}

export default VariationLabel;
