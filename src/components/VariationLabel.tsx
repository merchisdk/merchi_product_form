import * as React from 'react';
import { variationCostDetail } from './utils';
import VariationFieldNameAndCostInputs from './VariationFieldNameAndCostInputs';
import { useMerchiFormContext } from './MerchiProductFormProvider';
import { CgSpinner } from 'react-icons/cg';

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
  const { sellerProductEditable } = variationField;
  const { hideCost, loading } = useMerchiFormContext();
  const hasExtraCost = onceOffCost || unitCost;
  return (
    <div
      className={`d-flex align-items-center mb-1 ${variationClassName || ''}`}
    >
      <div
        className={`align-items-center flex-wrap gap-1${
          variationClassName ? variationClassName + '-title' : ''
        }`}
      >
        {`${variationField!.name} `}
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
      <VariationFieldNameAndCostInputs name={name} variation={variation} />
    </div>
  );
}

export default VariationLabel;
