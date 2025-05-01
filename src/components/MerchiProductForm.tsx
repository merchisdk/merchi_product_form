'use client';
import * as React from 'react';
import { MerchiProductFormProvider } from '../context/MerchiProductFormProvider';
import InputProductQuantity from './InputProductQuantity';
import ProductTotalCost from './ProductTotalCost';
import ProductButtonsSubmit from './ProductButtonsSubmit';
import ProductTitle from './ProductTitle';
import Variations from './Variations';
import VariationsGroups from './VariationsGroups';
import { isProductFileDownload, isProductSupplierMOD } from './utils';
import ProductFeatureDeadline from './ProductFeatureDeadline';
import ProductGroupBuyStatus from './ProductGroupBuyStatus';
import '../styles/globals.css';

interface Props {
  allowAddToCart?: boolean;
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
  hideCalculatedPrice?: boolean;
  hideQuantityField?: boolean;
  hideSubmitButtons?: boolean;
  hideCost?: boolean;
  hideCountry?: boolean;
  hideTitle?: boolean;
  initJob?: any;
  initProduct: any;
  onBuyNow: (job: any) => void;
  onGetQuote: (job: any) => void;
  onSubmit?: (job: any) => void;
  showFeatureDeadline?: boolean;
  showGroupBuyStatus?: boolean;
}

function MerchiProductForm(props: Props) {
  const {
    hideQuantityField = false,
    hideSubmitButtons = false,
    hideTitle = false,
    initProduct,
    showFeatureDeadline,
    showGroupBuyStatus,
  } = props;
  const { groupVariationFields } = initProduct;
  const hasGroups = groupVariationFields && groupVariationFields.length;
  const isSupplierMOD = isProductSupplierMOD(initProduct);
  const isDownloadableProduct = isProductFileDownload(initProduct);
  return (
    <MerchiProductFormProvider {...props}>
      {!hideTitle && <ProductTitle />}
      {showFeatureDeadline && <ProductFeatureDeadline />}
      {showGroupBuyStatus && <ProductGroupBuyStatus />}
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
