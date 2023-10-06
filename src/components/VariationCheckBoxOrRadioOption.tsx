'use client';
import { useController } from 'react-hook-form';
import VariationFieldOptionDefaultInputs from './VariationFieldOptionDefaultInputs';
import { variationFieldOptionCostDetail } from './utils';
import { useMerchiFormContext } from './MerchiProductFormProvider';

interface Props {
  disabled?: boolean;
  index: number;
  inputType?: string;
  isAvailable: boolean;
  name: string;
  option: any;
  variation: any;
}

function VariationCheckBoxOrRadioOption({
  disabled,
  index,
  inputType,
  isAvailable = true,
  name,
  option,
  variation,
}: Props) {
  const {
    classNameOptionContainer,
    classNameOptionInput,
    classNameOptionLabel,
    classNameOptionSuper,
    getQuote,
    control, // Newly added from the context
  } = useMerchiFormContext();
  const { field } = useController({
    name: `${name}.value`,
    control,
  });
  const { variationField } = variation;
  const { sellerProductEditable } = variationField;
  const { id, value } = option;
  const optionCost = variationFieldOptionCostDetail(option);
  const outOfStock = !isAvailable ? ' - insufficient stock' : '';
  const outOfStockOrCost = outOfStock || optionCost;
  const activeIds = (field.value || '').split(',');
  const isActive = activeIds.includes(String(id));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let updatedIds = [...activeIds];

    if (sellerProductEditable || inputType === 'checkbox') {
      // Checkbox Logic
      if (e.target.checked && !updatedIds.includes(String(id))) {
        updatedIds.push(String(id));
      } else if (!e.target.checked) {
        updatedIds = updatedIds.filter(
          (existingId) => existingId !== String(id)
        );
      }
    } else if (inputType === 'radio') {
      // Radio Logic
      updatedIds = [String(id)];
    }

    field.onChange(updatedIds.join(','));

    getQuote();
  };
  return (
    <div className={classNameOptionContainer}>
      <VariationFieldOptionDefaultInputs
        option={option}
        optionName={`${name}.variationField.options[${index}]`}
      />
      <input
        className={classNameOptionInput}
        checked={isActive}
        type={sellerProductEditable ? 'checkbox' : inputType}
        disabled={disabled || !isAvailable}
        value={id}
        name={`${name}.value`}
        onChange={handleChange}
      />
      <label className={classNameOptionLabel}>{value}</label>
      {outOfStockOrCost && (
        <span className={classNameOptionSuper}>
          {outOfStock} {optionCost}
        </span>
      )}
    </div>
  );
}

export default VariationCheckBoxOrRadioOption;
