'use client';
import * as React from 'react';
import { createContext, ReactNode, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchJobQuote } from '../actions/jobs';
import { productHasGroups } from '../utils/products';
import { getMerchiSourceJobTags } from '../components/utils';
import { DraftTemplateData } from '../utils/types';
type FormMethods = ReturnType<typeof useForm>;

interface IMerchiProductForm {
  apiUrl?: string;
  allowAddToCart?: boolean;
  btnNameAddToCart?: string;
  classNameAlertSellerEditable?: string;
  classNameButtonSubmit?: string;
  classNameButtonGroupAdd?: string;
  classNameButtonGroupRemove?: string;
  classNameButtonsSubmitContainer?: string;
  classNameButtonApproveDrafts?: string;
  classNameButtonCloseDrafts?: string;
  classNameDraftButtonContainer?: string;
  classNameDraftGroupContainer?: string;
  classNameDraftGroupTitle?: string;
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
  draftApproveCallback: ((job: any) => Promise<void>) | null;
  getQuote: any;
  hideCost?: boolean;
  hideCountry?: boolean;
  hideCalculatedPrice?: boolean;
  hideDomainName?: boolean;
  hideQuantityField?: boolean;
  hideRequestQuotationButton?: boolean;
  hidePaymentUpfrontButton?: boolean;
  hideTitle?: boolean;
  hookForm: FormMethods;
  isCartItem?: boolean;
  initJob?: any;
  isDraftModalOpen: boolean;
  job: any;
  loading: boolean;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  onGetQuote?: () => void;
  onSubmit?: (jobData: any) => void;
  product: any;
  productFormId?: string;
  setClient: (client: any) => void;
  setIsDraftModalOpen: (isOpen: boolean) => void;
  setJob: (job: any) => void;
  setLoading: (loading: boolean) => void;
  showAlert: (alert: any) => void;
  showCurrency?: boolean;
  showCurrencyCode?: boolean;
  showFeatureDeadline?: boolean;
  showGroupBuyStatus?: boolean;
  showUnitPrice?: boolean;
}

const MerchiProductFormContext = createContext<IMerchiProductForm>({
  apiUrl: '',
  allowAddToCart: false,
  btnNameAddToCart: undefined,
  classNameAlertSellerEditable: undefined,
  classNameButtonSubmit: undefined,
  classNameButtonGroupAdd: undefined,
  classNameButtonGroupRemove: undefined,
  classNameButtonsSubmitContainer: undefined,
  classNameButtonApproveDrafts: undefined,
  classNameButtonCloseDrafts: undefined,
  classNameDraftButtonContainer: undefined,
  classNameDraftGroupContainer: undefined,
  classNameDraftGroupTitle: undefined,
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
  draftApproveCallback: null,
  getQuote() { },
  hideCost: false,
  hideCountry: false,
  hideDomainName: false,
  hideCalculatedPrice: false,
  hideQuantityField: false,
  hideRequestQuotationButton: false,
  hidePaymentUpfrontButton: false,
  hideTitle: false,
  hookForm: {} as any,
  isCartItem: false,
  initJob: undefined,
  isDraftModalOpen: false,
  job: {},
  loading: false,
  onAddToCart() { },
  onBuyNow() { },
  onGetQuote() { },
  onSubmit() { },
  product: {},
  productFormId: undefined,
  setClient() { },
  setIsDraftModalOpen() { },
  setJob(job) { },
  setLoading(loading) { },
  showAlert(alert) { },
  showCurrency: false,
  showCurrencyCode: false,
  showFeatureDeadline: false,
  showGroupBuyStatus: false,
  showUnitPrice: false,
});

export const useMerchiFormContext = () => useContext(MerchiProductFormContext);

export const MerchiProductFormProvider = ({
  apiUrl = 'https://api.merchi.co/v6/',
  allowAddToCart,
  btnNameAddToCart,
  classNameAlertSellerEditable = 'alert alert-light',
  classNameButtonSubmit = 'btn btn-primary w-100 merchi-embed-form_button-submit',
  classNameButtonGroupAdd = 'btn btn-white',
  classNameButtonGroupRemove = 'btn btn-danger',
  classNameButtonsSubmitContainer = 'merchi-product-buttons-submit-container',
  classNameButtonApproveDrafts = 'btn btn-success',
  classNameButtonCloseDrafts = 'btn btn-secondary',
  classNameDraftButtonContainer = 'merchi-product-draft-button-container',
  classNameDraftGroupContainer = 'merchi-product-draft-group-container',
  classNameDraftGroupTitle = 'merchi-product-draft-group-title',
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
  classNameFileListItemContainer = 'list-group',
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
  classNameOptionColour = 'merchi-embed-form_color-select-option',
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
  hideCountry = false,
  hideCalculatedPrice,
  hideDomainName = false,
  hideQuantityField,
  hideRequestQuotationButton,
  hidePaymentUpfrontButton,
  hideTitle = false,
  isCartItem,
  initJob,
  initProduct,
  onAddToCart,
  onBuyNow,
  onGetQuote,
  onSubmit,
  productFormId,
  showCurrency,
  showCurrencyCode,
  showFeatureDeadline,
  showGroupBuyStatus,
  showUnitPrice,
}: {
  apiUrl?: string;
  allowAddToCart?: boolean;
  btnNameAddToCart?: string;
  classNameAlertSellerEditable?: string;
  classNameButtonSubmit?: string;
  classNameButtonGroupAdd?: string;
  classNameButtonGroupRemove?: string;
  classNameButtonsSubmitContainer?: string;
  classNameButtonApproveDrafts?: string;
  classNameButtonCloseDrafts?: string;
  classNameDraftButtonContainer?: string;
  classNameDraftGroupContainer?: string;
  classNameDraftGroupTitle?: string;
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
  hideCalculatedPrice?: boolean;
  hideCost?: boolean;
  hideCountry?: boolean;
  hideDomainName?: boolean;
  hideQuantityField?: boolean;
  hideRequestQuotationButton?: boolean;
  hidePaymentUpfrontButton?: boolean;
  hideTitle?: boolean;
  isCartItem?: boolean;
  initJob?: any;
  initProduct: any;
  onAddToCart?: (job: any) => void;
  onBuyNow?: (job: any) => void;
  onGetQuote?: (job: any) => void;
  onSubmit?: (job: any) => void;
  productFormId?: string;
  showCurrency?: boolean;
  showCurrencyCode?: boolean;
  showFeatureDeadline?: boolean;
  showGroupBuyStatus?: boolean;
  showUnitPrice?: boolean;
}) => {
  const defaultJob = initJob || initProduct.defaultJob || {};
  const hookForm = useForm({ defaultValues: defaultJob });
  const [client, setClient] = useState(currentUser);
  const [alert, showAlert] = useState((null as any));
  const [draftApproveCallback, setDraftAppproveCallback] = useState<((job: any) => Promise<void>) | null>(null);
  const [job, setJob] = useState<any>(defaultJob);
  const [loading, setLoading] = useState(false);
  const { control, getValues, handleSubmit } = hookForm;
  const doSubmit = onSubmit ? handleSubmit(onSubmit) : undefined;

  const tags = getMerchiSourceJobTags();

  async function getQuote() {
    const values = await getValues();
    setLoading(true);
    let data = { ...values, product: { id: initProduct.id } };
    if (productHasGroups(initProduct)) {
      // if the product has group variation fields we delete quantity
      // because each group has it's own quantity
      delete data.quantity;
    }
    try {
      const r = await fetchJobQuote(data);
      const jobJson = r.toJson();
      setJob(jobJson);
    } catch (e: any) {
      const message = e.errorMessage || e.message || 'Server error';
      showAlert({ message });
      console.error(message);
    } finally {
      setLoading(false);
    }
  }

  const launchDraftApproveModal = async () => {
    // if the client has drafts which have not been approved, we launch a modal to approve them
    const designData = localStorage.getItem(`productDraftTemplate-${initProduct.id}`);
    if (designData) {
      try {
        const draftDataJson: DraftTemplateData = JSON.parse(designData);
        if (draftDataJson.productId === initProduct.id) {
          return true;
        }
        return false;
      } catch (e) {
        console.error('Error parsing design data', e);
        return false;
      }
    }
    return false;
  }

  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const addToCart = onAddToCart
    ? async () => {
      await getQuote();
      const openDraftModal = await launchDraftApproveModal();
      if (openDraftModal) {
        setDraftAppproveCallback(async (jobData) => {
          onAddToCart({ ...jobData, tags });
          return Promise.resolve();
        });
        setIsDraftModalOpen(true);
      } else {
        onAddToCart({ ...job, tags });
      }
    }
    : undefined;
  const buyNow = onBuyNow
    ? async () => {
      await getQuote();
      const openDraftModal = await launchDraftApproveModal();
      if (openDraftModal) {
        setDraftAppproveCallback(async (jobData) => {
          onBuyNow({ ...jobData });
          return Promise.resolve();
        });
        setIsDraftModalOpen(true);
      } else {
        onBuyNow({ ...job });
      }
    }
    : undefined;
  const getSubmitQuote = onGetQuote
    ? async () => {
      await getQuote();
      const openDraftModal = await launchDraftApproveModal();
      if (openDraftModal) {
        setDraftAppproveCallback(async (jobData) => {
          onGetQuote({ ...jobData });
          return Promise.resolve();
        });
        setIsDraftModalOpen(true);
      } else {
        onGetQuote({ ...job });
      }
    }
    : undefined;
  return (
    <MerchiProductFormContext.Provider
      value={
        {
          apiUrl,
          allowAddToCart,
          btnNameAddToCart,
          classNameAlertSellerEditable,
          classNameButtonSubmit,
          classNameButtonGroupAdd,
          classNameButtonGroupRemove,
          classNameButtonsSubmitContainer,
          classNameButtonApproveDrafts,
          classNameButtonCloseDrafts,
          classNameDraftButtonContainer,
          classNameDraftGroupContainer,
          classNameDraftGroupTitle,
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
          draftApproveCallback,
          getQuote,
          hideCost,
          hideCountry,
          hideCalculatedPrice,
          hideDomainName,
          hideQuantityField,
          hideRequestQuotationButton,
          hidePaymentUpfrontButton,
          hideTitle,
          hookForm,
          isCartItem,
          isDraftModalOpen,
          job,
          loading,
          onAddToCart: addToCart,
          onBuyNow: buyNow,
          onGetQuote: getSubmitQuote,
          product: initProduct,
          productFormId,
          setClient,
          setIsDraftModalOpen,
          setJob,
          setLoading,
          showAlert,
          showCurrency,
          showCurrencyCode,
          showFeatureDeadline,
          showGroupBuyStatus,
          showUnitPrice,
        } as any
      }
    >
      {productFormId ? (
        <form id={productFormId} onSubmit={doSubmit}>
          {children}
        </form>
      ) : children}
    </MerchiProductFormContext.Provider>
  );
};
