'use client';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { splitSelectedOptions, variationFieldOptionCostDetail } from './utils';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';

interface Props {
  disabled?: boolean;
  inputType?: string;
  name: string;
  option: any;
  variation: any;
}

function VariationCheckBoxOrRadioOption({
  disabled,
  inputType,
  name,
  option,
  variation,
}: Props) {
  const {
    classNameOptionContainer,
    classNameOptionInput,
    classNameOptionLabel,
    classNameOptionSuper,
    getQuote,
    control, // Newly added from the context
  } = useMerchiFormContext();
  const { field } = useController({
    name: `${name}.value`,
    control,
  });
  const { variationField } = variation;
  const { sellerProductEditable } = variationField;
  const { available, isVisible, optionId, value } = option;
  const optionCost = variationFieldOptionCostDetail(option);
  const statusText = !isVisible ? ' - disabled' : !available ? ' - insufficient stock' : '';
  const outOfStockOrCost = statusText || optionCost;
  const activeIds = splitSelectedOptions(field.value).map(String).filter(Boolean);
  const isActive = activeIds.includes(String(optionId));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let updatedIds = [...activeIds];

    if (sellerProductEditable || inputType === 'checkbox') {
      // Checkbox Logic
      if (e.target.checked && !updatedIds.includes(String(optionId))) {
        updatedIds.push(String(optionId));
      } else if (!e.target.checked) {
        updatedIds = updatedIds.filter(
          (existingId) => existingId !== String(optionId)
        );
      }
    } else if (inputType === 'radio') {
      // Radio Logic
      updatedIds = [String(optionId)];
    }

    field.onChange(updatedIds.filter(Boolean).join(','));

    getQuote();
  };
  const optionInputId = `merchi-opt-${optionId}`;
  return (
    <div className={classNameOptionContainer}>
      <input
        id={optionInputId}
        className={classNameOptionInput}
        checked={isActive}
        type={sellerProductEditable ? 'checkbox' : inputType}
        disabled={disabled || !available || !isVisible}
        value={optionId}
        name={`${name}.value`}
        onChange={handleChange}
      />
      <label htmlFor={optionInputId} className={classNameOptionLabel}>{value}</label>
      {outOfStockOrCost && (
        <span className={classNameOptionSuper}>
          {statusText} {optionCost}
        </span>
      )}
    </div>
  );
}

export default VariationCheckBoxOrRadioOption;
