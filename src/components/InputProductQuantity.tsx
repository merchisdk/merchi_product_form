'use client';
import { useController } from 'react-hook-form';
import ProductUnitPrice from './ProductUnitPrice';
import VariationError from './VariationError';
import { useMerchiFormContext } from './MerchiProductFormProvider';

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
    product,
  } = useMerchiFormContext();
  const { groupVariationFields, minimum } = product;
  const validators: any = {
    positive: (value: any) => parseInt(value) > 0,
    required: {
      value: true,
      message: 'Quantity is required',
    },
    valueAsNumber: true,
  };
  if (minimum) {
    validators.min = {
      value: minimum,
      message: `${product.name} can not be less than ${minimum}`,
    };
  }
  const { field } = useController({
    name: name,
    control,
    rules: validators,
  });
  return (
    <div className={classNameInputContainer}>
      <div className={classNameQuantityLabelContainer}>
        <div>
          <span>Quantity</span>{' '}
          <small>
            <ProductUnitPrice /> {minimum > 1 && `(MOQ of ${minimum})`}
          </small>
        </div>
      </div>
      {groupVariationFields && groupVariationFields.length ? (
        <div>{job.quantity}</div>
      ) : (
        <input
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
      )}
      <VariationError name={name} />
    </div>
  );
}

export default InputProductQuantity;
