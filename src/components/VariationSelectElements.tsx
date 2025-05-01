'use client';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { isBoolean } from 'lodash';
import VariationOptionColour from './VariationOptionColour';
import VariationOptionImage from './VariationOptionImage';
import VariationError from './VariationError';
import VariationLabel from './VariationLabel';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';

function determineBoolean(value: any) {
  return isBoolean(value) ? value : value === 'true' ? true : false;
}

function optionType(variation: any) {
  const { multipleSelect, sellerProductEditable } = variation.variationField;
  return determineBoolean(multipleSelect) ||
    determineBoolean(sellerProductEditable)
    ? 'checkbox'
    : 'radio';
}

interface OptionProps {
  disabled?: boolean;
  index: number;
  inputType: string;
  name: string;
  option: any;
  variation: any;
}

function VariationFieldOptionElement({
  disabled,
  index,
  inputType,
  name,
  option,
  variation,
}: OptionProps) {
  const { control, getQuote } = useMerchiFormContext();
  const { field } = useController({ name: `${name}.value`, control });
  const optionName = `${name}.options[${index}]`;
  const { selectableOptions, variationField } = variation;
  const { sellerProductEditable } = variationField;
  const { id } = option;
  const inputId = `${name}.options.id-${id}`;
  const activeIds = field.value ? field.value.split(',') : [];
  const isActive = activeIds.includes(String(id));
  const isAvailable = selectableOptions[index]
    ? selectableOptions[index].available
    : true;
  const optionInputType = optionType(variation);
  const doClick = () => {
    let updatedIds = [...activeIds];

    if (sellerProductEditable || optionInputType === 'checkbox') {
      // Checkbox Logic
      if (!updatedIds.includes(String(id))) {
        updatedIds.push(String(id));
      } else {
        updatedIds = updatedIds.filter(
          (existingId) => existingId !== String(id)
        );
      }
    } else if (optionInputType === 'radio') {
      // Radio Logic
      updatedIds = [String(id)];
    }
    field.onChange(updatedIds.length ? updatedIds.join(',') : '');

    getQuote();
  };
  return (
    <>
      <input
        style={{ display: 'none' }}
        checked={isActive}
        value={id}
        type={optionInputType}
        id={inputId}
        name={`${name}.value`}
        onChange={() => true}
        disabled={disabled}
      />
      {inputType === 'image' ? (
        <VariationOptionImage
          doClick={doClick}
          isChecked={isActive}
          isAvailable={isAvailable}
          name={`${optionName}.variationField.options[${index}]`}
          option={option}
          sellerProductEditable={sellerProductEditable}
        />
      ) : (
        <VariationOptionColour
          doClick={doClick}
          isChecked={isActive}
          isAvailable={isAvailable}
          name={`${optionName}.variationField.options[${index}]`}
          option={option}
          sellerProductEditable={sellerProductEditable}
        />
      )}
    </>
  );
}

interface Props {
  disabled?: boolean;
  inputType?: string;
  name: string;
  variation: any;
}

export const VariationSelectElements: React.FC<Props> = ({
  disabled,
  inputType = 'image',
  name,
  variation,
}) => {
  const { variationField } = variation;
  const { options = [] } = variationField;
  const isImage = inputType === 'image';
  return (
    <div className={isImage ? 'merchi-image-select-container' : ''}>
      <VariationLabel
        forceHideCost={true}
        variationClassName={`merchi-embed-form_input${
          isImage ? '-image' : ''
        }-select`}
        name={name}
        variation={variation}
      />
      <div
        className={
          isImage
            ? 'merchi-embed-form_image-select-option-container'
            : 'merchi-embed-form_color-select-container'
        }
      >
        {options.map((option: any, index: number) => (
          <VariationFieldOptionElement
            disabled={disabled}
            index={index}
            inputType={inputType}
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
  name: string;
  variation: any;
}

export const VariationSelectImage = (props: FieldProps) => (
  <VariationSelectElements {...props} inputType='image' />
);
export const VariationSelectColour = (props: FieldProps) => (
  <VariationSelectElements {...props} inputType='colour' />
);
