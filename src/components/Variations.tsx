'use client';
import * as React from 'react';
import DynamicVariationInput from './DynamicVariationInput';
import { useFieldArray } from 'react-hook-form';
import { useMerchiFormContext } from './MerchiProductFormProvider';

interface Props {
  containerClass?: string;
  disabled?: boolean;
  name?: string;
  keyName?: string;
}

function Variations({
  containerClass,
  disabled,
  name = 'variations',
  keyName = 'variationArrayFieldId',
}: Props) {
  const { control } = useMerchiFormContext();
  const { fields } = useFieldArray(
    {
      control,
      keyName,
      name,
    }
  );
  return (
    <>
      {fields.map((variation: any, index: number) =>
        <fieldset
          className={containerClass}
          key={variation[keyName]}
          name={`${name}[${index}]`}
        >
          <DynamicVariationInput
            disabled={disabled}
            index={index}
            name={name}
            variation={variation}
          />
        </fieldset>
      )}
    </>
  );
}

export default Variations;
