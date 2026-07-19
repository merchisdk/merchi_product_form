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
import { scrollToFirstFormError } from '../utils/formErrors';
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
  inventoryLoading?: boolean;
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
  inventoryLoading: false,
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
  classNameButtonSubmit = 'btn btn-primary merchi-embed-form_button-submit',
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
  pricingRules: pricingRulesProp,
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
  const hookForm = useForm({
    defaultValues: defaultJob,
    // Re-check rules as the user edits after the first validation attempt.
    reValidateMode: 'onChange',
  });
  const [client, setClient] = useState(currentUser);
  const [alert, showAlert] = useState((null as any));
  const [draftApproveCallback, setDraftAppproveCallback] = useState<((job: any) => Promise<void>) | null>(null);
  const [job, setJob] = useState<any>(defaultJob);
  const [loading, setLoading] = useState(false);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const { control, getValues, handleSubmit, reset, trigger } = hookForm;
  const doSubmit = onSubmit
    ? handleSubmit(onSubmit, () => {
        scrollToFirstFormError();
      })
    : undefined;

  /** Run field rules (including MOQ) before buy / cart / quote actions. */
  const validateForm = async (): Promise<boolean> => {
    const valid = await trigger();
    if (!valid) {
      scrollToFirstFormError();
    }
    return valid;
  };

  const tags = getMerchiSourceJobTags();

  const inventoryRefreshTimer = React.useRef<any>(null);
  const serverQuoteTimer = React.useRef<any>(null);
  const quoteRequestId = React.useRef(0);
  const SERVER_QUOTE_DEBOUNCE_MS = 1000;

  // Client-side quoting is driven solely by the product's clientSideCalculation
  // attribute (set by the manager). It is the single source of truth.
  const clientSideEnabled = Boolean(initProduct?.clientSideCalculation);

  // When client-side quoting is enabled the form fetches its own pricing-rules
  // bundle. A `pricingRules` prop, if supplied, overrides the fetch (lets a
  // consumer prefetch). Until rules are available the dispatcher falls back to
  // server.
  const [fetchedPricingRules, setFetchedPricingRules] = useState<any>(null);
  const pricingRules = pricingRulesProp || fetchedPricingRules;

  React.useEffect(() => {
    if (!clientSideEnabled || pricingRulesProp || !initProduct?.id) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const base = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
        const res = await fetch(`${base}products/${initProduct.id}/pricing-rules/`);
        if (!res.ok) return;
        const rules = await res.json();
        if (!cancelled) setFetchedPricingRules(rules);
      } catch (e) {
        // Best-effort: form falls back to server-side quoting on failure.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clientSideEnabled, pricingRulesProp, initProduct?.id, apiUrl]);

  React.useEffect(() => () => {
    if (serverQuoteTimer.current) {
      clearTimeout(serverQuoteTimer.current);
    }
  }, []);

  function variationsHaveFieldMetadata(jobValues: any): boolean {
    const check = (variations: any[] | undefined) =>
      !Array.isArray(variations) ||
      variations.every((variation) => variation?.variationField?.fieldType != null);
    if (!check(jobValues?.variations)) return false;
    if (Array.isArray(jobValues?.variationsGroups)) {
      return jobValues.variationsGroups.every((group: any) =>
        check(group?.variations)
      );
    }
    return true;
  }

  function applyOptionVisibility(
    variations: any[],
    visibleOptionIds: Set<number>,
    unavailableOptionIds: Set<number>
  ): boolean {
    let changed = false;
    (variations || []).forEach((variation: any) => {
      (variation.selectableOptions || []).forEach((option: any) => {
        // Mirror the server's per-option isVisible (selectedBy resolution).
        const isVisible = visibleOptionIds.has(option.optionId);
        if (option.isVisible !== isVisible) {
          option.isVisible = isVisible;
          changed = true;
        }
        // Combination-aware availability: an option is unavailable when the
        // combination of (current inventory selections + this option) has no
        // matching stock. Non-inventory products yield an empty set -> all
        // available.
        const available = !unavailableOptionIds.has(option.optionId);
        if (option.available !== available) {
          option.available = available;
          changed = true;
        }
      });
    });
    return changed;
  }

  // For inventory-limited products, refresh quantity-dependent inventory
  // (group inventoryCount/inventorySufficient) from the authoritative server in
  // the background, debounced, and merge it through setJob (which renders
  // without a form reset, so the viewport never jumps). The client price stays
  // instant; the inventory badge catches up a beat later.
  function resetFormPreservingScroll(values: any) {
    const hasWindow = typeof window !== 'undefined';
    const scrollParent = findScrollParent();
    const scrollX = hasWindow ? window.scrollX : 0;
    const scrollY = hasWindow ? window.scrollY : 0;
    const parentTop = scrollParent ? scrollParent.scrollTop : 0;
    const parentLeft = scrollParent ? scrollParent.scrollLeft : 0;
    reset(values);
    if (hasWindow && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(() => {
        if (scrollParent) {
          scrollParent.scrollTop = parentTop;
          scrollParent.scrollLeft = parentLeft;
        } else {
          window.scrollTo(scrollX, scrollY);
        }
      });
    }
  }

  function findScrollParent(): HTMLElement | null {
    if (typeof document === 'undefined') return null;
    const active = document.activeElement as HTMLElement | null;
    let node: HTMLElement | null = active;
    while (node && node !== document.body) {
      const style = window.getComputedStyle(node);
      const canScrollY =
        (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
        node.scrollHeight > node.clientHeight;
      if (canScrollY) return node;
      // Radix ScrollArea viewport
      if (node.getAttribute('data-slot') === 'scroll-area-viewport') return node;
      node = node.parentElement;
    }
    const viewport = document.querySelector(
      '[data-slot="dialog-content"] [data-slot="scroll-area-viewport"]'
    ) as HTMLElement | null;
    return viewport;
  }

  function syncOptionVisibilityFromServer(
    currentVariations: any[],
    serverVariations: any[]
  ): boolean {
    let changed = false;
    (currentVariations || []).forEach((variation: any, vi: number) => {
      const serverVariation = serverVariations?.[vi];
      if (!serverVariation) return;
      if (serverVariation.onceOffCost !== undefined) {
        variation.onceOffCost = serverVariation.onceOffCost;
      }
      if (serverVariation.unitCost !== undefined) {
        variation.unitCost = serverVariation.unitCost;
      }
      if (serverVariation.unitCostTotal !== undefined) {
        variation.unitCostTotal = serverVariation.unitCostTotal;
      }
      if (serverVariation.cost !== undefined) {
        variation.cost = serverVariation.cost;
      }
      (variation.selectableOptions || []).forEach((option: any, oi: number) => {
        const serverOption = serverVariation.selectableOptions?.[oi];
        if (!serverOption) return;
        if (option.isVisible !== serverOption.isVisible) {
          option.isVisible = serverOption.isVisible;
          changed = true;
        }
        if (option.available !== serverOption.available) {
          option.available = serverOption.available;
          changed = true;
        }
      });
    });
    return changed;
  }

  function formQuantitiesMatchRequest(
    formValues: any,
    requestData: any,
    product: any
  ): boolean {
    if (productHasGroups(product)) {
      const groups = requestData.variationsGroups || [];
      return groups.every((group: any, index: number) =>
        Number(group.quantity) === Number(formValues.variationsGroups?.[index]?.quantity)
      );
    }
    return Number(requestData.quantity) === Number(formValues.quantity);
  }

  function applyServerQuote(formValues: any, serverJob: any) {
    const cleanedFormValues = cleanJobVariationsAndGroups({ ...formValues });
    let visibilityChanged = syncOptionVisibilityFromServer(
      cleanedFormValues.variations,
      serverJob.variations
    );
    const mergedJob: any = {
      ...cleanedFormValues,
      cost: serverJob.cost,
      costPerUnit: serverJob.costPerUnit,
      taxAmount: serverJob.taxAmount,
      totalCost: serverJob.totalCost,
      currency: serverJob.currency,
      inventoryCount: serverJob.inventoryCount,
      inventorySufficient: serverJob.inventorySufficient,
    };
    if (
      Array.isArray(cleanedFormValues.variationsGroups)
      && Array.isArray(serverJob.variationsGroups)
    ) {
      mergedJob.variationsGroups = cleanedFormValues.variationsGroups.map(
        (group: any, index: number) => {
          const serverGroup = serverJob.variationsGroups[index];
          if (!serverGroup) return group;
          if (syncOptionVisibilityFromServer(group.variations, serverGroup.variations)) {
            visibilityChanged = true;
          }
          return {
            ...group,
            groupCost: serverGroup.groupCost,
            inventoryCount: serverGroup.inventoryCount,
            inventorySufficient: serverGroup.inventorySufficient,
            matchingInventories: serverGroup.matchingInventories,
          };
        }
      );
    }
    return { mergedJob, visibilityChanged };
  }

  function mergeInventory(prev: any, serverJob: any) {
    if (!prev) return prev;
    const merged: any = {
      ...prev,
      inventoryCount: serverJob.inventoryCount,
      inventorySufficient: serverJob.inventorySufficient,
    };
    if (Array.isArray(prev.variationsGroups) && Array.isArray(serverJob.variationsGroups)) {
      merged.variationsGroups = prev.variationsGroups.map((g: any, i: number) => {
        const sg = serverJob.variationsGroups[i];
        if (!sg) return g;
        return {
          ...g,
          inventoryCount: sg.inventoryCount,
          inventorySufficient: sg.inventorySufficient,
          matchingInventories: sg.matchingInventories,
        };
      });
    }
    return merged;
  }

  function scheduleInventoryRefresh(cleanedValues: any) {
    if (!pricingRules || !pricingRules.needsInventory) return;
    if (inventoryRefreshTimer.current) {
      clearTimeout(inventoryRefreshTimer.current);
    }
    // Show the loading state in the inventory pills from the moment a change is
    // made until the authoritative stock comes back (covers the debounce wait
    // and the request). This is separate from `loading` so the instant client
    // price never flickers to a spinner.
    setInventoryLoading(true);
    inventoryRefreshTimer.current = setTimeout(async () => {
      try {
        let data = { ...cleanedValues, product: { id: initProduct.id } };
        if (productHasGroups(initProduct)) {
          delete data.quantity;
        }
        const r = await fetchJobQuote(data, apiUrl);
        const serverJob = r.toJson();
        setJob((prev: any) => mergeInventory(prev, serverJob));
      } catch (e) {
        // Best-effort: if the inventory refresh fails the price is unaffected.
      } finally {
        setInventoryLoading(false);
      }
    }, 450);
  }

  function applyClientQuote(values: any) {
    const selections = toSelections(values, pricingRules);
    const result = pricing.estimateQuote(pricingRules, selections);
    if ('unsupported' in result) return null;
    // Visibility AND availability are scoped per container, mirroring the
    // server: independent variations resolve against independent selections
    // only; each group resolves against its own selections + independent.
    // Other groups never leak in. Availability is combination-aware: an option
    // is disabled when (current inventory selections + that option) has no
    // matching stock.
    const independentScope = {
      quantity: selections.quantity,
      fieldValues: selections.fieldValues,
    };
    const independentVisible = pricing.resolveVisibleOptionIds(pricingRules, independentScope);
    const independentUnavailable = pricing.resolveUnavailableOptionIds(pricingRules, independentScope);
    let visibilityChanged = applyOptionVisibility(
      values.variations, independentVisible, independentUnavailable
    );
    if (pricingRules.hasGroups && Array.isArray(values.variationsGroups)) {
      values.variationsGroups.forEach((g: any, i: number) => {
        g.groupCost = result.groupCosts[i] ?? 0;
        const groupScope = {
          fieldValues: selections.fieldValues,
          groups: selections.groups ? [selections.groups[i]] : [],
        };
        const groupVisible = pricing.resolveVisibleOptionIds(pricingRules, groupScope);
        const groupUnavailable = pricing.resolveUnavailableOptionIds(pricingRules, groupScope);
        if (applyOptionVisibility(g.variations, groupVisible, groupUnavailable)) {
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
    // Never reset with variations that lost variationField — that collapses
    // the form (DynamicVariationInput cannot render without field metadata).
    if (visibilityChanged && variationsHaveFieldMetadata(nextJob)) {
      resetFormPreservingScroll(nextJob);
    }
    return nextJob;
  }

  async function executeServerQuote(): Promise<any | null> {
    const values = getValues();
    const cleanedValues = cleanJobVariationsAndGroups(values);
    const requestId = ++quoteRequestId.current;
    setLoading(true);
    let data = { ...cleanedValues, product: { id: initProduct.id } };
    if (productHasGroups(initProduct)) {
      // if the product has group variation fields we delete quantity
      // because each group has it's own quantity
      delete data.quantity;
    }
    try {
      const r = await fetchJobQuote(data, apiUrl);
      if (requestId !== quoteRequestId.current) {
        return null;
      }
      const serverJob = r.toJson();
      const currentValues = getValues();
      if (!formQuantitiesMatchRequest(currentValues, data, initProduct)) {
        return null;
      }
      const { mergedJob, visibilityChanged } = applyServerQuote(currentValues, serverJob);
      setJob(mergedJob);
      // Keep the user's in-progress quantity values; only re-seed the form when
      // option visibility changed (mirrors client-side quoting).
      if (visibilityChanged && variationsHaveFieldMetadata(mergedJob)) {
        resetFormPreservingScroll(mergedJob);
      }
      return mergedJob;
    } catch (e: any) {
      const message = e.errorMessage || e.message || 'Server error';
      showAlert({ message });
      console.error(message);
      return null;
    } finally {
      if (requestId === quoteRequestId.current) {
        setLoading(false);
      }
    }
  }

  function getQuote(options?: { immediate?: boolean }): Promise<any | null> {
    const values = getValues();
    const cleanedValues = cleanJobVariationsAndGroups(values);
    if (clientSideEnabled && pricingRules) {
      try {
        const clientJob = applyClientQuote(cleanedValues);
        if (clientJob) {
          scheduleInventoryRefresh(cleanedValues);
          return Promise.resolve(clientJob);
        }
      } catch (e) {
        // fall through to server on any client-calc error
      }
    }
    if (options?.immediate) {
      if (serverQuoteTimer.current) {
        clearTimeout(serverQuoteTimer.current);
        serverQuoteTimer.current = null;
      }
      return executeServerQuote();
    }
    return new Promise((resolve) => {
      if (serverQuoteTimer.current) {
        clearTimeout(serverQuoteTimer.current);
      }
      serverQuoteTimer.current = setTimeout(async () => {
        serverQuoteTimer.current = null;
        resolve(await executeServerQuote());
      }, SERVER_QUOTE_DEBOUNCE_MS);
    });
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
      if (!(await validateForm())) return;
      const jobData = await getQuote({ immediate: true });
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
      if (!(await validateForm())) return;
      const jobData = await getQuote({ immediate: true });
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
      if (!(await validateForm())) return;
      const jobData = await getQuote({ immediate: true });
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
          inventoryLoading,
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
