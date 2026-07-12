import * as React from 'react';
import { useWatch } from 'react-hook-form';
import { variationCostDetail } from './utils';
import { costsFromSelectedOptions } from '../utils/selectedVariationCosts';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';
import { CgSpinner } from 'react-icons/cg';
import VariationFieldInputInstructions from './VariationFieldInputInstructions';

interface Props {
  forceHideCost?: boolean;
  name?: string;
  variation: any;
  variationClassName?: string;
}

function VariationLabel({
  forceHideCost,
  name,
  variation = {},
  variationClassName,
}: Props) {
  const { cost, variationField = {} } = variation;
  const { instructions, sellerProductEditable } = variationField;
  const { control, hideCost, loading } = useMerchiFormContext();
  const watchedValue = useWatch({
    control,
    name: name ? `${name}.value` : 'value',
    disabled: !name,
  });
  const costSource = {
    ...variation,
    ...costsFromSelectedOptions(
      variation,
      name ? watchedValue : variation.value
    ),
  };
  const { onceOffCost, unitCost } = costSource;
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
              {variationCostDetail(costSource)}
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
