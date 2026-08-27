'use client';
import * as React from 'react';
import { FieldType } from '../utils/types';
import {
  VariationCheckbox,
  VariationRadio,
} from './VariationCheckboxRadio';
import VariationFileInput from './VariationFileInput';
import VariationColourExtractInput from './VariationColourExtractInput';
import AlertVariationSellerEditable from './AlertVariationSellerEditable';
import VariationFieldInstructions from './VariationFieldInstructions';
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
import VariationTurnaroundTime from './VariationTurnaroundTime';
import VariationAreaInput from './VariationAreaInput';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';
import { shouldHideSingleOptionSelection } from '../utils/singleOptionVariation';

const fieldMaps = new Map();
fieldMaps.set(FieldType.CHECKBOX, VariationCheckbox);
fieldMaps.set(FieldType.COLOUR_PICKER, VariationInputCoulourPicker);
fieldMaps.set(FieldType.FILE_UPLOAD, VariationFileInput);
fieldMaps.set(FieldType.COLOUR_EXTRACT, VariationColourExtractInput);
fieldMaps.set(FieldType.COLOUR_SELECT, VariationSelectColour);
fieldMaps.set(FieldType.IMAGE_SELECT, VariationSelectImage);
fieldMaps.set(FieldType.RADIO, VariationRadio);
fieldMaps.set(FieldType.SELECT, VariationSelect);
fieldMaps.set(FieldType.TEXT_AREA, VariationInputTextarea);
fieldMaps.set(FieldType.TEXT_INPUT, VariationInputText);
fieldMaps.set(FieldType.NUMBER_INPUT, VariationInputNumber);
fieldMaps.set(FieldType.FIELD_INSTRUCTIONS, VariationFieldInstructions);
fieldMaps.set(FieldType.TURNAROUND_TIME, VariationTurnaroundTime);
fieldMaps.set(FieldType.AREA, VariationAreaInput);

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
  const { hookForm, showAlert } = useMerchiFormContext();
  const variationField = variation?.variationField;
  const fieldType = variationField?.fieldType;
  const Variation = fieldMaps.get(parseInt(fieldType, 10));
  if (!Variation || !variationField) {
    return null;
  }
  const hideSelection = shouldHideSingleOptionSelection(variation);
  return (
    <>
      <input
        type='hidden'
        defaultValue={JSON.stringify(variation)}
        {...hookForm.register(`${name}[${index}].json`)}
      />
      {hideSelection ? null : (
        <>
          <AlertVariationSellerEditable variationField={variationField} />
          <Variation
            alertErrorCallback={showAlert}
            disabled={disabled}
            name={`${name}[${index}]`}
            variation={variation}
          />
        </>
      )}
    </>
  );
}

export default DynamicVariationInput;
