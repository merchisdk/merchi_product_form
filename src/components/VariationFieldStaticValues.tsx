'use client';
import * as React from 'react';
import InputHiddenStatic from './InputHiddenStatic';

interface Props {
  name: string;
  index: number;
  variation: any;
}

const VariationFieldStaticValues: React.FC<Props> = ({
  name,
  index,
  variation,
}) => {
  const {
    variationField,
  } = variation;
  const {
    fieldType, id, multipleSelect, name: fieldName, placeholder, position, required, sellerProductEditable
  } = variationField;
  const variationName = (attr: string) => `${name}[${index}]${attr}`;

  function intValue(v: any) {
    return parseInt(v, 10).toString();
  }

  function boolValue(v: any) {
    return v ? 'true' : 'false';
  }

  return (
    <>
      <InputHiddenStatic
        name={variationName('.variationField.id')}
        value={intValue(id)}
      />
      <InputHiddenStatic
        name={variationName('.variationField.name')}
        value={fieldName}
      />
      <InputHiddenStatic
        name={variationName('.variationField.placeholder')}
        value={placeholder}
      />
      <InputHiddenStatic
        name={variationName('.variationField.fieldType')}
        value={intValue(fieldType)}
      />
      <InputHiddenStatic
        name={variationName('.variationField.position')}
        value={intValue(position)}
      />
      <InputHiddenStatic
        name={variationName('.variationField.sellerProductEditable')}
        value={boolValue(sellerProductEditable)}
      />
      <InputHiddenStatic
        name={variationName('.variationField.multipleSelect')}
        value={boolValue(multipleSelect)}
      />
      <InputHiddenStatic
        name={variationName('.variationField.required')}
        value={boolValue(required)}
      />
    </>
  );
}

export default VariationFieldStaticValues;
