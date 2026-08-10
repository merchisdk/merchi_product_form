'use client';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useController } from 'react-hook-form';
import VariationError from './VariationError';
import VariationLabel from './VariationLabel';
import { quoteAfterFieldChange } from './quoteAfterFieldChange';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';
import {
  AreaUnit,
  DisplayModality,
  clampWithAspectRatio,
  defaultModalityForAreaUnit,
  displayToMm,
  formatAreaSummary,
  formatAreaValue,
  mmToDisplay,
  parseAreaValue,
  stepInDisplayUnit,
  unitLabel,
} from '../utils/area';

interface Props {
  disabled?: boolean;
  name: string;
  variation: any;
}

function formatDisplayValue(value: number | ''): string {
  if (value === '') return '—';
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  return String(Number(n.toFixed(4)));
}

function VariationAreaInput({ disabled, name, variation }: Props) {
  const {
    classNameInputContainer,
    classNameInput,
    control,
    getQuote,
  } = useMerchiFormContext();
  const variationField = variation.variationField || {};
  const areaUnit = (variationField.areaUnit || 'mm') as AreaUnit;
  const inputType = variationField.areaInputType === 'slider' ? 'slider' : 'input';
  const aspectLocked = Boolean(
    variationField.aspectRatioLock && variationField.aspectRatio
  );
  const aspectRatio = Number(variationField.aspectRatio) || 0;

  const {
    field,
    fieldState: { invalid },
  } = useController({
    name: `${name}.value`,
    control,
    rules: {
      required: variationField.required
        ? { value: true, message: `${variationField.name} is required` }
        : undefined,
      validate: (value: string) => {
        if (!value) {
          return variationField.required
            ? `${variationField.name} is required`
            : true;
        }
        return parseAreaValue(value) ? true : 'Enter valid height and width';
      },
    },
  });

  const [modality, setModality] = useState<DisplayModality>(() =>
    defaultModalityForAreaUnit(areaUnit)
  );

  const parsed = parseAreaValue(field.value);
  const heightMm = parsed?.heightMm ?? 0;
  const widthMm = parsed?.widthMm ?? 0;

  const heightDisplay = heightMm
    ? mmToDisplay(heightMm, modality, areaUnit)
    : '';
  const widthDisplay = widthMm
    ? mmToDisplay(widthMm, modality, areaUnit)
    : '';

  const heightMinDisp =
    variationField.heightFieldMin != null
      ? mmToDisplay(Number(variationField.heightFieldMin), modality, areaUnit)
      : undefined;
  const heightMaxDisp =
    variationField.heightFieldMax != null
      ? mmToDisplay(Number(variationField.heightFieldMax), modality, areaUnit)
      : undefined;
  const widthMinDisp =
    variationField.widthFieldMin != null
      ? mmToDisplay(Number(variationField.widthFieldMin), modality, areaUnit)
      : undefined;
  const widthMaxDisp =
    variationField.widthFieldMax != null
      ? mmToDisplay(Number(variationField.widthFieldMax), modality, areaUnit)
      : undefined;

  const commitMm = (
    nextHeightMm: number,
    nextWidthMm: number,
    changed: 'height' | 'width'
  ) => {
    let h = nextHeightMm;
    let w = nextWidthMm;
    if (aspectLocked && aspectRatio > 0) {
      const clamped = clampWithAspectRatio({
        heightMm: h,
        widthMm: w,
        changed,
        aspectRatio,
        heightMin:
          variationField.heightFieldMin != null
            ? Number(variationField.heightFieldMin)
            : null,
        heightMax:
          variationField.heightFieldMax != null
            ? Number(variationField.heightFieldMax)
            : null,
        widthMin:
          variationField.widthFieldMin != null
            ? Number(variationField.widthFieldMin)
            : null,
        widthMax:
          variationField.widthFieldMax != null
            ? Number(variationField.widthFieldMax)
            : null,
      });
      h = clamped.heightMm;
      w = clamped.widthMm;
    }
    if (!Number.isFinite(h) || !Number.isFinite(w) || h <= 0 || w <= 0) {
      quoteAfterFieldChange(field.onChange, getQuote, '');
      return;
    }
    quoteAfterFieldChange(field.onChange, getQuote, formatAreaValue(h, w));
  };

  const updateHeight = (raw: string) => {
    if (raw === '') {
      quoteAfterFieldChange(field.onChange, getQuote, '');
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n) || n <= 0) return;
    const mm = displayToMm(n, modality, areaUnit);
    commitMm(mm, widthMm > 0 ? widthMm : mm * (aspectRatio || 1), 'height');
  };

  const updateWidth = (raw: string) => {
    if (raw === '') {
      quoteAfterFieldChange(field.onChange, getQuote, '');
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n) || n <= 0) return;
    const mm = displayToMm(n, modality, areaUnit);
    commitMm(heightMm > 0 ? heightMm : mm / (aspectRatio || 1), mm, 'width');
  };

  const label = unitLabel(modality, areaUnit);
  const summary = useMemo(
    () => formatAreaSummary(field.value, modality, areaUnit),
    [field.value, modality, areaUnit]
  );
  const validationClass = invalid ? 'is-invalid' : '';

  useEffect(() => {
    if (field.value == null) field.onChange('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderControl = (
    dim: 'height' | 'width',
    displayValue: number | '',
    onChange: (raw: string) => void,
    minDisp?: number,
    maxDisp?: number
  ) => {
    const id = `${name}-${dim}`;
    const step = stepInDisplayUnit(
      variationField.areaStep ?? variationField.area_step,
      modality,
      areaUnit
    );
    if (inputType === 'slider') {
      const min = minDisp ?? 0;
      const max = maxDisp ?? Math.max(min + 1, Number(displayValue) || min + 1);
      return (
        <input
          id={id}
          type="range"
          aria-label={`${variationField.name} ${dim}`}
          disabled={disabled}
          className={`merchi-area-slider ${validationClass}`}
          value={displayValue === '' ? min : displayValue}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
        />
      );
    }
    return (
      <input
        id={id}
        type="number"
        aria-label={`${variationField.name} ${dim}`}
        disabled={disabled}
        className={`${classNameInput} ${validationClass}`}
        value={displayValue === '' ? '' : displayValue}
        onChange={(e) => onChange(e.target.value)}
        min={minDisp}
        max={maxDisp}
        step={step}
        placeholder={variationField.placeholder || ''}
      />
    );
  };

  const renderDimension = (
    dim: 'height' | 'width',
    title: string,
    displayValue: number | '',
    onChange: (raw: string) => void,
    minDisp?: number,
    maxDisp?: number
  ) => (
    <div className="merchi-area-dimension-row" key={dim}>
      <label className="merchi-area-dimension-label" htmlFor={`${name}-${dim}`}>
        <span className="merchi-area-dimension-name">{title}</span>
        <span className="merchi-area-dimension-meta">
          {formatDisplayValue(displayValue)} {label}
        </span>
      </label>
      {renderControl(dim, displayValue, onChange, minDisp, maxDisp)}
    </div>
  );

  return (
    <div className={`${classNameInputContainer} merchi-input-area-container`}>
      <VariationLabel
        name={name}
        variationClassName="merchi-input-area"
        variation={variation}
        valueSummary={summary}
      />
      <div className="merchi-area-modality-toggle">
        <span
          className={
            modality === 'metric'
              ? 'merchi-area-modality-label is-active'
              : 'merchi-area-modality-label'
          }
        >
          Metric
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={modality === 'imperial'}
          aria-label="Use imperial units"
          disabled={disabled}
          className={
            modality === 'imperial'
              ? 'merchi-area-modality-switch is-on'
              : 'merchi-area-modality-switch'
          }
          onClick={() =>
            setModality(modality === 'metric' ? 'imperial' : 'metric')
          }
        >
          <span className="merchi-area-modality-switch-thumb" />
        </button>
        <span
          className={
            modality === 'imperial'
              ? 'merchi-area-modality-label is-active'
              : 'merchi-area-modality-label'
          }
        >
          Imperial
        </span>
        {aspectLocked ? (
          <span className="merchi-area-aspect-lock">Aspect ratio locked</span>
        ) : null}
      </div>
      <div className="merchi-area-dimensions">
        {renderDimension(
          'width',
          'Width',
          widthDisplay === '' ? '' : Number(widthDisplay),
          updateWidth,
          widthMinDisp,
          widthMaxDisp
        )}
        {renderDimension(
          'height',
          'Height',
          heightDisplay === '' ? '' : Number(heightDisplay),
          updateHeight,
          heightMinDisp,
          heightMaxDisp
        )}
      </div>
      <VariationError name={name} />
    </div>
  );
}

export default VariationAreaInput;
