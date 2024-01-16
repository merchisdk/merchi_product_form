'use client';
import { MerchiProductFormProvider } from './MerchiProductFormProvider';
import InputProductQuantity from './InputProductQuantity';
import ProductTotalCost from './ProductTotalCost';
import ProductButtonsSubmit from './ProductButtonsSubmit';
import ProductTitle from './ProductTitle';
import Variations from './Variations';
import VariationsGroups from './VariationsGroups';
import { isProductFileDownload, isProductSupplierMOD } from './utils';

interface Props {
  classNameAlertSellerEditable?: string;
  classNameButtonSubmit?: string;
  classNameButtonGroupAdd?: string;
  classNameButtonGroupRemove?: string;
  classNameButtonsSubmitContainer?: string;
  classNameFileUploadContainer?: string;
  classNameFileUpload?: string;
  classNameFilePreviewContainer?: string;
  classNameFileUploadTextContainer?: string;
  classNameFilePreviewIconWrapper?: string;
  classNameFileUploadButton?: string;
  classNameFileUploadIcon?: string;
  classNameFileUploadIconSecond?: string;
  classNameFileUploadIconContainer?: string;
  classNameFileListItem?: string;
  classNameFileButtonDownload?: string;
  classNameFileButtonDelete?: string;
  classNameFileListItemContainer?: string;
  classNameGroupsContainer?: string;
  classNameGroupPriceContainer?: string;
  classNameInput?: string;
  classNameInputContainer?: string;
  classNameInventoryStatus?: string;
  classNameOptionContainer?: string;
  classNameOptionInput?: string;
  classNameOptionLabel?: string;
  classNameOptionSuper?: string;
  classNameOptionsCheckboxRadioContainer?: string;
  classNameOptionImage?: string;
  classNameOptionImageContainer?: string;
  classNameOptionColour?: string;
  classNameOptionColourContainer?: string;
  classNameProductTitle?: string;
  classNameProductOriginTitle?: string;
  classNameProductTotalContainer?: string;
  classNameProductTotal?: string;
  classNameQuantityLabelContainer?: string;
  classNameUnitPrice?: string;
  hideQuantityField?: boolean;
  hideSubmitButtons?: boolean;
  hideTitle?: boolean;
  initJob?: any;
  initProduct: any;
  onBuyNow: (job: any) => void;
  onGetQuote: (job: any) => void;
}

function MerchiProductForm(props: Props) {
  const {
    hideQuantityField = false,
    hideSubmitButtons = false,
    hideTitle = false,
    initProduct,
  } = props;
  const { groupVariationFields } = initProduct;
  const hasGroups = groupVariationFields && groupVariationFields.length;
  const isSupplierMOD = isProductSupplierMOD(initProduct);
  const isDownloadableProduct = isProductFileDownload(initProduct);
  return (
    <MerchiProductFormProvider {...props}>
      {!hideTitle && <ProductTitle />}
      {!!(
        !isDownloadableProduct &&
        !isSupplierMOD &&
        !hasGroups &&
        !hideQuantityField
      ) && <InputProductQuantity />}
      <div className='merchi-embed-form_variantion-container'>
        <VariationsGroups />
        <Variations />
      </div>
      <ProductTotalCost />
      {!hideSubmitButtons && <ProductButtonsSubmit />}
    </MerchiProductFormProvider>
  );
}

export default MerchiProductForm;
