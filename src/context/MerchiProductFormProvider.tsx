'use client';
import * as React from 'react';
import { createContext, ReactNode, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchJobQuote } from '../actions/jobs';
import { productHasGroups } from '../utils/products';
import { getMerchiSourceJobTags } from '../components/utils';
import { DraftTemplateData } from '../utils/types';
import { cleanJobVariationsAndGroups } from '../components/utils';
import { pricing } from 'merchi_sdk_ts';
import { toSelections } from '../utils/selections';
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
  quoteMode?: 'server' | 'client';
  pricingRules?: any;
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
  quoteMode: 'server',
  pricingRules: undefined,
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
  quoteMode = 'server',
  pricingRules,
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
  quoteMode?: 'server' | 'client';
  pricingRules?: any;
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
  const { control, getValues, handleSubmit, reset } = hookForm;
  const doSubmit = onSubmit ? handleSubmit(onSubmit) : undefined;

  const tags = getMerchiSourceJobTags();

  function applyOptionVisibility(
    variations: any[],
    visibleOptionIds: Set<number>
  ): boolean {
    let changed = false;
    (variations || []).forEach((variation: any) => {
      (variation.selectableOptions || []).forEach((option: any) => {
        // Mirror the server's per-option isVisible (selectedBy resolution).
        // available is defaulted true: client mode does not model inventory.
        const isVisible = visibleOptionIds.has(option.optionId);
        if (option.isVisible !== isVisible) {
          option.isVisible = isVisible;
          changed = true;
        }
        if (option.available !== true) {
          option.available = true;
          changed = true;
        }
      });
    });
    return changed;
  }

  function applyClientQuote(values: any) {
    const selections = toSelections(values, pricingRules);
    const result = pricing.estimateQuote(pricingRules, selections);
    if ('unsupported' in result) return null;
    // Option visibility is scoped per container, mirroring the server:
    // independent variations resolve against independent selections only; each
    // group resolves against its own selections + independent. Other groups
    // never leak in (so selecting 25mm in group 2 does not reveal a gated
    // option in group 1).
    const independentVisible = pricing.resolveVisibleOptionIds(pricingRules, {
      quantity: selections.quantity,
      fieldValues: selections.fieldValues,
    });
    let visibilityChanged = applyOptionVisibility(values.variations, independentVisible);
    if (pricingRules.hasGroups && Array.isArray(values.variationsGroups)) {
      values.variationsGroups.forEach((g: any, i: number) => {
        g.groupCost = result.groupCosts[i] ?? 0;
        const groupVisible = pricing.resolveVisibleOptionIds(pricingRules, {
          fieldValues: selections.fieldValues,
          groups: selections.groups ? [selections.groups[i]] : [],
        });
        if (applyOptionVisibility(g.variations, groupVisible)) {
          visibilityChanged = true;
        }
      });
    }
    const nextJob = {
      ...values,
      cost: result.cost,
      costPerUnit: result.costPerUnit,
      taxAmount: result.taxAmount,
      totalCost: result.totalCost,
      currency: result.currency,
    };
    setJob(nextJob);
    // Only re-seed the form when option visibility actually changed — i.e. on
    // selection changes, not on quantity edits. Cost/group-cost updates flow
    // through setJob without a reset. reset() makes useFieldArray remount its
    // items, which makes the browser lose the scroll position; capture and
    // restore it so the viewport doesn't jump when toggling a select.
    if (visibilityChanged) {
      const hasWindow = typeof window !== 'undefined';
      const scrollX = hasWindow ? window.scrollX : 0;
      const scrollY = hasWindow ? window.scrollY : 0;
      reset(nextJob);
      if (hasWindow && typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(() => window.scrollTo(scrollX, scrollY));
      }
    }
    return nextJob;
  }

  async function getQuote() {
    const values = await getValues();
    const cleanedValues = cleanJobVariationsAndGroups(values);
    if (quoteMode === 'client' && pricingRules) {
      try {
        const clientJob = applyClientQuote(cleanedValues);
        if (clientJob) return clientJob;
      } catch (e) {
        // fall through to server on any client-calc error
      }
    }
    setLoading(true);
    let data = { ...cleanedValues, product: { id: initProduct.id } };
    if (productHasGroups(initProduct)) {
      // if the product has group variation fields we delete quantity
      // because each group has it's own quantity
      delete data.quantity;
    }
    try {
      const r = await fetchJobQuote(data, apiUrl);
      const jobJson = r.toJson();
      setJob(jobJson);
      reset({ ...jobJson });
      return jobJson;
    } catch (e: any) {
      const message = e.errorMessage || e.message || 'Server error';
      showAlert({ message });
      console.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  const launchDraftApproveModal = async () => {
    // if the client has drafts which have not been approved, we launch a modal to approve them
    const designData = localStorage.getItem(`productDraftTemplate-${initProduct.id}`);

    if (designData) {
      try {
        const draftDataJson: DraftTemplateData[] = JSON.parse(designData);
        for (const draft of draftDataJson) {
          if (draft.productId === initProduct.id) {
            return true;
          }
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
      const jobData = await getQuote();
      if (!jobData) return;
      const openDraftModal = await launchDraftApproveModal();
      if (openDraftModal) {
        setDraftAppproveCallback(() => async (draftJobData) => {
          const finalJobData = draftJobData || jobData;
          if (!finalJobData.product) finalJobData.product = { id: initProduct.id };
          setTimeout(() => {
            onAddToCart({ ...finalJobData, tags });
          }, 0);
          return Promise.resolve();
        });
        setIsDraftModalOpen(true);
      } else {
        if (!jobData.product) jobData.product = { id: initProduct.id };
        setTimeout(() => {
          onAddToCart({ ...jobData, tags });
        }, 0);
      }
    }
    : undefined;

  const buyNow = onBuyNow
    ? async () => {
      const jobData = await getQuote();
      if (!jobData) return;
      const openDraftModal = await launchDraftApproveModal();
      if (openDraftModal) {
        setDraftAppproveCallback(async (draftJobData) => {
          onBuyNow({ ...(draftJobData || jobData) });
          return Promise.resolve();
        });
        setIsDraftModalOpen(true);
      } else {
        onBuyNow({ ...jobData });
      }
    }
    : undefined;
  const getSubmitQuote = onGetQuote
    ? async () => {
      const jobData = await getQuote();
      if (!jobData) return;
      const openDraftModal = await launchDraftApproveModal();
      if (openDraftModal) {
        setDraftAppproveCallback(async (draftJobData) => {
          onGetQuote({ ...(draftJobData || jobData) });
          return Promise.resolve();
        });
        setIsDraftModalOpen(true);
      } else {
        onGetQuote({ ...jobData });
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
          quoteMode,
          pricingRules,
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
          onSubmit,
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
