'use client';
import * as React from 'react';
import { useController } from 'react-hook-form';
import VariationError from './VariationError';
import VariationLabel from './VariationLabel';
import { VariationSelectColour } from './VariationSelectElements';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';
import { quoteAfterFieldChange } from './quoteAfterFieldChange';
import {
  pantoneByCode,
  searchPantoneColours,
} from '../utils/pantoneColours';

interface Props {
  disabled?: boolean;
  name: string;
  variation: any;
}

export function VariationPantoneSelect({ disabled, name, variation }: Props) {
  const allowAll = Boolean(variation?.variationField?.allowAllPantones);
  if (!allowAll) {
    return (
      <VariationSelectColour
        disabled={disabled}
        name={name}
        variation={variation}
      />
    );
  }
  return (
    <PantoneLibrarySelect
      disabled={disabled}
      name={name}
      variation={variation}
    />
  );
}

function PantoneLibrarySelect({ disabled, name, variation }: Props) {
  const { classNameInput, control, getQuote } = useMerchiFormContext();
  const { field } = useController({ name: `${name}.value`, control });
  const [query, setQuery] = React.useState('');
  const selected = pantoneByCode(field.value);
  const matches = searchPantoneColours(query);
  const choose = (code: string) => {
    quoteAfterFieldChange(field.onChange, getQuote, code);
    setQuery('');
  };

  return (
    <div>
      <VariationLabel
        name={name}
        variationClassName='merchi-embed-form_input-select'
        variation={variation}
      />
      {selected && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: '1px solid rgba(0,0,0,0.15)',
              background: selected.hex,
              display: 'inline-block',
            }}
          />
          <span>{selected.code}</span>
        </div>
      )}
      <input
        aria-label={variation?.variationField?.name || 'Pantone colour'}
        className={classNameInput}
        disabled={disabled}
        placeholder='Search Pantone, e.g. 185 C'
        type='search'
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {matches.length > 0 && (
        <div className='merchi-embed-form_color-select-container' style={{ marginTop: 8 }}>
          {matches.map((colour) => (
            <button
              key={colour.code}
              type='button'
              disabled={disabled}
              onClick={() => choose(colour.code)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                margin: 4,
                padding: '4px 8px',
                borderRadius: 8,
                border: field.value === colour.code ? '2px solid currentColor' : '1px solid rgba(0,0,0,0.15)',
                background: 'transparent',
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  background: colour.hex,
                  border: '1px solid rgba(0,0,0,0.12)',
                }}
              />
              {colour.code}
            </button>
          ))}
        </div>
      )}
      <VariationError name={name} />
    </div>
  );
}
