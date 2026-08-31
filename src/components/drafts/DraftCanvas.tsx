'use client';
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Group, Image as KonvaImage, Layer, Line, Rect, Stage, Text, Transformer } from 'react-konva';
import type { DraftCanvasObject, DraftCanvasState } from '../../utils/types';
import { printAreaGuides } from '../../utils/draftTemplates';
import { useHtmlImage } from './useHtmlImage';

interface Props {
  state: DraftCanvasState;
  templateSrc?: string | null;
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
        onChange({
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
        });
      }}
    />
  );
});

export default function DraftCanvas({
  state,
  templateSrc,
  template,
  selectedId,
  onSelect,
  onChange,
  onEditText,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);
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

  useEffect(() => {
    const transformer = trRef.current;
    const node = selectedId ? nodeRefs.current[selectedId] : null;
    if (transformer) {
      transformer.nodes(node ? [node] : []);
      transformer.getLayer()?.batchDraw();
    }
  }, [selectedId, state.objects]);

  function patchObject(id: string, patch: Partial<DraftCanvasObject>) {
    onChange({
      ...state,
      objects: state.objects.map((obj) => (obj.id === id ? { ...obj, ...patch } : obj)),
    });
  }

  function handleWheel(e: any) {
    e.evt.preventDefault();
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
    e.evt.preventDefault();
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
                image={templateImage}
                width={state.width}
                height={state.height}
                listening={false}
              />
            ) : null}
            {guides.map((guide, index) => (
              <Line
                key={`guide-${index}`}
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
            {state.objects.map((obj) => {
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
                  patchObject(obj.id, {
                    x: node.x(),
                    y: node.y(),
                    rotation: node.rotation(),
                    scaleX: node.scaleX(),
                    scaleY: node.scaleY(),
                  });
                },
              };
              if (obj.type === 'rect') {
                return (
                  <Rect
                    key={obj.id}
                    {...common}
                    fill={obj.fill || '#cccccc'}
                  />
                );
              }
              if (obj.type === 'text') {
                return (
                  <Text
                    key={obj.id}
                    {...common}
                    text={obj.text || 'Text'}
                    fontSize={obj.fontSize || 48}
                    fill={obj.fill || '#111111'}
                    fontFamily={obj.fontFamily || 'sans-serif'}
                    align={obj.align || 'left'}
                    wrap='word'
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
              anchorSize={18}
              borderStrokeWidth={2}
            />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
}
