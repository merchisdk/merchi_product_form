import * as React from 'react';
import { useWatch } from 'react-hook-form';
import { variationCostDetail } from './utils';
import { estimateAreaCosts } from '../utils/area';
import { costsFromSelectedOptions } from '../utils/selectedVariationCosts';
import { FieldType } from '../utils/types';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';
import { CgSpinner } from 'react-icons/cg';
import VariationFieldInputInstructions from './VariationFieldInputInstructions';

interface Props {
  forceHideCost?: boolean;
  name?: string;
  variation: any;
  variationClassName?: string;
  /** Live field value shown beside the name (e.g. Area dimensions). */
  valueSummary?: string | null;
}

function VariationLabel({
  forceHideCost,
  name,
  variation = {},
  variationClassName,
  valueSummary,
}: Props) {
  const { cost, variationField = {} } = variation;
  const { instructions, sellerProductEditable } = variationField;
  const { control, hideCost, loading } = useMerchiFormContext();
  const watchedValue = useWatch({
    control,
    name: name ? `${name}.value` : 'value',
    disabled: !name,
  });
  const watchedSelectedOptions = useWatch({
    control,
    name: name ? `${name}.selectedOptions` : 'selectedOptions',
    disabled: !name,
  });
  const variationForCosts = {
    ...variation,
    selectedOptions: watchedSelectedOptions ?? variation.selectedOptions,
  };
  const liveValue = name ? watchedValue : variation.value;
  const areaCosts =
    Number(variationField?.fieldType) === FieldType.AREA
      ? estimateAreaCosts(variationField, liveValue)
      : null;
  const costSource = areaCosts
    ? {
        ...variationForCosts,
        onceOffCost: areaCosts.onceOffCost,
        unitCost: areaCosts.unitCost,
        currency: variationField?.currency || variation.currency,
      }
    : {
        ...variationForCosts,
        ...costsFromSelectedOptions(variationForCosts, liveValue),
      };
  const { onceOffCost, unitCost } = costSource;
  const hasExtraCost = Number(onceOffCost) > 0 || Number(unitCost) > 0;
  return (
    <>
      <div
        className={`d-flex align-items-center mb-1 ${variationClassName || ''}`}
      >
        <div
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}
          className={`align-items-center flex-wrap gap-1${variationClassName ? variationClassName + '-title' : ''
            }`}
        >
          {`${variationField?.name ?? ''} `}
          {valueSummary ? (
            <span className='merchi-embed-form_variation-value-summary text-muted'>
              {valueSummary}
            </span>
          ) : null}
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
