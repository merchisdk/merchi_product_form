'use client';
import { createContext, ReactNode, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchJobQuote } from '../actions/jobs';

type FormMethods = ReturnType<typeof useForm>;

interface IMerchiProductForm {
  allowAddToCart?: boolean;
  btnNameAddToCart?: string;
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
  control: any;
  currentUser?: any;
  getQuote: any;
  hideCost?: boolean;
  hideCalculatedPrice?: boolean;
  hideQuantityField?: boolean;
  hideRequestQuotationButton?: boolean;
  hidePaymentUpfrontButton?: boolean;
  hookForm: FormMethods;
  isCartItem?: boolean;
  job: any;
  loading: boolean;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  onGetQuote?: () => void;
  product: any;
  productFormId?: string;
  setClient: (client: any) => void;
  setJob: (job: any) => void;
  setLoading: (loading: boolean) => void;
  showAlert: (alert: any) => void;
  showCurrency?: boolean;
  showCurrencyCode?: boolean;
  showUnitPrice?: boolean;
}

const MerchiProductFormContext = createContext<IMerchiProductForm>({
  allowAddToCart: false,
  btnNameAddToCart: undefined,
  classNameAlertSellerEditable: undefined,
  classNameButtonSubmit: undefined,
  classNameButtonGroupAdd: undefined,
  classNameButtonGroupRemove: undefined,
  classNameButtonsSubmitContainer: undefined,
  classNameFileUploadContainer: undefined,
  classNameFileUpload: undefined,
  classNameFilePreviewContainer: undefined,
  classNameFileUploadTextContainer: undefined,
  classNameFilePreviewIconWrapper: undefined,
  classNameFileUploadButton: undefined,
  classNameFileUploadIcon: undefined,
  classNameFileUploadIconSecond: undefined,
  classNameFileUploadIconContainer: undefined,
  classNameFileListItem: undefined,
  classNameFileButtonDelete: undefined,
  classNameFileListItemContainer: undefined,
  classNameGroupsContainer: undefined,
  classNameGroupPriceContainer: undefined,
  classNameInput: undefined,
  classNameInputContainer: undefined,
  classNameInventoryStatus: undefined,
  classNameOptionContainer: undefined,
  classNameOptionInput: undefined,
  classNameOptionLabel: undefined,
  classNameOptionSuper: undefined,
  classNameOptionsCheckboxRadioContainer: undefined,
  classNameOptionImage: undefined,
  classNameOptionImageContainer: undefined,
  classNameOptionColour: undefined,
  classNameOptionColourContainer: undefined,
  classNameProductTitle: undefined,
  classNameProductOriginTitle: undefined,
  classNameProductTotalContainer: undefined,
  classNameProductTotal: undefined,
  classNameQuantityLabelContainer: undefined,
  classNameUnitPrice: undefined,
  control: {},
  currentUser: {},
  getQuote() {},
  hideCost: false,
  hideCalculatedPrice: false,
  hideQuantityField: false,
  hideRequestQuotationButton: false,
  hidePaymentUpfrontButton: false,
  hookForm: {} as any,
  isCartItem: false,
  job: {},
  loading: false,
  onAddToCart() {},
  onBuyNow() {},
  onGetQuote() {},
  product: {},
  productFormId: undefined,
  setClient() {},
  setJob(job) {},
  setLoading(loading) {},
  showAlert(alert) {},
  showCurrency: false,
  showCurrencyCode: false,
  showUnitPrice: false,
});

export const useMerchiFormContext = () => useContext(MerchiProductFormContext);

export const MerchiProductFormProvider = ({
  allowAddToCart,
  btnNameAddToCart,
  classNameAlertSellerEditable = 'alert alert-light',
  classNameButtonSubmit = 'btn btn-primary w-100 merchi-embed-form_button-submit',
  classNameButtonGroupAdd = 'btn btn-white',
  classNameButtonGroupRemove = 'btn btn-danger',
  classNameButtonsSubmitContainer = 'merchi-product-buttons-submit-container',
  classNameFileUploadContainer = 'merchi-input-file-container',
  classNameFileUpload = 'merchi-embed-form_dropzone',
  classNameFilePreviewContainer = 'uploaded-variation-file',
  classNameFileUploadTextContainer = 'merchi-embed-form_dropzone-text-container',
  classNameFilePreviewIconWrapper = 'uploaded-variation-file-icon-wrapper',
  classNameFileUploadButton = 'btn btn-sm btn-link ml-auto',
  classNameFileUploadIcon = 'merchi-embed-form_dropzone-icon',
  classNameFileUploadIconSecond = 'merchi-embed-form_dropzone-icon-plus',
  classNameFileUploadIconContainer = 'merchi-embed-form_dropzone-icon-container',
  classNameFileListItem = 'list-group-item no-z-index-hover',
  classNameFileButtonDownload = 'btn btn-sm btn-secondary',
  classNameFileButtonDelete = 'btn btn-sm btn-danger ml-2',
  classNameFileListItemContainer = 'list-group' ,
  classNameGroupsContainer = 'merchi-embed-form_product-group-container',
  classNameGroupPriceContainer = 'merchi-embed-form_product-group-total-cost',
  classNameInput = 'form-control',
  classNameInventoryStatus = 'flex-fill',
  classNameInputContainer = 'merchi-embed-form_product-group-input-qty-container',
  classNameOptionContainer = 'merchi-embed-form_checkbox_radio-item',
  classNameOptionInput = 'merchi-embed-form_checkbox_radio-input',
  classNameOptionLabel = 'merchi-embed-form_checkbox_radio-label',
  classNameOptionSuper = 'merchi-embed-form_checkbox_radio-super',
  classNameOptionsCheckboxRadioContainer = '',
  classNameOptionImage = 'merchi-embed-form_image-select-option-item-img',
  classNameOptionImageContainer = 'merchi-embed-form_image-select-option-item-container',
  classNameOptionColour = 'merchi-embed-form_color-select',
  classNameOptionColourContainer = 'merchi-embed-form_color-select-item',
  classNameProductTitle = 'merchi-product-title',
  classNameProductOriginTitle = 'merchi-product-origin-title',
  classNameProductTotal = 'merchi-embed-form_summary-product-cost',
  classNameProductTotalContainer = 'merchi-embed-form_summary-product-cost-container',
  classNameQuantityLabelContainer = 'merchi-embed-form_quantity-label-container',
  classNameUnitPrice,
  children,
  currentUser,
  hideCost,
  hideCalculatedPrice,
  hideQuantityField,
  hideRequestQuotationButton,
  hidePaymentUpfrontButton,
  isCartItem,
  initProduct,
  onAddToCart,
  onBuyNow,
  onGetQuote,
  productFormId,
  showCurrency,
  showCurrencyCode,
  showUnitPrice,
}: {
  allowAddToCart?: boolean;
  btnNameAddToCart?: string;
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
  classNameProductTitle?: string;
  classNameProductOriginTitle?: string;
  classNameProductTotalContainer?: string;
  classNameProductTotal?: string;
  classNameOptionColourContainer?: string;
  classNameQuantityLabelContainer?: string;
  classNameUnitPrice?: string;
  children: ReactNode;
  currentUser?: any;
  hideCost?: boolean;
  hideCalculatedPrice?: boolean;
  hideQuantityField?: boolean;
  hideRequestQuotationButton?: boolean;
  hidePaymentUpfrontButton?: boolean;
  isCartItem?: boolean;
  initProduct: any;
  onAddToCart?: (job: any) => void;
  onBuyNow?: (job: any) => void;
  onGetQuote?: (job: any) => void;
  productFormId?: string;
  showCurrency?: boolean;
  showCurrencyCode?: boolean;
  showUnitPrice?: boolean;
}) => {
  const hookForm = useForm({ defaultValues: initProduct.defaultJob || {} });
  const [client, setClient] = useState(currentUser)
  const [job, setJob] = useState<any>(initProduct.defaultJob || {});
  const [loading, setLoading] = useState(false);
  const { control, getValues } = hookForm;
  async function getQuote() {
    setLoading(true);
    const values = await getValues();
    const r = await fetchJobQuote({
      ...values,
      product: { id: initProduct.id },
    });
    setJob(r);
    setLoading(false);
  }
  const addToCart = onAddToCart
    ? async function addToCart() {
        await getQuote();
        onAddToCart(job);
      }
    : undefined;
  const buyNow = onBuyNow
    ? async function addToCart() {
        await getQuote();
        onBuyNow(job);
      }
    : undefined;
  const getSubmitQuote = onGetQuote
    ? async function addToCart() {
        await getQuote();
        onGetQuote(job);
      }
    : undefined;
  const [alert, showAlert] = useState(null);
  return (
    <MerchiProductFormContext.Provider
      value={
        {
          allowAddToCart,
          btnNameAddToCart,
          classNameAlertSellerEditable,
          classNameButtonSubmit,
          classNameButtonGroupAdd,
          classNameButtonGroupRemove,
          classNameButtonsSubmitContainer,
          classNameFileUploadContainer,
          classNameFileUpload,
          classNameFilePreviewContainer,
          classNameFileUploadTextContainer,
          classNameFilePreviewIconWrapper,
          classNameFileUploadButton,
          classNameFileUploadIcon,
          classNameFileUploadIconSecond,
          classNameFileUploadIconContainer,
          classNameFileListItem,
          classNameFileButtonDownload,
          classNameFileButtonDelete,
          classNameFileListItemContainer,
          classNameGroupsContainer,
          classNameGroupPriceContainer,
          classNameInput,
          classNameInputContainer,
          classNameInventoryStatus,
          classNameOptionContainer,
          classNameOptionInput,
          classNameOptionLabel,
          classNameOptionSuper,
          classNameOptionsCheckboxRadioContainer,
          classNameOptionImage,
          classNameOptionImageContainer,
          classNameOptionColour,
          classNameOptionColourContainer,
          classNameProductTitle,
          classNameProductOriginTitle,
          classNameProductTotalContainer,
          classNameProductTotal,
          classNameQuantityLabelContainer,
          classNameUnitPrice,
          client,
          control,
          getQuote,
          hideCost,
          hideCalculatedPrice,
          hideQuantityField,
          hideRequestQuotationButton,
          hidePaymentUpfrontButton,
          hookForm,
          isCartItem,
          job,
          loading,
          onAddToCart: addToCart,
          onBuyNow: buyNow,
          onGetQuote: getSubmitQuote,
          product: initProduct,
          productFormId,
          setClient,
          setJob,
          setLoading,
          showAlert,
          showCurrency,
          showCurrencyCode,
          showUnitPrice,
        } as any
      }
    >
      {children}
    </MerchiProductFormContext.Provider>
  );
};
