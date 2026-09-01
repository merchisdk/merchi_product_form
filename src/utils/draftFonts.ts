export const DEFAULT_DRAFT_FONT = 'Inter';

export const DRAFT_TEXT_FONTS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Oswald', label: 'Oswald' },
  { value: 'Bebas Neue', label: 'Bebas Neue' },
  { value: 'Anton', label: 'Anton' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Impact', label: 'Impact' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Pacifico', label: 'Pacifico' },
  { value: 'Dancing Script', label: 'Dancing Script' },
  { value: 'Permanent Marker', label: 'Permanent Marker' },
  { value: 'Courier New', label: 'Courier New' },
] as const;

const GOOGLE_FONTS_HREF = [
  'https://fonts.googleapis.com/css2',
  '?family=Anton',
  '&family=Bebas+Neue',
  '&family=Dancing+Script:wght@500;700',
  '&family=Inter:wght@400;700',
  '&family=Merriweather:wght@400;700',
  '&family=Montserrat:wght@400;700',
  '&family=Oswald:wght@400;600',
  '&family=Pacifico',
  '&family=Permanent+Marker',
  '&family=Playfair+Display:wght@400;700',
  '&family=Poppins:wght@400;700',
  '&family=Roboto:wght@400;700',
  '&display=swap',
].join('');

export function cssFontFamily(family?: string): string {
  const name = family || DEFAULT_DRAFT_FONT;
  return /\s/.test(name) ? `"${name}"` : name;
}

export function ensureDraftFonts(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById('merchi-draft-fonts')) return;
  const link = document.createElement('link');
  link.id = 'merchi-draft-fonts';
  link.rel = 'stylesheet';
  link.href = GOOGLE_FONTS_HREF;
  document.head.appendChild(link);
}
