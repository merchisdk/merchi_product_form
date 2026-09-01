'use client';
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  FaArrowDown,
  FaArrowUp,
  FaCheck,
  FaFont,
  FaImage,
  FaLayerGroup,
  FaLock,
  FaPlus,
  FaUnlock,
  FaTimes,
  FaTrash,
} from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { useMerchiFormContext } from '../../context/MerchiProductFormProvider';
import {
  createObjectId,
  designGroupCount,
  detachField,
  productHasVariationGroups,
  seedOrSyncCanvas,
  templatesForGroup,
  variationsForGroup,
} from '../../utils/draftTemplates';
import {
  loadDrafts,
  pruneDrafts,
  saveDrafts,
  savedPreview,
  upsertGroupTemplateDraft,
} from '../../utils/draftStorage';
import { exportDraftPngs } from '../../utils/draftExport';
import {
  DraftCanvasObject,
  DraftCanvasState,
} from '../../utils/types';
import {
  DEFAULT_DRAFT_FONT,
  DRAFT_TEXT_FONTS,
  cssFontFamily,
  ensureDraftFonts,
} from '../../utils/draftFonts';

const DraftCanvas = React.lazy(() => import('./DraftCanvas'));

class DraftCanvasBoundary extends React.Component<
  { children: React.ReactNode },
  { error: string | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: unknown) {
    return {
      error: error instanceof Error ? error.message : 'Canvas failed to load',
    };
  }

  render() {
    if (this.state.error) {
      return (
        <div className='merchi-product-draft-canvas-fallback'>
          {this.state.error}
        </div>
      );
    }
    return this.props.children;
  }
}

function stopBubble(event: React.SyntheticEvent) {
  event.stopPropagation();
}

interface Props {
  open: boolean;
  initialGroupIndex?: number;
  onClose: () => void;
  onSaved: () => void;
}

function templateSrc(template: any): string | undefined {
  return template?.file?.viewUrl || template?.file?.cachedViewUrl || undefined;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function DraftDesignerSheet({
  open,
  initialGroupIndex = 0,
  onClose,
  onSaved,
}: Props) {
  const {
    classNameDraftSheet,
    hookForm,
    product,
  } = useMerchiFormContext();
  const formValues = hookForm.watch();
  const hasGroups = productHasVariationGroups(product);
  const groupCount = designGroupCount(product, formValues);
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
  const [templateIndex, setTemplateIndex] = useState(0);
  const [state, setState] = useState<DraftCanvasState>({
    width: 1000,
    height: 1000,
    objects: [],
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [layersOpen, setLayersOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const templates = useMemo(
    () => templatesForGroup(
      product,
      formValues?.variations || [],
      formValues?.variationsGroups?.[groupIndex]?.variations || [],
    ),
    [product, formValues, groupIndex],
  );
  const template = templates[Math.min(templateIndex, templates.length - 1)] || templates[0];

  useEffect(() => {
    if (open) setGroupIndex(initialGroupIndex);
  }, [open, initialGroupIndex]);

  useEffect(() => {
    if (open) ensureDraftFonts();
  }, [open]);

  const variationSyncKey = JSON.stringify(
    variationsForGroup(formValues, groupIndex).map((variation: any) => ({
      id: variation?.variationField?.id,
      value: variation?.value,
      files: (variation?.variationFiles || []).map(
        (file: any) => file?.viewUrl || file?.id
      ),
    }))
  );

  useEffect(() => {
    if (!open || !template) return;
    const drafts = loadDrafts(product.id);
    const saved = savedPreview(drafts, groupIndex, template.id);
    const variations = variationsForGroup(formValues, groupIndex);
    setState(seedOrSyncCanvas(saved?.canvasJson || null, template, variations));
    setSelectedId(null);
    setEditingTextId(null);
    setError(null);
    // Reload the saved canvas when switching group/template, not on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, groupIndex, template?.id, product?.id]);

  useEffect(() => {
    if (!open || !template) return;
    const variations = variationsForGroup(formValues, groupIndex);
    setState((current) => {
      const next = seedOrSyncCanvas(current, template, variations);
      const same = current.width === next.width
        && current.height === next.height
        && current.objects.length === next.objects.length
        && current.objects.every((obj, index) => {
          const other = next.objects[index];
          return obj.id === other.id
            && obj.text === other.text
            && obj.src === other.src
            && obj.fill === other.fill
            && obj.merchiFieldId === other.merchiFieldId;
        });
      return same ? current : next;
    });
  }, [open, variationSyncKey, template?.id, groupIndex]);

  const selected = state.objects.find((obj) => obj.id === selectedId) || null;

  function patchSelected(patch: Partial<DraftCanvasObject>) {
    if (!selectedId) return;
    setState((current) => ({
      ...current,
      objects: current.objects.map((obj) =>
        obj.id === selectedId ? { ...obj, ...patch } : obj
      ),
    }));
  }

  function addText() {
    const id = createObjectId();
    const obj: DraftCanvasObject = {
      id,
      type: 'text',
      x: state.width * 0.15,
      y: state.height * 0.15,
      width: state.width * 0.7,
      height: 72,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      text: 'Your text',
      fontSize: 56,
      fontFamily: DEFAULT_DRAFT_FONT,
      fill: '#111111',
    };
    setState((current) => ({ ...current, objects: [...current.objects, obj] }));
    setSelectedId(id);
    setEditingTextId(id);
  }

  async function addImage(file: File) {
    const src = await readFileAsDataUrl(file);
    const id = createObjectId();
    const obj: DraftCanvasObject = {
      id,
      type: 'image',
      x: state.width * 0.2,
      y: state.height * 0.2,
      width: state.width * 0.6,
      height: state.height * 0.6,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      src,
      lockAspectRatio: true,
    };
    setState((current) => ({ ...current, objects: [...current.objects, obj] }));
    setSelectedId(id);
  }

  function removeSelected() {
    if (!selectedId) return;
    setState((current) => detachField(current, selectedId));
    setSelectedId(null);
    setEditingTextId(null);
  }

  function moveLayer(direction: 1 | -1) {
    if (!selectedId) return;
    setState((current) => {
      const index = current.objects.findIndex((obj) => obj.id === selectedId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.objects.length) {
        return current;
      }
      const objects = [...current.objects];
      const [item] = objects.splice(index, 1);
      objects.splice(nextIndex, 0, item);
      return { ...current, objects };
    });
  }

  async function handleDone() {
    if (!template || !product?.id) return;
    setSaving(true);
    setError(null);
    try {
      const pngs = await exportDraftPngs(state, templateSrc(template));
      const drafts = pruneDrafts(
        loadDrafts(product.id),
        designGroupCount(product, hookForm.getValues()),
      );
      const next = upsertGroupTemplateDraft(drafts, product.id, groupIndex, {
        templateId: template.id,
        canvasJson: state,
        ...pngs,
      });
      saveDrafts(product.id, next);
      onSaved();
    } catch (err: any) {
      setError(err?.message || 'Could not save draft');
    } finally {
      setSaving(false);
    }
  }

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`${classNameDraftSheet || ''} merchi-product-draft-sheet`}
      role='dialog'
      aria-modal='true'
      aria-label='Design artwork'
      onMouseDown={stopBubble}
      onClick={stopBubble}
    >
      <header className='merchi-product-draft-sheet-header'>
        <button
          type='button'
          className='merchi-product-draft-icon-btn'
          onClick={onClose}
          aria-label='Close designer'
        >
          <FaTimes />
        </button>
        <div className='merchi-product-draft-sheet-title'>
          <strong>{template?.name || 'Artwork'}</strong>
          {hasGroups ? <span>Group {groupIndex + 1}</span> : null}
        </div>
        <button
          type='button'
          className='merchi-product-draft-done-btn'
          onClick={handleDone}
          disabled={saving}
        >
          {saving ? <CgSpinner className='animate_spin' /> : <FaCheck />}
          Done
        </button>
      </header>

      {hasGroups && groupCount > 1 ? (
        <div className='merchi-product-draft-chips' role='tablist' aria-label='Groups'>
          {Array.from({ length: groupCount }, (_, index) => (
            <button
              key={index}
              type='button'
              role='tab'
              aria-selected={index === groupIndex}
              className={`merchi-product-draft-chip${index === groupIndex ? ' is-active' : ''}`}
              onClick={() => {
                setGroupIndex(index);
                setTemplateIndex(0);
              }}
            >
              Group {index + 1}
            </button>
          ))}
        </div>
      ) : null}

      {templates.length > 1 ? (
        <div className='merchi-product-draft-chips' role='tablist' aria-label='Templates'>
          {templates.map((item: any, index: number) => (
            <button
              key={item.id ?? index}
              type='button'
              role='tab'
              aria-selected={item.id === template?.id}
              className={`merchi-product-draft-chip${item.id === template?.id ? ' is-active' : ''}`}
              onClick={() => setTemplateIndex(index)}
            >
              {item.name || `Template ${index + 1}`}
            </button>
          ))}
        </div>
      ) : null}

      <div className='merchi-product-draft-main'>
        <div className='merchi-product-draft-sheet-body'>
          <DraftCanvasBoundary>
            <React.Suspense
              fallback={
                <div className='merchi-product-draft-canvas-fallback'>Loading canvas…</div>
              }
            >
              <DraftCanvas
                state={state}
                template={template}
                templateSrc={templateSrc(template)}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onChange={setState}
                onEditText={(id) => {
                  setLayersOpen(false);
                  setSelectedId(id);
                  setEditingTextId(id);
                }}
              />
            </React.Suspense>
          </DraftCanvasBoundary>

          {layersOpen ? (
            <div className='merchi-product-draft-layers'>
              <div className='merchi-product-draft-layers-head'>
                <strong>Layers</strong>
                <button type='button' onClick={() => setLayersOpen(false)} aria-label='Close layers'>
                  <FaTimes />
                </button>
              </div>
              {state.objects.length === 0 ? (
                <p>No objects yet. Add text or an image.</p>
              ) : (
                [...state.objects].reverse().map((obj, index) => (
                  <button
                    key={obj.id}
                    type='button'
                    className={`merchi-product-draft-layer${obj.id === selectedId ? ' is-active' : ''}`}
                    onClick={() => {
                      setSelectedId(obj.id);
                      setEditingTextId(null);
                    }}
                  >
                    <FaPlus className='merchi-product-draft-layer-icon' />
                    {obj.type === 'text' ? (obj.text || 'Text') : obj.type === 'image' ? 'Image' : 'Base colour'}
                    <span>{state.objects.length - index}</span>
                  </button>
                ))
              )}
            </div>
          ) : null}

        </div>

        {error ? <p className='merchi-product-draft-error'>{error}</p> : null}

        <aside className='merchi-product-draft-dock'>
          {selected ? (
            <div className='merchi-product-draft-inspector'>
              {selected.type === 'text' ? (
                <>
                  <textarea
                    className='merchi-product-draft-text-input'
                    value={selected.text || ''}
                    rows={2}
                    autoFocus={editingTextId === selected.id}
                    aria-label='Edit text'
                    onChange={(e) => patchSelected({ text: e.target.value })}
                  />
                  <label className='merchi-product-draft-font'>
                    <span className='merchi-sr-only'>Font</span>
                    <select
                      aria-label='Font'
                      value={selected.fontFamily || DEFAULT_DRAFT_FONT}
                      style={{ fontFamily: cssFontFamily(selected.fontFamily || DEFAULT_DRAFT_FONT) }}
                      onChange={(e) => patchSelected({ fontFamily: e.target.value })}
                    >
                      {DRAFT_TEXT_FONTS.map((font) => (
                        <option
                          key={font.value}
                          value={font.value}
                          style={{ fontFamily: cssFontFamily(font.value) }}
                        >
                          {font.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type='button'
                    className='merchi-product-draft-stepper'
                    onClick={() => patchSelected({
                      fontSize: Math.max(12, (selected.fontSize || 48) - 8),
                    })}
                    aria-label='Smaller text'
                  >
                    A-
                  </button>
                  <button
                    type='button'
                    className='merchi-product-draft-stepper'
                    onClick={() => patchSelected({
                      fontSize: Math.min(240, (selected.fontSize || 48) + 8),
                    })}
                    aria-label='Larger text'
                  >
                    A+
                  </button>
                  <label className='merchi-product-draft-color'>
                    <span className='merchi-sr-only'>Colour</span>
                    <input
                      type='color'
                      value={/^#[0-9a-fA-F]{6}$/.test(selected.fill || '') ? selected.fill : '#111111'}
                      onChange={(e) => patchSelected({ fill: e.target.value })}
                    />
                  </label>
                </>
              ) : null}
              {selected.type === 'image' ? (
                <button
                  type='button'
                  className={`merchi-product-draft-icon-btn${selected.lockAspectRatio ? ' is-active' : ''}`}
                  onClick={() => patchSelected({ lockAspectRatio: !selected.lockAspectRatio })}
                  aria-label={selected.lockAspectRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                >
                  {selected.lockAspectRatio ? <FaLock /> : <FaUnlock />}
                  Ratio
                </button>
              ) : null}
              {selected.type === 'rect' ? (
                <label className='merchi-product-draft-color'>
                  <span className='merchi-sr-only'>Fill colour</span>
                  <input
                    type='color'
                    value={selected.fill || '#cccccc'}
                    onChange={(e) => patchSelected({ fill: e.target.value })}
                  />
                </label>
              ) : null}
              <button
                type='button'
                className='merchi-product-draft-icon-btn'
                onClick={() => patchSelected({ scaleX: (selected.scaleX || 1) * -1 })}
                aria-label='Flip'
              >
                Flip
              </button>
              <button
                type='button'
                className='merchi-product-draft-icon-btn'
                onClick={() => moveLayer(1)}
                aria-label='Bring forward'
              >
                <FaArrowUp />
              </button>
              <button
                type='button'
                className='merchi-product-draft-icon-btn'
                onClick={() => moveLayer(-1)}
                aria-label='Send backward'
              >
                <FaArrowDown />
              </button>
              <button
                type='button'
                className='merchi-product-draft-icon-btn is-danger'
                onClick={removeSelected}
                aria-label='Delete'
              >
                <FaTrash />
              </button>
            </div>
          ) : null}

          <nav className='merchi-product-draft-toolbar' aria-label='Design tools'>
            <button
              type='button'
              onClick={() => {
                setLayersOpen(false);
                addText();
              }}
            >
              <FaFont />
              <span>Text</span>
            </button>
            <button
              type='button'
              onClick={() => {
                setLayersOpen(false);
                setEditingTextId(null);
                fileInputRef.current?.click();
              }}
            >
              <FaImage />
              <span>Image</span>
            </button>
            <button
              type='button'
              onClick={() => {
                setEditingTextId(null);
                setLayersOpen((openNow) => !openNow);
              }}
            >
              <FaLayerGroup />
              <span>Layers</span>
            </button>
            <button type='button' onClick={removeSelected} disabled={!selectedId}>
              <FaTrash />
              <span>Delete</span>
            </button>
          </nav>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            className='merchi-product-draft-file'
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) addImage(file);
              e.target.value = '';
            }}
          />
        </aside>
      </div>
    </div>,
    document.body,
  );
}
