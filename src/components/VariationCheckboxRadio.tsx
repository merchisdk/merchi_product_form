'use client';
import * as React from 'react';
import VariationCheckBoxOrRadioOption from './VariationCheckBoxOrRadioOption';
import VariationError from './VariationError';
import VariationLabel from './VariationLabel';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';

interface Props {
  disabled?: boolean;
  inputType?: string;
  name: string;
  variation: any;
}

export const VariationCheckboxRadio: React.FC<Props> = ({
  disabled,
  inputType,
  name,
  variation,
}) => {
  const { classNameOptionsCheckboxRadioContainer} = useMerchiFormContext();

  const { selectableOptions = [], variationField } = variation;
  const { options = [] } = variationField;

  const optionAvailable = (index: number) => {
    return selectableOptions[index] ? selectableOptions[index].available : true;
  };

  return (
    <div
      className={`${classNameOptionsCheckboxRadioContainer} merchi-embed-form_checkbox_radio-container`}
    >
      <VariationLabel
        forceHideCost={true}
        variationClassName={`merchi-embed-form_input-${
          inputType === 'checkbox' ? 'checkbox' : 'radio'
        }`}
        name={name}
        variation={variation}
      />
      <div className='merchi-embed-form_checkbox_radio-item-container'>
        {options.map((option: any, index: number) => (
          <VariationCheckBoxOrRadioOption
            disabled={disabled}
            index={index}
            inputType={inputType}
            isAvailable={optionAvailable(index)}
            key={`variation-option-${name}-${index}`}
            name={name}
            option={option}
            variation={variation}
          />
        ))}
      </div>
      <VariationError name={name} />
    </div>
  );
};

interface FieldProps {
  disabled?: boolean;
  inputType?: string;
  name: string;
  variation: any;
}

export const VariationCheckbox = (props: FieldProps) => (
  <VariationCheckboxRadio {...props} inputType='checkbox' />
);
export const VariationRadio = (props: FieldProps) => (
  <VariationCheckboxRadio {...props} inputType='radio' />
);
