'use client';
import * as React from 'react';
import { createPortal } from 'react-dom';

export interface PantoneBrowserSwatch {
  key: string;
  code: string;
  hex: string;
  book?: 'coated' | 'uncoated' | 'metallic' | 'pastel';
  disabled?: boolean;
}

const BOOKS: { id: 'all' | NonNullable<PantoneBrowserSwatch['book']>; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'coated', label: 'Coated' },
  { id: 'uncoated', label: 'Uncoated' },
  { id: 'metallic', label: 'Metallic' },
  { id: 'pastel', label: 'Pastel' },
];

const ROW_HEIGHT = 86;
const COLUMN_GAP = 8;
const MIN_COLUMN = 96;

function matchesQuery(code: string, query: string) {
  const raw = query.trim().toLowerCase().replace(/^(?:pantone|pms)\s+/, '');
  if (!raw) return true;
  const spaced = raw.replace(/[_-]/g, ' ').replace(/\s+/g, ' ');
  const compact = spaced.replace(/\s/g, '');
  const lower = code.toLowerCase();
  return lower.includes(spaced) || lower.replace(/\s/g, '').includes(compact);
}

function useWindowedRows(open: boolean, count: number, resetKey: string) {
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const observerRef = React.useRef<ResizeObserver | null>(null);
  const [width, setWidth] = React.useState(640);
  const [height, setHeight] = React.useState(420);
  const [scrollTop, setScrollTop] = React.useState(0);

  const bindScroller = React.useCallback((node: HTMLDivElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    scrollerRef.current = node;
    if (!node) return;
    const measure = () => {
      const style = window.getComputedStyle(node);
      const pad =
        parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      setWidth(Math.max(0, node.clientWidth - pad));
      setHeight(node.clientHeight || 420);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    observerRef.current = observer;
  }, []);

  React.useEffect(() => () => observerRef.current?.disconnect(), []);

  React.useEffect(() => {
    if (!open) return;
    setScrollTop(0);
    scrollerRef.current?.scrollTo({ top: 0 });
  }, [open, resetKey]);

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  const columns = Math.max(1, Math.floor((width + COLUMN_GAP) / (MIN_COLUMN + COLUMN_GAP)));
  const rowCount = Math.ceil(count / columns);
  const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 2);
  const end = Math.min(rowCount, start + Math.ceil(height / ROW_HEIGHT) + 5);

  return { columns, start, end, rowCount, bindScroller, onScroll };
}

export function PantoneColourBrowser({
  open,
  title = 'Pantone colours',
  description = 'Swatches are screen approximations.',
  swatches,
  selectedKeys,
  showBooks = false,
  onClose,
  onSelect,
}: {
  open: boolean;
  title?: string;
  description?: string;
  swatches: PantoneBrowserSwatch[];
  selectedKeys: string[];
  showBooks?: boolean;
  onClose: () => void;
  onSelect: (swatch: PantoneBrowserSwatch) => void;
}) {
  const [query, setQuery] = React.useState('');
  const [book, setBook] = React.useState<(typeof BOOKS)[number]['id']>('all');
  const searchRef = React.useRef<HTMLInputElement>(null);
  const onCloseRef = React.useRef(onClose);
  const titleId = React.useId();
  const selected = React.useMemo(() => new Set(selectedKeys), [selectedKeys]);
  onCloseRef.current = onClose;

  const visible = React.useMemo(() => {
    return swatches.filter((swatch) => {
      if (showBooks && book !== 'all' && swatch.book !== book) return false;
      return matchesQuery(swatch.code, query);
    });
  }, [book, query, showBooks, swatches]);

  const { columns, start, end, rowCount, bindScroller, onScroll } = useWindowedRows(
    open,
    visible.length,
    `${book}|${query}`
  );

  React.useEffect(() => {
    if (!open) return;
    setQuery('');
    setBook('all');
    const previous = document.activeElement as HTMLElement | null;
    const frame = window.requestAnimationFrame(() => searchRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      previous?.focus?.();
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  const rows = [];
  for (let index = start; index < end; index += 1) {
    rows.push(visible.slice(index * columns, (index + 1) * columns));
  }

  return createPortal(
    <div className='merchi-pantone-browser' role='presentation'>
      <button
        type='button'
        className='merchi-pantone-browser-backdrop'
        aria-label='Close Pantone colours'
        onClick={onClose}
      />
      <div
        className='merchi-pantone-browser-dialog'
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        <div className='merchi-pantone-browser-header'>
          <div>
            <h2 id={titleId}>{title}</h2>
            <p>{description}</p>
          </div>
          <button type='button' className='merchi-pantone-browser-close' onClick={onClose} aria-label='Close'>
            ×
          </button>
        </div>
        <div className='merchi-pantone-browser-tools'>
          <input
            ref={searchRef}
            className='merchi-pantone-browser-search'
            type='search'
            value={query}
            placeholder='Search Pantone, e.g. 185 C'
            aria-label='Search Pantone colours'
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.preventDefault();
            }}
          />
          {showBooks && (
            <div className='merchi-pantone-browser-books' role='tablist' aria-label='Pantone books'>
              {BOOKS.map((item) => (
                <button
                  key={item.id}
                  type='button'
                  role='tab'
                  aria-selected={book === item.id}
                  className={`merchi-pantone-browser-book${book === item.id ? ' is-active' : ''}`}
                  onClick={() => setBook(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
          <p className='merchi-pantone-browser-count'>
            {visible.length.toLocaleString()} {visible.length === 1 ? 'colour' : 'colours'}
          </p>
        </div>
        <div
          ref={bindScroller}
          className='merchi-pantone-browser-scroll'
          role='listbox'
          aria-label={title}
          onScroll={onScroll}
        >
          {visible.length === 0 ? (
            <p className='merchi-pantone-browser-empty'>No matching Pantone colours</p>
          ) : (
            <div style={{ position: 'relative', height: rowCount * ROW_HEIGHT }}>
              {rows.map((row, rowIndex) => (
                <div
                  key={start + rowIndex}
                  className='merchi-pantone-browser-row'
                  style={{
                    position: 'absolute',
                    top: (start + rowIndex) * ROW_HEIGHT,
                    left: 0,
                    right: 0,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                    gap: COLUMN_GAP,
                  }}
                >
                  {row.map((swatch) => {
                    const isSelected = selected.has(swatch.key);
                    return (
                      <button
                        key={swatch.key}
                        type='button'
                        role='option'
                        aria-selected={isSelected}
                        disabled={swatch.disabled}
                        className={`merchi-pantone-swatch${isSelected ? ' is-selected' : ''}`}
                        onClick={() => onSelect(swatch)}
                      >
                        <span
                          className='merchi-pantone-swatch-chip'
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <span className='merchi-pantone-swatch-code'>{swatch.code}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
