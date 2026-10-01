'use client';
import * as React from 'react';
import { useLayoutEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaChevronDown, FaDownload, FaPaintBrush, FaTimes } from 'react-icons/fa';
import { useMerchiFormContext } from '../../context/MerchiProductFormProvider';
import DropzoneInput from '../DropzoneInput';
import { templateDownloadHref, templateImageSources } from '../../utils/draftExport';
import {
  downloadableDraftTemplates,
  productAllowsClientDesign,
} from '../../utils/draftTemplates';
import { isProductLeadForm } from '../utils';
import {
  ArtworkPath,
  TemplateUpload,
  clearDrafts,
  completeGroupCount,
  loadArtworkPath,
  loadDrafts,
  loadTemplateUploads,
  missingDesignSlots,
  saveArtworkPath,
  saveDesignMethod,
  saveTemplateUploads,
} from '../../utils/draftStorage';
import DraftApprovePanel from './DraftApprovePanel';
import DraftDesignerSheet from './DraftDesignerSheet';

function TemplateAvatar({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span className='merchi-product-draft-template-avatar is-empty' aria-hidden='true'>
        {name.slice(0, 1).toUpperCase()}
      </span>
    );
  }
  return (
    <img
      className='merchi-product-draft-template-avatar'
      src={src}
      alt=''
      onError={() => setFailed(true)}
    />
  );
}

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
    apiUrl,
    classNameDraftCta,
    hookForm,
    job,
    product,
    setIsDraftDesignerOpen,
    setJob,
  } = useMerchiFormContext();
  const [draftRevision, setDraftRevision] = useState(0);
  const [artworkPath, setArtworkPath] = useState<ArtworkPath>('self');
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [uploads, setUploads] = useState<TemplateUpload[]>([]);

  const allowed = productAllowsClientDesign(product);
  const formValues = hookForm.watch ? hookForm.watch() : hookForm.getValues?.() || {};
  const drafts = typeof window !== 'undefined' && product?.id
    ? loadDrafts(product.id)
    : [];
  const status = useMemo(
    () => completeGroupCount(product, formValues, drafts),
    [product, formValues, drafts, draftRevision],
  );
  const hasSaved = status.complete > 0;
  const downloads = useMemo(() => {
    const templates = downloadableDraftTemplates(product, formValues);
    return templates
      .map((template, index) => {
        const name = String(template?.name || template?.file?.name || '').trim()
          || `Template ${index + 1}`;
        return {
          key: template?.id ?? index,
          href: templateDownloadHref(template, apiUrl),
          preview: templateImageSources(template, apiUrl)[0] || '',
          name,
          fileName: String(template?.file?.name || '').trim() || name,
        };
      })
      .filter((item) => item.href);
  }, [apiUrl, formValues, product]);

  React.useEffect(() => {
    if (!product?.id) return;
    setArtworkPath(loadArtworkPath(product.id));
    setUploads(loadTemplateUploads(product.id));
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
    saveTemplateUploads(product.id, []);
    setUploads([]);
    setJob({
      ...job,
      ownDrafts: [],
      clientFiles: [],
    });
    setDraftRevision((value) => value + 1);
    choosePath('self');
    saveDesignMethod(product.id, 'designer');
    setTemplatesOpen(false);
    setIsDraftDesignerOpen(true);
  }

  function openDesigner() {
    if (product?.id) saveDesignMethod(product.id, 'designer');
    setTemplatesOpen(false);
    setIsDraftDesignerOpen(true);
  }

  function toggleTemplates() {
    setTemplatesOpen((open) => {
      const next = !open;
      if (next && product?.id) saveDesignMethod(product.id, 'templates');
      return next;
    });
  }

  function rememberUploads(next: TemplateUpload[]) {
    setUploads(next);
    if (product?.id) {
      saveTemplateUploads(product.id, next);
      saveDesignMethod(product.id, 'templates');
    }
  }

  function addUpload(file: any) {
    if (file?.id == null || !product?.id) return;
    const productId = product.id;
    setUploads((current) => {
      const next = [
        ...current.filter((item) => String(item.id) !== String(file.id)),
        {
          id: file.id,
          name: String(file.name || 'Upload'),
          viewUrl: file.viewUrl || file.cachedViewUrl || '',
          downloadUrl: file.downloadUrl || '',
        },
      ];
      saveTemplateUploads(productId, next);
      saveDesignMethod(productId, 'templates');
      return next;
    });
  }

  function removeUpload(id: number | string) {
    rememberUploads(uploads.filter((item) => String(item.id) !== String(id)));
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
          {hasSaved ? (
            <span>
              {status.total === 1
                ? 'Draft saved'
                : `${status.complete} of ${status.total} groups saved`}
            </span>
          ) : null}
          <div className='merchi-product-draft-cta-choices'>
            <button
              type='button'
              className='merchi-product-draft-cta-btn'
              onClick={openDesigner}
            >
              <FaPaintBrush />
              Open Designer
            </button>
            <button
              type='button'
              className={`merchi-product-draft-cta-download${templatesOpen ? ' is-open' : ''}`}
              aria-expanded={templatesOpen}
              aria-controls='merchi-template-downloads'
              onClick={toggleTemplates}
            >
              <FaDownload />
              Download templates
              <FaChevronDown />
            </button>
          </div>
          {templatesOpen ? (
            <div
              id='merchi-template-downloads'
              className='merchi-product-draft-template-menu'
            >
              <p>Download the templates, edit them and then reupload them</p>
              {downloads.length ? (
                <ul className='merchi-product-draft-template-list'>
                  {downloads.map((item) => (
                    <li key={item.key}>
                      <TemplateAvatar src={item.preview} name={item.name} />
                      <span className='merchi-product-draft-template-name'>{item.name}</span>
                      <a
                        className='merchi-product-draft-template-download'
                        href={item.href}
                        download={item.fileName || true}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <FaDownload />
                        Download
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <span>No templates are available to download.</span>
              )}
              <div className='merchi-product-draft-template-drop'>
                <DropzoneInput
                  multiple
                  accept='.jpg,.jpeg,.png,.gif,.pdf,.svg,.ai,.eps'
                  placeholder='Upload edited templates'
                  onUploadSuccess={addUpload}
                />
              </div>
              {uploads.length ? (
                <ul className='merchi-product-draft-upload-list'>
                  {uploads.map((file) => (
                    <li key={file.id}>
                      <TemplateAvatar src={file.viewUrl || ''} name={file.name} />
                      <span className='merchi-product-draft-template-name'>{file.name}</span>
                      <button
                        type='button'
                        className='merchi-product-draft-upload-remove'
                        aria-label={`Remove ${file.name}`}
                        onClick={() => removeUpload(file.id)}
                      >
                        <FaTimes />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
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
