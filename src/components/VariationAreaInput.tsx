'use client';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useController } from 'react-hook-form';
import VariationError from './VariationError';
import VariationLabel from './VariationLabel';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';
import {
  AreaUnit,
  DisplayModality,
  clampWithAspectRatio,
  displayToMm,
  formatAreaSummary,
  formatAreaValue,
  localePrefersImperial,
  mmToDisplay,
  parseAreaValue,
  unitLabel,
} from '../utils/area';

interface Props {
  disabled?: boolean;
  name: string;
  variation: any;
}

function VariationAreaInput({ disabled, name, variation }: Props) {
  const {
    classNameInputContainer,
    classNameInput,
    control,
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
    localePrefersImperial() ? 'imperial' : 'metric'
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
      field.onChange('');
      return;
    }
    field.onChange(formatAreaValue(h, w));
  };

  const updateHeight = (raw: string) => {
    if (raw === '') {
      field.onChange('');
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n) || n <= 0) return;
    const mm = displayToMm(n, modality, areaUnit);
    commitMm(mm, widthMm > 0 ? widthMm : mm * (aspectRatio || 1), 'height');
  };

  const updateWidth = (raw: string) => {
    if (raw === '') {
      field.onChange('');
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
    const common = {
      id,
      'aria-label': `${variationField.name} ${dim}`,
      disabled,
      className: `${classNameInput} ${validationClass}`,
      step:
        modality === 'imperial'
          ? 0.125
          : areaUnit === 'm'
            ? 0.001
            : areaUnit === 'cm'
              ? 0.1
              : 1,
    };
    if (inputType === 'slider') {
      const min = minDisp ?? 0;
      const max = maxDisp ?? Math.max(min + 1, Number(displayValue) || min + 1);
      return (
        <input
          {...common}
          type="range"
          value={displayValue === '' ? min : displayValue}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
        />
      );
    }
    return (
      <input
        {...common}
        type="number"
        value={displayValue === '' ? '' : displayValue}
        onChange={(e) => onChange(e.target.value)}
        min={minDisp}
        max={maxDisp}
        placeholder={variationField.placeholder || ''}
      />
    );
  };

  return (
    <div className={`${classNameInputContainer} merchi-input-area-container`}>
      <VariationLabel
        name={name}
        variationClassName="merchi-input-area"
        variation={variation}
      />
      <div
        className="merchi-area-modality-toggle"
        style={{ display: 'flex', gap: 8, marginBottom: 8 }}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => setModality('metric')}
          style={{ fontWeight: modality === 'metric' ? 700 : 400 }}
        >
          Metric
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setModality('imperial')}
          style={{ fontWeight: modality === 'imperial' ? 700 : 400 }}
        >
          Imperial
        </button>
        {aspectLocked ? (
          <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.75 }}>
            Aspect ratio locked
          </span>
        ) : null}
      </div>
      <div
        className="merchi-area-dimensions"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
      >
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>Height ({label})</span>
          {renderControl(
            'height',
            heightDisplay === '' ? '' : Number(heightDisplay),
            updateHeight,
            heightMinDisp,
            heightMaxDisp
          )}
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>Width ({label})</span>
          {renderControl(
            'width',
            widthDisplay === '' ? '' : Number(widthDisplay),
            updateWidth,
            widthMinDisp,
            widthMaxDisp
          )}
        </label>
      </div>
      {summary ? (
        <div
          className="merchi-area-summary"
          style={{ marginTop: 8, fontSize: 13 }}
        >
          {summary}
        </div>
      ) : null}
      <VariationError name={name} />
    </div>
  );
}

export default VariationAreaInput;
