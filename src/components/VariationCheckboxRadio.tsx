'use client';
import * as React from 'react';
import VariationCheckBoxOrRadioOption from './VariationCheckBoxOrRadioOption';
import VariationError from './VariationError';
import VariationLabel from './VariationLabel';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';
import { sortByPosition } from './utils';

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

  const { selectableOptions = [] } = variation;

  return (
    <div
      className={`${classNameOptionsCheckboxRadioContainer} merchi-embed-form_checkbox_radio-container`}
    >
      <VariationLabel
        forceHideCost={true}
        variationClassName={`merchi-embed-form_input-${
          inputType === 'checkbox' ? 'checkbox' : 'radio'
        }`}
        variation={variation}
      />
      <div className='merchi-embed-form_checkbox_radio-item-container'>
        {sortByPosition(selectableOptions).map((option: any, index: number) => (
          <VariationCheckBoxOrRadioOption
            disabled={disabled}
            inputType={inputType}
            key={`variation-option-${name}-${option.optionId}`}
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
