'use client';
import * as React from 'react';
import DynamicVariationInput from './DynamicVariationInput';
import { useFieldArray } from 'react-hook-form';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';

interface Props {
  containerClass?: string;
  disabled?: boolean;
  name?: string;
  keyName?: string;
}

function getSelectedOptionIds(variations: any[]): Set<number> {
  const ids = new Set<number>();
  for (const variation of variations) {
    const { value } = variation;
    if (!value) continue;
    String(value).split(',').forEach((id: string) => {
      const parsed = parseInt(id.trim(), 10);
      if (!isNaN(parsed)) ids.add(parsed);
    });
  }
  return ids;
}

function isDynamicVariationVisible(
  variation: any,
  selectedOptionIds: Set<number>,
): boolean {
  const selectedBy: any[] = variation?.variationField?.selectedBy;
  if (!selectedBy || selectedBy.length === 0) return true;
  return selectedBy.some((opt: any) => opt.id && selectedOptionIds.has(opt.id));
}

function Variations({
  containerClass,
  disabled,
  name = 'variations',
  keyName = 'variationArrayFieldId',
}: Props) {
  const { control, hookForm } = useMerchiFormContext();
  const { watch } = hookForm;
  const { fields } = useFieldArray({ control, keyName, name });
  const currentVariations: any[] = watch(name) || [];
  const selectedOptionIds = getSelectedOptionIds(currentVariations);
  return (
    <>
      {fields.map((fieldItem: any, index: number) => {
        const current = currentVariations[index];
        // Field-array items are the source of truth for variationField /
        // selectableOptions. Watched values can omit those after a value-only
        // update; never let that strip metadata or the input tree crashes and
        // the form collapses.
        const variation = {
          ...fieldItem,
          value: current?.value ?? fieldItem.value,
          variationFiles: current?.variationFiles ?? fieldItem.variationFiles,
          onceOffCost: current?.onceOffCost ?? fieldItem.onceOffCost,
          unitCost: current?.unitCost ?? fieldItem.unitCost,
          cost: current?.cost ?? fieldItem.cost,
          selectableOptions:
            current?.selectableOptions ?? fieldItem.selectableOptions,
          variationField: fieldItem.variationField ?? current?.variationField,
        };
        if (!isDynamicVariationVisible(variation, selectedOptionIds)) {
          return null;
        }
        return (
          <fieldset
            className={containerClass}
            key={fieldItem[keyName]}
            name={`${name}[${index}]`}
          >
            <DynamicVariationInput
              disabled={disabled}
              index={index}
              name={name}
              variation={variation}
            />
          </fieldset>
        );
      })}
    </>
  );
}

export default Variations;
