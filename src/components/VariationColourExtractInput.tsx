'use client';
import * as React from 'react';
import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { FaTimes, FaTrash } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import DropzoneInput from './DropzoneInput';
import InputHiddenStatic from './InputHiddenStatic';
import VariationError from './VariationError';
import VariationLabel from './VariationLabel';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';

interface Props {
  disabled?: boolean;
  name: string;
  variation: any;
}

function VariationColourExtractInput({ disabled, name, variation }: Props) {
  const {
    apiUrl,
    classNameFileUploadContainer,
    control,
    hookForm,
  } = useMerchiFormContext();
  const { setValue, watch } = hookForm;
  const filesName = `${name}.variationFiles`;
  const { append, fields, remove, replace } = useFieldArray({
    control,
    keyName: 'fileId',
    name: filesName,
  });
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const variationField = variation.variationField || {};
  const fieldId = variationField.id;
  const selectedOptions = watch(`${name}.selectedOptions`) || [];

  const syncSelectedValue = (options: any[]) => {
    setValue(`${name}.selectedOptions`, options, { shouldDirty: true });
    setValue(
      `${name}.value`,
      options.map((option) => option.id).filter(Boolean).join(','),
      { shouldDirty: true }
    );
  };

  const extractColours = async (file: any) => {
    if (!fieldId || !file?.id) {
      setError('Unable to extract colours for this field.');
      return;
    }
    setExtracting(true);
    setError(null);
    try {
      const base = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
      const response = await fetch(
        `${base}variation-fields/${fieldId}/extract-colours/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileId: file.id }),
        }
      );
      if (!response.ok) {
        throw new Error(`Extract failed (${response.status})`);
      }
      const data = await response.json();
      syncSelectedValue(data.options || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to extract colours.');
      syncSelectedValue([]);
    } finally {
      setExtracting(false);
    }
  };

  const handleUploadSuccess = async (file: any) => {
    if (fields.length > 0) remove(0);
    append(file);
    await extractColours(file);
  };

  const handleRemoveColour = (index: number) => {
    const next = selectedOptions.filter((_: any, i: number) => i !== index);
    syncSelectedValue(next);
  };

  const handleColourChange = (index: number, colour: string) => {
    const next = selectedOptions.map((option: any, i: number) =>
      i === index ? { ...option, colour, value: colour } : option
    );
    syncSelectedValue(next);
  };

  return (
    <div className={classNameFileUploadContainer}>
      <VariationLabel
        name={name}
        variationClassName='merchi-embed-form_input-file'
        variation={variation}
      />
      <DropzoneInput
        accept='.jpg,.jpeg,.gif,.png,.webp'
        disabled={disabled || extracting}
        multiple={false}
        onUploadSuccess={handleUploadSuccess}
        placeholder={variationField.placeholder || 'Drop artwork image:'}
      />
      {extracting && (
        <div className='d-flex align-items-center mt-2'>
          <CgSpinner className='animate_spin mr-2' />
          <span>Extracting colours...</span>
        </div>
      )}
      {error && <div className='text-danger mt-2'>{error}</div>}
      <VariationError name={name} />
      <div className='uploaded-variation-files mt-2'>
        {fields.map((file: any, index: number) => (
          <div
            key={file.fileId || file.id || index}
            className='d-inline-flex align-items-center border rounded p-2 mr-2 mb-2'
          >
            <span className='mr-2'>{file.name || 'Uploaded image'}</span>
            {!disabled && (
              <button
                type='button'
                className='btn btn-sm btn-link text-danger p-0'
                onClick={() => {
                  replace([]);
                  syncSelectedValue([]);
                }}
              >
                <FaTrash />
              </button>
            )}
            <InputHiddenStatic
              name={`${filesName}[${index}].id`}
              rules={{ required: true }}
              value={file.id}
            />
          </div>
        ))}
      </div>
      {selectedOptions.length > 0 && (
        <div className='mt-3'>
          <div className='mb-2 font-weight-bold'>Extracted colours</div>
          <div className='d-flex flex-wrap'>
            {selectedOptions.map((option: any, index: number) => (
              <div
                key={option.id || index}
                className='d-inline-flex align-items-center border rounded px-2 py-1 mr-2 mb-2'
              >
                <input
                  type='color'
                  disabled={disabled}
                  value={option.colour || '#000000'}
                  onChange={(e) =>
                    handleColourChange(index, e.target.value.toUpperCase())
                  }
                  style={{
                    width: 28,
                    height: 28,
                    border: 'none',
                    padding: 0,
                    background: 'transparent',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                  }}
                />
                <span className='mx-2 text-uppercase' style={{ fontFamily: 'monospace' }}>
                  {option.colour || option.value}
                </span>
                {!disabled && (
                  <button
                    type='button'
                    className='btn btn-sm btn-link p-0'
                    onClick={() => handleRemoveColour(index)}
                  >
                    <FaTimes />
                  </button>
                )}
                <InputHiddenStatic
                  name={`${name}.selectedOptions[${index}].id`}
                  value={option.id}
                />
                <InputHiddenStatic
                  name={`${name}.selectedOptions[${index}].colour`}
                  value={option.colour || ''}
                />
                <InputHiddenStatic
                  name={`${name}.selectedOptions[${index}].value`}
                  value={option.value || option.colour || ''}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default VariationColourExtractInput;
