'use client';
import Tooltip from './Tooltip';
import { optionImageUrl, variationFieldOptionCostDetail } from './utils';
import IconCheckedOrNoStock from './icons/IconCheckedOrNoStock';
import defaultOptionImage from './images/product-not-found.png';
import { useMerchiFormContext } from './MerchiProductFormProvider';
import InputHiddenStatic from './InputHiddenStatic';
import VariationFieldOptionDefaultInputs from './VariationFieldOptionDefaultInputs';

interface Props {
  doClick: () => void;
  isAvailable: boolean;
  isChecked: boolean;
  name: string;
  option: any;
  sellerProductEditable?: boolean;
}

function VariationOptionImage({
  doClick,
  isAvailable = true,
  isChecked,
  name,
  option,
  sellerProductEditable,
}: Props) {
  const {
    classNameOptionImage,
    classNameOptionImageContainer,
  } = useMerchiFormContext();
  const containerClass = `merchi-embed-form_image-select-option-item ${
    isChecked ? 'image-checked' : ''
  } ${isAvailable ? 'cursor-pointer' : 'option-no-inventory'}`;
  const optionCost = variationFieldOptionCostDetail(option);
  const tooltip =
    String(option.value) + `${!isAvailable ? ' - insufficient stock' : ''}`;
  return (
    <div
      className={classNameOptionImageContainer}
      onClick={isAvailable ? doClick : undefined}
    >
      <div className={containerClass}>
        <IconCheckedOrNoStock isChecked={isChecked} noStock={!isAvailable} />
        <span
          className={classNameOptionImage}
          style={{
            backgroundImage: `url(${optionImageUrl(option)})`,
          }}
        />
        <Tooltip tooltip={tooltip}>
          <div className='image-select-title'>{option.value}</div>
        </Tooltip>
        {sellerProductEditable && (
          <small className='d-block'>{optionCost}</small>
        )}
        <InputHiddenStatic
          name={`${name}.linkedFile.viewUrl`}
          value={
            option.linkedFile && option.linkedFile.viewUrl
              ? option.linkedFile.viewUrl
              : defaultOptionImage.src
          }
        />
        <VariationFieldOptionDefaultInputs optionName={name} option={option} />
      </div>
    </div>
  );
}

export default VariationOptionImage;
