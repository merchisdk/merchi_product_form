'use client';
import TooltipElement from './TooltipElement';
import { variationFieldOptionCostDetail } from './utils';
import VariationFieldOptionDefaultInputs from './VariationFieldOptionDefaultInputs';
import IconCheckedOrNoStock from './icons/IconCheckedOrNoStock';
import { useMerchiFormContext } from './MerchiProductFormProvider';

interface Props {
  doClick: () => void;
  isAvailable: boolean;
  isChecked: boolean;
  name: string;
  option: any;
  sellerProductEditable?: boolean;
}

function VariationOptionColour({
  doClick,
  isAvailable = true,
  isChecked,
  name,
  option,
  sellerProductEditable,
}: Props) {
  const {
    classNameOptionColour,
    classNameOptionColourContainer,
  } = useMerchiFormContext();
  const { colour: color, value } = option;
  const containerClass = `merchi-embed-form_color-select-option ${
    isChecked ? 'image-checked' : ''
  } ${isAvailable ? 'cursor-pointer' : 'option-no-inventory'}`;
  const optionCost = variationFieldOptionCostDetail(option);
  return (
    <div
      className={classNameOptionColourContainer}
      onClick={isAvailable ? doClick : undefined}
    >
      <div className={containerClass}>
        <IconCheckedOrNoStock isChecked={isChecked} noStock={!isAvailable} />
        <div
          className={classNameOptionColour}
          style={{ backgroundColor: color }}
        />
      </div>
      <TooltipElement
        tooltip={
          String(value) + `${!isAvailable ? ' - insufficient stock' : ''}`
        }
      >
        <p className='merchi-embed-form_color-select-description'>{value}</p>
      </TooltipElement>
      {sellerProductEditable && <small className='d-block'>{optionCost}</small>}
      <VariationFieldOptionDefaultInputs optionName={name} option={option} />
    </div>
  );
}

export default VariationOptionColour;
