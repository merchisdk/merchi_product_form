'use client';
import InputHiddenStatic from './InputHiddenStatic';

interface Props {
  option: any;
  optionName: string;
}

const VariationFieldOptionDefaultInputs: React.FC<Props> = ({ option, optionName }) => {
  const {
    colour,
    currency,
    id,
    optionId,
    position,
    value,
    variationCost = 0,
    variationUnitCost = 0,
  } = option;

  function floatValue(v: any) {
    return parseFloat(v);
  }
  return (
    <>
      {colour && 
        <InputHiddenStatic
          name={`${optionName}.colour`}
          value={colour}
        />
      }
      {currency && 
        <InputHiddenStatic
          name={`${optionName}.currency`}
          value={currency}
        />
      }
      <InputHiddenStatic
        name={`${optionName}.id`}
        value={id ? id : optionId}
      />
      <InputHiddenStatic
        name={`${optionName}.position`}
        value={position}
      />
      <InputHiddenStatic
        name={`${optionName}.variationCost`}
        value={floatValue(variationCost)}
      />
      <InputHiddenStatic
        name={`${optionName}.variationUnitCost`}
        value={floatValue(variationUnitCost)}
      />
      <InputHiddenStatic
        name={`${optionName}.value`}
        value={value}
      />
    </>
  );
}

export default VariationFieldOptionDefaultInputs;
