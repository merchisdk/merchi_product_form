'use client';
import InputHiddenStatic from './InputHiddenStatic';

interface Props {
  name: string;
  variation: any;
}

function VariationFieldNameAndCostInputs(props: Props) {
  const { name, variation = {} } = props;
  const { onceOffCost, unitCost, variationField = {} } = variation;

  function floatValue(v: any) {
    return v ? parseFloat(v) : 0;
  }

  return (
    <>
      <InputHiddenStatic
        name={`${name}.onceOffCost`}
        value={floatValue(onceOffCost)} />
      <InputHiddenStatic
        name={`${name}.unitCost`}
        value={floatValue(unitCost)} />
      <InputHiddenStatic
        name={`${name}.variationField.variationCost`}
        value={floatValue(variationField.variationCost)} />
      <InputHiddenStatic
        name={`${name}.variationField.variationUnitCost`}
        value={floatValue(variationField.variationUnitCost)} />
    </>
  );
}

export default VariationFieldNameAndCostInputs;
