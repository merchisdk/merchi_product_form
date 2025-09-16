'use client';
import * as React from 'react';
import TooltipElement from './TooltipElement';
import { optionImageUrl, variationFieldOptionCostDetail } from './utils';
import IconCheckedOrNoStock from './icons/IconCheckedOrNoStock';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';

interface Props {
  doClick: () => void;
  isChecked: boolean;
  option: any;
  sellerProductEditable?: boolean;
}

function VariationOptionImage({
  doClick,
  isChecked,
  option,
  sellerProductEditable,
}: Props) {
  const {
    classNameOptionImage,
    classNameOptionImageContainer,
  } = useMerchiFormContext();
  const { available, isVisible, optionId } = option;
  const isActive = available && isVisible;
  const containerClass = `merchi-embed-form_image-select-option-item ${
    isChecked ? 'image-checked' : ''
  } ${isActive ? 'cursor-pointer' : 'option-no-inventory'}`;
  const optionCost = variationFieldOptionCostDetail(option);
  const tooltip = `${option.value}${!isVisible ? ' - disabled' : !available ? ' - insufficient stock' : ''}`;
  return (
    <div
      className={classNameOptionImageContainer}
      onClick={isActive ? doClick : undefined}
    >
      <div className={containerClass}>
        <IconCheckedOrNoStock isChecked={isChecked} noStock={!isActive} />
        <span
          className={classNameOptionImage}
          style={{
            backgroundImage: `url(${optionImageUrl(option)})`,
          }}
        />
        <TooltipElement
          id={`merchi-image-option-tooltip-${optionId}`}
          tooltip={tooltip}
        >
          <div className='image-select-title'>{option.value}</div>
        </TooltipElement>
        {sellerProductEditable && (
          <small className='d-block'>{optionCost}</small>
        )}
      </div>
    </div>
  );
}

export default VariationOptionImage;
