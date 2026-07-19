'use client';
import * as React from 'react';
import { useController } from 'react-hook-form';
import ProductUnitPrice from './ProductUnitPrice';
import VariationError from './VariationError';
import { productMoqFloor, productMinimumQuantity } from '../utils/quantity';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';

interface Props {
  disabled?: boolean;
  name?: string;
}

function InputProductQuantity({ disabled, name = 'quantity' }: Props) {
  const {
    classNameInputContainer,
    classNameInput,
    classNameQuantityLabelContainer,
    job,
    control,
    getQuote,
    hookForm,
    product,
  } = useMerchiFormContext();
  const { groupVariationFields } = product;
  const moq = productMinimumQuantity(product);
  const minQuantity = productMoqFloor(product);
  const validators: any = {
    required: {
      value: true,
      message: 'Quantity is required',
    },
    valueAsNumber: true,
    min: {
      value: minQuantity,
      message:
        moq > 1
          ? `${product.name} can not be less than ${moq}`
          : 'Quantity must be at least 1',
    },
    validate: {
      positive: (value: any) => {
        const n = typeof value === 'number' ? value : parseInt(value, 10);
        if (!Number.isFinite(n) || n < minQuantity) {
          return moq > 1
            ? `${product.name} can not be less than ${moq}`
            : 'Quantity must be at least 1';
        }
        return true;
      },
    },
  };
  const inputId = `merchi-qty-${name}`;
  const { field, fieldState } = useController({
    name: name,
    control,
    rules: validators,
  });
  return (
    <div className={classNameInputContainer}>
      <div className={classNameQuantityLabelContainer}>
        <div>
          <label htmlFor={inputId} style={{ display: 'inline' }}>Quantity</label>{' '}
          <small>
            <ProductUnitPrice /> {moq > 1 && `(MOQ of ${moq})`}
          </small>
        </div>
      </div>
      {groupVariationFields && groupVariationFields.length ? (
        <div>{job.quantity}</div>
      ) : (
        <input
          id={inputId}
          disabled={disabled}
          min={minQuantity}
          type='number'
          className={classNameInput}
          aria-invalid={fieldState.invalid || undefined}
          {...field}
          onChange={(e: any) => {
            field.onChange(e);
            hookForm.trigger(name);
            getQuote();
          }}
          onBlur={() => {
            field.onBlur();
            hookForm.trigger(name);
          }}
        />
      )}
      <VariationError name={name} />
    </div>
  );
}

export default InputProductQuantity;
