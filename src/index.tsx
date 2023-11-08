import AlertVariationSellerEditable from './components/AlertVariationSellerEditable';
import DynamicVariationInput from './components/DynamicVariationInput';
import InputHiddenStatic from './components/InputHiddenStatic';
import InputProductQuantity from './components/InputProductQuantity';
import MerchiProductForm from './components/MerchiProductForm';
import VariationCheckBoxOrRadioOption from './components/VariationCheckBoxOrRadioOption';
import {
  MerchiProductFormProvider,
  useMerchiFormContext,
} from "./components/MerchiProductFormProvider";
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
import {
  VariationSelectColour,
  VariationSelectImage,
} from './components/VariationSelectElements';
import Variations from './components/Variations';

export {
  AlertVariationSellerEditable,
  DynamicVariationInput,
  InputHiddenStatic,
  InputProductQuantity,
  MerchiProductFormProvider,
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
};

export default MerchiProductForm;
