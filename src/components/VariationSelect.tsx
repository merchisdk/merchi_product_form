'use client';
import * as React from 'react';
import { useController } from 'react-hook-form';
import VariationError from './VariationError';
import VariationLabel from './VariationLabel';
import { sortByPosition, variationCostDetail } from './utils';
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
    fieldState: { invalid },
  } = useController({
    name: `${name}.value`,
    control,
  });

  const { selectableOptions = [] } = variation;

  const validationClass = invalid ? 'is-invalid' : '';

  function isActive(option: any) {
    return option.available && option.isVisible;
  }
  return (
    <div className={`${classNameInputContainer} merchi-input-select-container`}>
      <VariationLabel
        variationClassName='merchi-embed-form_input-select'
        variation={variation}
      />
      <select
        {...field}
        disabled={disabled}
        className={`${classNameInput} ${validationClass}`}
        onChange={(e) => {
          field.onChange(e); // Ensure the original onChange is called
          getQuote();
        }}
      >
        {sortByPosition(selectableOptions).map((option: any, index: number) => (
          <option
            value={option.optionId}
            disabled={!isActive(option)}
            key={`variation-option-${option.optionId}`}
          >
            {option.value}
            {!option.isVisible ? ' - disabled' : !option.available ? ' - insufficient stock' : ''}
            {!hideCost && variationCostDetail(option)}
          </option>
        ))}
      </select>
      <VariationError name={name} />
    </div>
  );
};

export default VariationSelect;
