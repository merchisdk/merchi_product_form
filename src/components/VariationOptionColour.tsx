'use client';
import * as React from 'react';
import TooltipElement from './TooltipElement';
import { variationFieldOptionCostDetail } from './utils';
import IconCheckedOrNoStock from './icons/IconCheckedOrNoStock';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';

interface Props {
  doClick: () => void;
  isChecked: boolean;
  option: any;
  sellerProductEditable?: boolean;
}

function VariationOptionColour({
  doClick,
  isChecked,
  option,
  sellerProductEditable,
}: Props) {
  const {
    classNameOptionColour,
    classNameOptionColourContainer,
  } = useMerchiFormContext();
  const { available, colour: color, isVisible, optionId, value } = option;
  const isActive = available && isVisible;
  const optionCost = variationFieldOptionCostDetail(option);
  return (
    <div
      className={classNameOptionColourContainer}
      onClick={isActive ? doClick : undefined}
    >
      <div
        className={`${classNameOptionColour} ${isChecked ? 'image-checked' : ''} ${isActive ? 'cursor-pointer' : 'option-no-inventory'}`}
        style={{ backgroundColor: color }}
      >
        <IconCheckedOrNoStock isChecked={isChecked} noStock={!isActive} />
      </div>
      <TooltipElement
        id={`variation-option-${optionId}-tooltip`}
        tooltip={`${value}${!isVisible ? ' - disabled' : !available ? ' - insufficient stock' : ''}`}
      >
        <p className='merchi-embed-form_color-select-description'>{value}</p>
      </TooltipElement>
      {sellerProductEditable && <small className='d-block'>{optionCost}</small>}
    </div>
  );
}

export default VariationOptionColour;
