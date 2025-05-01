'use client';
import * as React from 'react';
import { useController } from 'react-hook-form';
import VariationError from './VariationError';
import VariationLabel from './VariationLabel';
import VariationFieldOptionDefaultInputs from './VariationFieldOptionDefaultInputs';
import { variationCostDetail } from './utils';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';

interface Props {
  disabled?: boolean;
  name: string;
  variation: any;
}

const VariationSelect: React.FC<Props> = ({ disabled, name, variation }) => {
  const {
    classNameInputContainer,
    classNameInput,
    control,
    hideCost,
    getQuote,
  } = useMerchiFormContext();

  const {
    field,
    fieldState: { invalid, error },
  } = useController({
    name: `${name}.value`,
    control,
  });

  const { selectableOptions = [], variationField } = variation;
  const { options = [] } = variationField;

  const optionAvailable = (index: number) => {
    return selectableOptions[index] ? selectableOptions[index].available : true;
  };

  const validationClass = invalid ? 'is-invalid' : '';

  return (
    <div className={`${classNameInputContainer} merchi-input-select-container`}>
      <VariationLabel
        variationClassName='merchi-embed-form_input-select'
        name={name}
        variation={variation}
      />
      {options.map((option: any, index: number) => (
        <span key={`${name}-select-option-values-${index}`}>
          <VariationFieldOptionDefaultInputs
            option={option}
            optionName={`${name}.variationField.options[${index}]`}
          />
        </span>
      ))}
      <select
        {...field}
        disabled={disabled}
        className={`${classNameInput} ${validationClass}`}
        onChange={(e) => {
          field.onChange(e); // Ensure the original onChange is called
          getQuote();
        }}
      >
        {options.map((option: any, index: number) => (
          <option
            value={option.id}
            disabled={!optionAvailable(index)}
            key={`variation-option-${option.id}`}
          >
            {option.value}
            {!optionAvailable(index) ? ' - insufficient stock' : ''}
            {!hideCost &&
              selectableOptions[index] &&
              variationCostDetail(selectableOptions[index])}
          </option>
        ))}
      </select>
      <VariationError name={name} />
    </div>
  );
};

export default VariationSelect;
