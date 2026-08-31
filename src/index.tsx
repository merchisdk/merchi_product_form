import AlertVariationSellerEditable from './components/AlertVariationSellerEditable';
import DynamicVariationInput from './components/DynamicVariationInput';
import FormLead from './components/FormLead';
import InputHiddenStatic from './components/InputHiddenStatic';
import InputProductQuantity from './components/InputProductQuantity';
import MerchiProductForm from './components/MerchiProductForm';
import ProductButtonsSubmit from './components/ProductButtonsSubmit';
import ProductFeatureDeadline from './components/ProductFeatureDeadline';
import ProductGroupBuyStatus from './components/ProductGroupBuyStatus';
import PriceMatrix from './components/PriceMatrix';
import ProductPriceMatrix from './components/ProductPriceMatrix';
import ProductTotalCost from './components/ProductTotalCost';
import ProductTitle from './components/ProductTitle';
import { productFeatureImageUrl } from './utils/products';
import VariationCheckBoxOrRadioOption from './components/VariationCheckBoxOrRadioOption';
import {
  MerchiProductFormProvider,
  useMerchiFormContext,
} from "./context/MerchiProductFormProvider";
import {
  VariationCheckbox,
  VariationRadio,
} from './components/VariationCheckboxRadio';
import VariationError from './components/VariationError';
import VariationFieldInstructions from './components/VariationFieldInstructions';
import VariationFieldNameAndCostInputs from './components/VariationFieldNameAndCostInputs';
import VariationFieldOptionDefaultInputs from './components/VariationFieldOptionDefaultInputs';
import VariationFileInput from './components/VariationFileInput';
import VariationLabel from './components/VariationLabel';
import VariationFieldStaticValues from './components/VariationFieldStaticValues';
import {
  VariationInputCoulourPicker,
  VariationInputText,
  VariationInputNumber,
  VariationInputTextarea
} from './components/VariationInput';
import VariationSelect from './components/VariationSelect';
import TooltipElement from './components/TooltipElement';
import {
  VariationSelectColour,
  VariationSelectImage,
} from './components/VariationSelectElements';
import Variations from './components/Variations';
import VariationsGroups from './components/VariationsGroups';

import DraftApprovePanel from './components/drafts/DraftApprovePanel';
import ProductDraftsHost from './components/drafts/ProductDraftsHost';
import { productAllowsClientDesign } from './utils/draftTemplates';
import ButtonProductSubmit from './components/buttons/ButtonProductSubmit';
import { isProductLeadForm, isProductSupplierMOD } from './components/utils';


export {
  AlertVariationSellerEditable,
  DynamicVariationInput,
  DraftApprovePanel,
  ProductDraftsHost,
  FormLead,
  InputHiddenStatic,
  InputProductQuantity,
  MerchiProductFormProvider,
  ProductButtonsSubmit,
  ProductFeatureDeadline,
  productFeatureImageUrl,
  PriceMatrix,
  ProductGroupBuyStatus,
  ProductPriceMatrix,
  ProductTitle,
  ProductTotalCost,
  VariationCheckBoxOrRadioOption,
  useMerchiFormContext,
  VariationCheckbox,
  VariationError,
  VariationFieldInstructions,
  VariationFieldNameAndCostInputs,
  VariationFieldOptionDefaultInputs,
  VariationFileInput,
  VariationLabel,
  VariationFieldStaticValues,
  VariationInputCoulourPicker,
  VariationInputText,
  VariationInputNumber,
  VariationInputTextarea,
  VariationRadio,
  VariationSelect,
  VariationSelectColour,
  VariationSelectImage,
  Variations,
  VariationsGroups,
  TooltipElement,
  ButtonProductSubmit,
  isProductLeadForm,
  isProductSupplierMOD,
  productAllowsClientDesign,
};

export type { PriceMatrixProps } from './components/PriceMatrix';
export type {
  PriceMatrixBand,
  PriceMatrixCell,
  PriceMatrixData,
} from './utils/priceMatrix';
export {
  activeBandIndex,
  pricingRulesFromProduct,
  resolvePriceMatrix,
} from './utils/priceMatrix';

export default MerchiProductForm;
