'use client';
import * as React from 'react';
import { useController } from 'react-hook-form';
import VariationError from './VariationError';
import {
  enforceMoqPerGroup,
  productMinimumQuantity,
  productMoqFloor,
} from '../utils/quantity';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';

interface Props {
  count: number;
  disabled?: boolean;
  name: string;
}

function parseGroupIndex(fieldName: string): number {
  const match = fieldName.match(/variationsGroups\[(\d+)\]/);
  return match ? Number(match[1]) : -1;
}

function InputGroupQuantity({ count, disabled, name }: Props) {
  const inputId = `merchi-group-qty-${count}`;
  const {
    classNameInputContainer,
    classNameInput,
    control,
    getQuote,
    hookForm,
    product,
  } = useMerchiFormContext();
  const moq = productMinimumQuantity(product);
  const moqPerGroup = enforceMoqPerGroup(product);
  const minGroupQuantity = moqPerGroup ? productMoqFloor(product) : 1;
  const validators: any = {
    required: {
      value: true,
      message: 'Quantity is required',
    },
    valueAsNumber: true,
    min: {
      value: minGroupQuantity,
      message:
        moqPerGroup && moq > 1
          ? `Group quantity can not be less than ${moq}`
          : 'Group quantity must be at least 1',
    },
    validate: {
      positive: (value: any) => {
        const n = typeof value === 'number' ? value : parseInt(value, 10);
        if (!Number.isFinite(n) || n < minGroupQuantity) {
          return moqPerGroup && moq > 1
            ? `Group quantity can not be less than ${moq}`
            : 'Group quantity must be at least 1';
        }
        return true;
      },
      totalMoq: (value: any) => {
        // When MOQ is per order (not per group), the sum of all group
        // quantities must meet the product minimum.
        if (moqPerGroup || moq <= 1) return true;
        const groups = hookForm.getValues('variationsGroups') || [];
        const index = parseGroupIndex(name);
        const current = typeof value === 'number' ? value : Number(value);
        const total = groups.reduce((sum: number, group: any, i: number) => {
          const q =
            i === index ? current : Number(group?.quantity);
          return sum + (Number.isFinite(q) ? q : 0);
        }, 0);
        if (total < moq) {
          return `${product.name || 'Product'} requires a total quantity of at least ${moq}`;
        }
        return true;
      },
    },
  };
  const { field, fieldState } = useController({
    name: name,
    control,
    rules: validators,
  });

  const revalidateQuantity = () => {
    if (!moqPerGroup && moq > 1) {
      const groups = hookForm.getValues('variationsGroups') || [];
      return hookForm.trigger(
        groups.map(
          (_: any, i: number) => `variationsGroups[${i}].quantity`
        )
      );
    }
    return hookForm.trigger(name);
  };

  return (
    <div className={classNameInputContainer}>
      <label htmlFor={inputId}>
        Group ({count}) quantity
        {moqPerGroup && moq > 1 ? (
          <small>{` (MOQ of ${moq})`}</small>
        ) : null}
      </label>
      <input
        id={inputId}
        disabled={disabled}
        min={minGroupQuantity}
        type='number'
        className={classNameInput}
        aria-invalid={fieldState.invalid || undefined}
        {...field}
        onChange={(e: any) => {
          field.onChange(e);
          revalidateQuantity();
          getQuote();
        }}
        onBlur={() => {
          field.onBlur();
          revalidateQuantity();
        }}
      />
      <VariationError name={name} />
    </div>
  );
}

export default InputGroupQuantity;
