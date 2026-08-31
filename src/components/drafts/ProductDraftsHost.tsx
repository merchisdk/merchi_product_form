'use client';
import * as React from 'react';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { FaPaintBrush } from 'react-icons/fa';
import { useMerchiFormContext } from '../../context/MerchiProductFormProvider';
import {
  productAllowsClientDesign,
} from '../../utils/draftTemplates';
import { isProductLeadForm } from '../utils';
import {
  completeGroupCount,
  loadDrafts,
  missingDesignSlots,
} from '../../utils/draftStorage';
import DraftApprovePanel from './DraftApprovePanel';
import DraftDesignerSheet from './DraftDesignerSheet';

export default function ProductDraftsHost() {
  const {
    classNameDraftCta,
    hookForm,
    isDraftDesignerOpen,
    isDraftModalOpen,
    product,
    setIsDraftDesignerOpen,
    setIsDraftModalOpen,
    consumePendingCheckout,
  } = useMerchiFormContext();

  const allowed = productAllowsClientDesign(product);
  const formValues = hookForm.watch ? hookForm.watch() : hookForm.getValues?.() || {};
  const drafts = typeof window !== 'undefined' && product?.id
    ? loadDrafts(product.id)
    : [];
  const status = useMemo(
    () => completeGroupCount(product, formValues, drafts),
    [product, formValues, drafts],
  );
  const missing = useMemo(
    () => missingDesignSlots(product, formValues, drafts),
    [product, formValues, drafts],
  );

  if (!allowed || isProductLeadForm(product)) return null;

  function handleSaved() {
    setIsDraftDesignerOpen(false);
    const pending = consumePendingCheckout?.();
    if (pending) {
      pending();
      return;
    }
  }

  return (
    <>
      <div className={`${classNameDraftCta || ''} merchi-product-draft-cta`}>
        <div className='merchi-product-draft-cta-copy'>
          <strong>Design artwork</strong>
          <span>
            {status.total === 1
              ? (status.complete ? 'Draft saved' : 'Add artwork before checkout')
              : `${status.complete} of ${status.total} groups saved`}
          </span>
        </div>
        <button
          type='button'
          className='merchi-product-draft-cta-btn'
          onClick={() => setIsDraftDesignerOpen(true)}
        >
          <FaPaintBrush />
          {missing.length ? 'Design' : 'Edit'}
        </button>
      </div>

      <DraftDesignerSheet
        open={Boolean(isDraftDesignerOpen)}
        initialGroupIndex={missing[0]?.groupIndex || 0}
        onClose={() => setIsDraftDesignerOpen(false)}
        onSaved={handleSaved}
      />

      {isDraftModalOpen && typeof document !== 'undefined'
        ? createPortal(
          <div className='merchi-product-draft-approve' role='dialog' aria-modal='true'>
            <div className='merchi-product-draft-approve-panel'>
              <DraftApprovePanel />
            </div>
          </div>,
          document.body,
        )
        : null}
    </>
  );
}
