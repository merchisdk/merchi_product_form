'use client';
import * as React from 'react';
import { useController } from 'react-hook-form';
import VariationError from './VariationError';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';

interface Props {
  count: number;
  disabled?: boolean;
  name: string;
}

function InputGroupQuantity({ count, disabled, name }: Props) {
  const inputId = `merchi-group-qty-${count}`;
  const {
    classNameInputContainer,
    classNameInput,
    control,
    getQuote,
    product,
  } = useMerchiFormContext();
  const { minimum, minimumPerGroup } = product;
  const validators: any = {
    positive: (value: any) => parseInt(value) > 0,
    required: {
      value: true,
      message: 'Quantity is required',
    },
    valueAsNumber: true,
  };
  if (minimum && minimumPerGroup) {
    validators.min = {
      value: minimum,
      message: `Group quantity can not be less than ${minimum}`,
    };
  }
  const { field } = useController({
    name: name,
    control,
    rules: validators,
  });
  return (
    <div className={classNameInputContainer}>
      <label htmlFor={inputId}>Group ({count}) quantity</label>
      <input
        id={inputId}
        disabled={disabled}
        min='0'
        type='number'
        className={classNameInput}
        {...field}
        onChange={(e: any) => {
          field.onChange(e);
          getQuote();
        }}
      />
      <VariationError name={name} />
    </div>
  );
}

export default InputGroupQuantity;
