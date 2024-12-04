'use client';
import * as React from 'react';
import { FieldType } from './types';
import {
  VariationCheckbox,
  VariationRadio,
} from './VariationCheckboxRadio';
import VariationFileInput from './VariationFileInput';
import AlertVariationSellerEditable from './AlertVariationSellerEditable';
import VariationFieldInstructions from './VariationFieldInstructions';
import VariationFieldStaticValues from './VariationFieldStaticValues';
import VariationSelect from './VariationSelect';
import {
  VariationInputCoulourPicker,
  VariationInputTextarea,
  VariationInputText,
  VariationInputNumber,
} from './VariationInput';
import {
  VariationSelectColour,
  VariationSelectImage,
} from './VariationSelectElements';
import { useMerchiFormContext } from './MerchiProductFormProvider';

const fieldMaps = new Map();
fieldMaps.set(FieldType.CHECKBOX, VariationCheckbox);
fieldMaps.set(FieldType.COLOUR_PICKER, VariationInputCoulourPicker);
fieldMaps.set(FieldType.FILE_UPLOAD, VariationFileInput);
fieldMaps.set(FieldType.COLOUR_SELECT, VariationSelectColour);
fieldMaps.set(FieldType.IMAGE_SELECT, VariationSelectImage);
fieldMaps.set(FieldType.RADIO, VariationRadio);
fieldMaps.set(FieldType.SELECT, VariationSelect);
fieldMaps.set(FieldType.TEXT_AREA, VariationInputTextarea);
fieldMaps.set(FieldType.TEXT_INPUT, VariationInputText);
fieldMaps.set(FieldType.NUMBER_INPUT, VariationInputNumber);
fieldMaps.set(FieldType.FIELD_INSTRUCTIONS, VariationFieldInstructions);

interface Props {
  disabled?: boolean;
  index: number;
  name: string;
  variation: any;
}

function DynamicVariationInput({
  disabled,
  index,
  name,
  variation,
}: Props) {
  const { showAlert } = useMerchiFormContext();
  const { variationField } = variation;
  const { fieldType } = variationField;
  const Variation = fieldMaps.get(parseInt(fieldType, 10));
  return (
    <>
      <VariationFieldStaticValues
        index={index}
        name={name}
        variation={variation}
      />
      <AlertVariationSellerEditable variationField={variationField} />
      <Variation
        alertErrorCallback={showAlert}
        disabled={disabled}
        name={`${name}[${index}]`}
        variation={variation}
      />
    </>
  );
}

export default DynamicVariationInput;
