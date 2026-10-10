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
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const listId = React.useId();
  const selected = pantoneByCode(field.value);
  const matches = searchPantoneColours(query, 20);
  const showList = open && query.trim().length > 0;

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  React.useEffect(() => {
    if (!showList) return;
    document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({
      block: 'nearest',
    });
  }, [activeIndex, listId, showList]);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const choose = (code: string) => {
    quoteAfterFieldChange(field.onChange, getQuote, code);
    setQuery('');
    setOpen(false);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) =>
        Math.min(index + 1, Math.max(matches.length - 1, 0))
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter' && showList && matches[activeIndex]) {
      event.preventDefault();
      choose(matches[activeIndex].code);
    } else if (event.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
  };

  return (
    <div ref={rootRef}>
      <VariationLabel
        name={name}
        variationClassName='merchi-embed-form_input-select'
        variation={variation}
      />
      <div style={{ position: 'relative' }}>
        {selected && !open && (
          <span
            aria-hidden
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              width: 18,
              height: 18,
              marginTop: -9,
              borderRadius: 4,
              border: '1px solid rgba(0,0,0,0.12)',
              background: selected.hex,
              pointerEvents: 'none',
            }}
          />
        )}
        <input
          role='combobox'
          aria-autocomplete='list'
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={
            showList && matches[activeIndex]
              ? `${listId}-${activeIndex}`
              : undefined
          }
          aria-label={variation?.variationField?.name || 'Pantone colour'}
          className={classNameInput}
          disabled={disabled}
          placeholder='Search Pantone, e.g. 185 C'
          style={{
            paddingLeft: selected && !open ? 40 : undefined,
            paddingRight: 32,
          }}
          type='text'
          autoComplete='off'
          value={open ? query : selected?.code || ''}
          onFocus={() => {
            setOpen(true);
            setQuery('');
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
        />
        <span
          aria-hidden
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            marginTop: -2,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '6px solid currentColor',
            opacity: 0.55,
            pointerEvents: 'none',
          }}
        />
        {showList && (
          <ul
            id={listId}
            role='listbox'
            style={{
              position: 'absolute',
              zIndex: 30,
              top: '100%',
              left: 0,
              right: 0,
              maxHeight: 240,
              margin: '4px 0 0',
              padding: 4,
              overflowY: 'auto',
              listStyle: 'none',
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
          >
            {matches.length === 0 ? (
              <li style={{ padding: '8px 10px', color: '#6b7280' }}>
                No matching Pantone colours
              </li>
            ) : (
              matches.map((colour, index) => (
                <li
                  key={colour.code}
                  id={`${listId}-${index}`}
                  role='option'
                  aria-selected={field.value === colour.code}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    choose(colour.code);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    background:
                      index === activeIndex
                        ? 'rgba(37, 99, 235, 0.08)'
                        : 'transparent',
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      background: colour.hex,
                      border: '1px solid rgba(0,0,0,0.12)',
                      flex: '0 0 auto',
                    }}
                  />
                  {colour.code}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      <VariationError name={name} />
    </div>
  );
}
