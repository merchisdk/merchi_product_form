'use client';
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Group, Image as KonvaImage, Layer, Line, Rect, Stage, Text, Transformer } from 'react-konva';
import type { DraftCanvasHandle, DraftCanvasObject, DraftCanvasState } from '../../utils/types';
import { cssFontFamily } from '../../utils/draftFonts';
import { captureStageArtboard, exportDraftPngs } from '../../utils/draftExport';
import { fitInside, fitTextBox, isBackgroundFill, isFullArtboardFill, printAreaGuides } from '../../utils/draftTemplates';
import { useHtmlImage } from './useHtmlImage';

interface Props {
  state: DraftCanvasState;
  templateSrc?: string | string[] | null;
  template?: any;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (state: DraftCanvasState) => void;
  onEditText: (id: string) => void;
}

function fitView(width: number, height: number, artW: number, artH: number) {
  const pad = 20;
  const scale = Math.min(
    (width - pad * 2) / Math.max(artW, 1),
    (height - pad * 2) / Math.max(artH, 1),
    1.5,
  );
  return {
    x: (width - artW * scale) / 2,
    y: (height - artH * scale) / 2,
    scale: Math.max(0.1, scale),
  };
}

const CanvasImage = React.forwardRef(function CanvasImage(
  {
    obj,
    listening,
    onSelect,
    onChange,
  }: {
    obj: DraftCanvasObject;
    listening: boolean;
    onSelect: () => void;
    onChange: (patch: Partial<DraftCanvasObject>) => void;
  },
  ref: any,
) {
  const image = useHtmlImage(obj.src);
  React.useEffect(() => {
    if (!image || !obj.lockAspectRatio) return;
    const next = fitInside(
      { x: obj.x, y: obj.y, width: obj.width, height: obj.height },
      image.naturalWidth || image.width,
      image.naturalHeight || image.height,
      true,
    );
    const sameRatio = Math.abs(
      (obj.width / Math.max(obj.height, 1))
      - (next.width / Math.max(next.height, 1))
    ) < 0.03;
    if (sameRatio) return;
    onChange(next);
  }, [image, obj.lockAspectRatio, obj.src]);
  if (!image) return null;
  return (
    <KonvaImage
      ref={ref}
      id={obj.id}
      image={image}
      x={obj.x}
      y={obj.y}
      width={obj.width}
      height={obj.height}
      rotation={obj.rotation}
      scaleX={obj.scaleX}
      scaleY={obj.scaleY}
      draggable={listening}
      listening={listening}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
      onTransformEnd={(e) => {
        const node = e.target;
        const sx = node.scaleX();
        const sy = node.scaleY();
        if (obj.lockAspectRatio) {
          node.scaleX(sx < 0 ? -1 : 1);
          node.scaleY(1);
          onChange({
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: Math.max(16, node.width() * Math.abs(sx)),
            height: Math.max(16, node.height() * Math.abs(sy)),
            scaleX: sx < 0 ? -1 : 1,
            scaleY: 1,
          });
          return;
        }
        onChange({
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: sx,
          scaleY: sy,
        });
      }}
    />
  );
});

const DraftCanvas = React.forwardRef<DraftCanvasHandle, Props>(function DraftCanvas({
  state,
  templateSrc,
  template,
  selectedId,
  onSelect,
  onChange,
  onEditText,
}, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const whiteRectRef = useRef<any>(null);
  const templateNodeRef = useRef<any>(null);
  const guideRefs = useRef<any[]>([]);
  const nodeRefs = useRef<Record<string, any>>({});
  const [size, setSize] = useState({ width: 320, height: 360 });
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const pinchRef = useRef({ dist: 0, scale: 1, x: 0, y: 0 });
  const [pinching, setPinching] = useState(false);
  const templateImage = useHtmlImage(templateSrc);
  const guides = useMemo(() => printAreaGuides(template), [template]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const apply = () => {
      const next = { width: el.clientWidth, height: el.clientHeight };
      setSize(next);
      setView(fitView(next.width, next.height, state.width, state.height));
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, [state.width, state.height]);

  React.useImperativeHandle(ref, () => ({
    async exportPngs() {
      const fallback = () => exportDraftPngs(state, templateSrc);
      const stage = stageRef.current;
      const hasTemplate = Array.isArray(templateSrc)
        ? templateSrc.length > 0
        : Boolean(templateSrc);
      if (!stage?.toDataURL || (hasTemplate && !templateNodeRef.current)) {
        return fallback();
      }

      const hide = (nodes: any[]) => nodes.forEach((node) => {
        try { node.visible(false); } catch { /* ignore */ }
      });
      const show = (nodes: any[]) => nodes.forEach((node) => {
        try { node.visible(true); } catch { /* ignore */ }
      });
      const chrome = [trRef.current, ...guideRefs.current].filter(Boolean);
      const artOnly = [whiteRectRef.current, templateNodeRef.current].filter(Boolean);

      try {
        hide(chrome);
        stage.draw();
        const canvasPreview = captureStageArtboard(stage, view, state);
        hide(artOnly);
        stage.draw();
        const draft = captureStageArtboard(stage, view, state);
        show([...artOnly, ...chrome]);
        stage.draw();
        if (draft && canvasPreview) return { draft, canvasPreview };
      } catch {
        show([...artOnly, ...chrome]);
        try { stage.draw(); } catch { /* ignore */ }
      }
      return fallback();
    },
  }), [state, templateSrc, view]);

  useEffect(() => {
    const transformer = trRef.current;
    if (!transformer) return undefined;
    const attach = () => {
      const node = selectedId ? nodeRefs.current[selectedId] : null;
      try {
        const onStage = Boolean(
          node && typeof node.getStage === 'function' && node.getStage()
        );
        transformer.nodes(onStage ? [node] : []);
        transformer.getLayer()?.batchDraw();
      } catch {
        transformer.nodes([]);
      }
    };
    attach();
    const raf = requestAnimationFrame(attach);
    return () => cancelAnimationFrame(raf);
  }, [selectedId, state.objects]);

  function patchObject(id: string, patch: Partial<DraftCanvasObject>) {
    onChange({
      ...state,
      objects: state.objects.map((obj) => (obj.id === id ? { ...obj, ...patch } : obj)),
    });
  }

  function handleWheel(e: any) {
    if (e.evt?.cancelable) e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const scaleBy = 1.06;
    const oldScale = view.scale;
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    const clamped = Math.min(4, Math.max(0.15, newScale));
    const mousePointTo = {
      x: (pointer.x - view.x) / oldScale,
      y: (pointer.y - view.y) / oldScale,
    };
    setView({
      scale: clamped,
      x: pointer.x - mousePointTo.x * clamped,
      y: pointer.y - mousePointTo.y * clamped,
    });
  }

  function handleTouchMove(e: any) {
    const touches = e.evt.touches;
    if (touches.length !== 2) return;
    if (e.evt?.cancelable) e.evt.preventDefault();
    const dist = Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY,
    );
    if (!pinchRef.current.dist) {
      pinchRef.current = { dist, scale: view.scale, x: view.x, y: view.y };
      setPinching(true);
      return;
    }
    const ratio = dist / pinchRef.current.dist;
    setView({
      x: pinchRef.current.x,
      y: pinchRef.current.y,
      scale: Math.min(4, Math.max(0.15, pinchRef.current.scale * ratio)),
    });
  }

  function handleTouchEnd() {
    pinchRef.current.dist = 0;
    setPinching(false);
  }

  return (
    <div ref={containerRef} className='merchi-product-draft-canvas'>
      <Stage
        ref={stageRef}
        width={size.width}
        height={size.height}
        onWheel={handleWheel}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) onSelect(null);
        }}
        onTap={(e) => {
          if (e.target === e.target.getStage()) onSelect(null);
        }}
      >
        <Layer>
          <Group x={view.x} y={view.y} scaleX={view.scale} scaleY={view.scale}>
            <Rect
              ref={whiteRectRef}
              width={state.width}
              height={state.height}
              fill='#ffffff'
              shadowBlur={8}
              shadowOpacity={0.12}
              onClick={() => onSelect(null)}
              onTap={() => onSelect(null)}
            />
            {templateImage ? (
              <KonvaImage
                ref={templateNodeRef}
                image={templateImage}
                width={state.width}
                height={state.height}
                listening={false}
              />
            ) : null}
            {state.objects.filter(isBackgroundFill).map((obj) => (
              <Rect
                key={obj.id}
                x={obj.x}
                y={obj.y}
                width={obj.width}
                height={obj.height}
                rotation={obj.rotation}
                scaleX={obj.scaleX}
                scaleY={obj.scaleY}
                fill={obj.fill || '#cccccc'}
                globalCompositeOperation={
                  isFullArtboardFill(obj, state.width, state.height)
                    ? 'multiply'
                    : 'source-over'
                }
                listening={false}
              />
            ))}
            {guides.map((guide, index) => (
              <Line
                key={`guide-${index}`}
                ref={(node) => {
                  if (node) guideRefs.current[index] = node;
                  else delete guideRefs.current[index];
                }}
                points={[
                  guide.x,
                  guide.y,
                  guide.x + guide.width,
                  guide.y,
                  guide.x + guide.width,
                  guide.y + guide.height,
                  guide.x,
                  guide.y + guide.height,
                  guide.x,
                  guide.y,
                ]}
                stroke='#2563eb'
                dash={[12, 8]}
                strokeWidth={2}
                listening={false}
              />
            ))}
            {state.objects.filter((obj) => !isBackgroundFill(obj)).sort((a, b) => {
              if (a.type === b.type) return 0;
              return a.type === 'image' ? 1 : b.type === 'image' ? -1 : 0;
            }).map((obj) => {
              const common = {
                ref: (node: any) => {
                  if (node) nodeRefs.current[obj.id] = node;
                  else delete nodeRefs.current[obj.id];
                },
                id: obj.id,
                x: obj.x,
                y: obj.y,
                width: obj.width,
                height: obj.height,
                rotation: obj.rotation,
                scaleX: obj.scaleX,
                scaleY: obj.scaleY,
                draggable: !pinching,
                onClick: () => onSelect(obj.id),
                onTap: () => onSelect(obj.id),
                onDblClick: () => obj.type === 'text' && onEditText(obj.id),
                onDblTap: () => obj.type === 'text' && onEditText(obj.id),
                onDragEnd: (e: any) => patchObject(obj.id, { x: e.target.x(), y: e.target.y() }),
                onTransformEnd: (e: any) => {
                  const node = e.target;
                  const sx = node.scaleX();
                  const sy = node.scaleY();
                  if (obj.type === 'text') {
                    const fontSize = Math.max(12, Math.round((obj.fontSize || 48) * Math.abs(sy)));
                    node.scaleX(sx < 0 ? -1 : 1);
                    node.scaleY(1);
                    const fitted = fitTextBox({
                      ...obj,
                      x: node.x(),
                      y: node.y(),
                      fontSize,
                    });
                    patchObject(obj.id, {
                      ...fitted,
                      rotation: node.rotation(),
                      fontSize,
                      scaleX: sx < 0 ? -1 : 1,
                      scaleY: 1,
                    });
                    return;
                  }
                  patchObject(obj.id, {
                    x: node.x(),
                    y: node.y(),
                    rotation: node.rotation(),
                    scaleX: sx,
                    scaleY: sy,
                  });
                },
              };
              if (obj.type === 'text') {
                return (
                  <Text
                    key={obj.id}
                    {...common}
                    text={obj.text || 'Text'}
                    fontSize={obj.fontSize || 48}
                    fill={obj.fill || '#111111'}
                    fontFamily={cssFontFamily(obj.fontFamily)}
                    align={obj.align || 'left'}
                    verticalAlign='middle'
                    lineHeight={1}
                    wrap='none'
                  />
                );
              }
              return (
                <CanvasImage
                  key={obj.id}
                  ref={(node: any) => {
                    if (node) nodeRefs.current[obj.id] = node;
                    else delete nodeRefs.current[obj.id];
                  }}
                  obj={obj}
                  listening={!pinching}
                  onSelect={() => onSelect(obj.id)}
                  onChange={(patch) => patchObject(obj.id, patch)}
                />
              );
            })}
            <Transformer
              ref={trRef}
              rotateEnabled
              keepRatio={
                (state.objects.find((obj) => obj.id === selectedId)?.type === 'text')
                || Boolean(state.objects.find((obj) => obj.id === selectedId)?.lockAspectRatio)
              }
              enabledAnchors={[
                'top-left',
                'top-right',
                'bottom-left',
                'bottom-right',
              ]}
              boundBoxFunc={(_oldBox, newBox) => {
                if (newBox.width < 16 || newBox.height < 16) return _oldBox;
                return newBox;
              }}
              anchorSize={22}
              borderStrokeWidth={2}
              padding={4}
            />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
});

export default DraftCanvas;
