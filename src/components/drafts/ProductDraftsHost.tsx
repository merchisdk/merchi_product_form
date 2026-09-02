'use client';
import * as React from 'react';
import { useLayoutEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaPaintBrush } from 'react-icons/fa';
import { useMerchiFormContext } from '../../context/MerchiProductFormProvider';
import {
  productAllowsClientDesign,
} from '../../utils/draftTemplates';
import { isProductLeadForm } from '../utils';
import {
  ArtworkPath,
  clearDrafts,
  completeGroupCount,
  loadArtworkPath,
  loadDrafts,
  missingDesignSlots,
  saveArtworkPath,
} from '../../utils/draftStorage';
import DraftApprovePanel from './DraftApprovePanel';
import DraftDesignerSheet from './DraftDesignerSheet';

function findCheckoutButtonsEl(): HTMLElement | null {
  const marked = document.querySelector('[data-merchi-checkout-buttons]');
  if (marked instanceof HTMLElement) return marked;
  const named = document.querySelector(
    '.merchi-product-buttons-submit-container, .merchi-action-buttons-container',
  );
  if (named instanceof HTMLElement) return named;
  const submit = document.querySelector('.merchi-embed-form_button-submit');
  return submit instanceof HTMLElement ? submit.parentElement : null;
}

export function ProductDraftsCta() {
  const {
    classNameDraftCta,
    hookForm,
    job,
    product,
    setIsDraftDesignerOpen,
    setJob,
  } = useMerchiFormContext();
  const [draftRevision, setDraftRevision] = useState(0);
  const [artworkPath, setArtworkPath] = useState<ArtworkPath>('self');

  const allowed = productAllowsClientDesign(product);
  const formValues = hookForm.watch ? hookForm.watch() : hookForm.getValues?.() || {};
  const drafts = typeof window !== 'undefined' && product?.id
    ? loadDrafts(product.id)
    : [];
  const status = useMemo(
    () => completeGroupCount(product, formValues, drafts),
    [product, formValues, drafts, draftRevision],
  );
  const missing = useMemo(
    () => missingDesignSlots(product, formValues, drafts),
    [product, formValues, drafts, draftRevision],
  );
  const hasSaved = status.complete > 0;

  React.useEffect(() => {
    if (!product?.id) return;
    setArtworkPath(loadArtworkPath(product.id));
  }, [product?.id]);

  if (!allowed || isProductLeadForm(product)) return null;

  function choosePath(path: ArtworkPath) {
    setArtworkPath(path);
    if (product?.id) saveArtworkPath(product.id, path);
  }

  function startAgain() {
    if (!product?.id) return;
    const confirmed = window.confirm(
      'This will clear your saved artwork. Start again from scratch?',
    );
    if (!confirmed) return;
    clearDrafts(product.id);
    setJob({
      ...job,
      ownDrafts: [],
      clientFiles: [],
    });
    setDraftRevision((value) => value + 1);
    choosePath('self');
    setIsDraftDesignerOpen(true);
  }

  return (
    <div className={`${classNameDraftCta || ''} merchi-product-draft-cta`}>
      <strong className='merchi-product-draft-cta-heading'>Artwork</strong>
      <div className='merchi-product-draft-cta-tabs' role='tablist' aria-label='Artwork options'>
        <button
          type='button'
          role='tab'
          aria-selected={artworkPath === 'self'}
          className={`merchi-product-draft-cta-tab${artworkPath === 'self' ? ' is-active' : ''}`}
          onClick={() => choosePath('self')}
        >
          Design myself
        </button>
        <button
          type='button'
          role='tab'
          aria-selected={artworkPath === 'service'}
          className={`merchi-product-draft-cta-tab${artworkPath === 'service' ? ' is-active' : ''}`}
          onClick={() => choosePath('service')}
        >
          Free design service
        </button>
      </div>
      {artworkPath === 'self' ? (
        <div className='merchi-product-draft-cta-panel' role='tabpanel'>
          <span>
            Use the online designer to place text, colours, and logos on the template.
          </span>
          {hasSaved ? (
            <span>
              {status.total === 1
                ? 'Draft saved'
                : `${status.complete} of ${status.total} groups saved`}
            </span>
          ) : null}
          <div className='merchi-product-draft-cta-actions'>
            <button
              type='button'
              className='merchi-product-draft-cta-btn'
              onClick={() => setIsDraftDesignerOpen(true)}
            >
              <FaPaintBrush />
              {missing.length ? 'Open designer' : 'Edit'}
            </button>
            {hasSaved ? (
              <button
                type='button'
                className='merchi-product-draft-cta-reset'
                onClick={startAgain}
              >
                Start again
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className='merchi-product-draft-cta-panel' role='tabpanel'>
          <span>
            Skip the designer and add to cart, buy now, or get a quote. We&apos;ll create a free
            draft for you after the order.
          </span>
        </div>
      )}
    </div>
  );
}

export default function ProductDraftsHost() {
  const {
    hookForm,
    isDraftDesignerOpen,
    isDraftModalOpen,
    product,
    setIsDraftDesignerOpen,
    consumePendingCheckout,
  } = useMerchiFormContext();

  const allowed = productAllowsClientDesign(product);
  const formValues = hookForm.watch ? hookForm.watch() : hookForm.getValues?.() || {};
  const drafts = typeof window !== 'undefined' && product?.id
    ? loadDrafts(product.id)
    : [];
  const missing = useMemo(
    () => missingDesignSlots(product, formValues, drafts),
    [product, formValues, drafts],
  );
  const [ctaAnchor, setCtaAnchor] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!allowed || isProductLeadForm(product)) return;
    if (document.querySelector('.merchi-product-draft-cta')) return;

    const buttons = findCheckoutButtonsEl();
    if (!buttons?.parentElement) return;

    const slot = document.createElement('div');
    slot.setAttribute('data-merchi-draft-cta-slot', 'true');
    buttons.parentElement.insertBefore(slot, buttons);
    setCtaAnchor(slot);
    return () => {
      slot.remove();
      setCtaAnchor(null);
    };
  }, [allowed, product]);

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
      {ctaAnchor ? createPortal(<ProductDraftsCta />, ctaAnchor) : null}

      <DraftDesignerSheet
        open={Boolean(isDraftDesignerOpen)}
        initialGroupIndex={missing[0]?.groupIndex || 0}
        onClose={() => setIsDraftDesignerOpen(false)}
        onSaved={handleSaved}
      />

      {isDraftModalOpen && typeof document !== 'undefined'
        ? createPortal(
          <div
            className='merchi-product-draft-approve'
            role='dialog'
            aria-modal='true'
            aria-labelledby='merchi-product-draft-approve-title'
          >
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
