'use client';
import { useController } from 'react-hook-form';
import VariationError from './VariationError';
import VariationLabel from './VariationLabel';
import { useMerchiFormContext } from './MerchiProductFormProvider';

const validationParams = (variationField: any) => {
  const { name, fieldMax: max, fieldMin: min, required } = variationField;
  return {
    max: { value: max, message: `${name} cannot be more than ${max}` },
    min: { value: min, message: `${name} cannot be less than ${min}` },
    required: { value: required, message: `${name} is required` }
  };
};

interface Props {
  disabled?: boolean;
  inputType?: string;
  name: string;
  variation: any;
}

const VariationInput: React.FC<Props> = ({
  disabled,
  inputType = 'text',
  name,
  variation,
}) => {
  const {
    classNameInputContainer,
    classNameInput,
    control,
  } = useMerchiFormContext();
  const {
    field,
    fieldState: { invalid, error }
  } = useController({
    name: name, 
    control, 
    rules: validationParams(variation.variationField)
  });

  console.log('Log - Field from useController:', field);

  const { value, variationField } = variation;
  console.log('Log - Value: ', value);
  console.log('Log - Type of Value: ', typeof value);

  const validationClass = invalid ? 'is-invalid' : '';
  return (
    <div className={`${classNameInputContainer} merchi-input-${inputType}-container`}>
      <VariationLabel
        variationClassName={`merchi-input-${inputType}`}
        name={name}
        variation={variation}
      />
      {inputType === 'textarea' ? (
        <textarea
          defaultValue={value}
          disabled={disabled}
          className={`${classNameInput} ${validationClass}`}
          rows={variationField.rows}
          placeholder={variationField.placeholder}
          {...field}
        />
      ) : (
        <input
          defaultValue={value}
          disabled={disabled}
          type={inputType}
          className={`${classNameInput} ${validationClass}`}
          placeholder={variationField.placeholder}
          {...field}
        />
      )}
      <VariationError name={name} />
    </div>
  );
};

interface InputProps {
  disabled?: boolean;
  name: string;
  variation: any;
}

export const VariationInputCoulourPicker = (props: InputProps) => <VariationInput inputType='color' {...props} />;
export const VariationInputText = (props: InputProps) => <VariationInput inputType='text' {...props} />;
export const VariationInputNumber = (props: InputProps) => <VariationInput inputType='number' {...props} />;
export const VariationInputTextarea = (props: InputProps) => <VariationInput inputType='textarea' {...props} />;
