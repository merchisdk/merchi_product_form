import { PANTONE_COLOURS, PantoneColour } from './pantoneColours.data';

const byCode = new Map(
  PANTONE_COLOURS.map((colour) => [colour.code.toUpperCase(), colour])
);

export type { PantoneColour };
export { PANTONE_COLOURS };

export function normalisePantoneCode(value?: string | null): string | null {
  if (!value) return null;
  const text = value
    .trim()
    .replace(/^(?:pantone|pms)\s+/i, '')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return null;
  const parts = text.split(' ');
  const joined = parts[parts.length - 1]?.match(/^(\d+)([A-Za-z])$/);
  if (joined) {
    parts[parts.length - 1] = joined[1];
    parts.push(joined[2]);
  }
  return byCode.get(parts.join(' ').toUpperCase())?.code ?? null;
}

export function pantoneByCode(value?: string | null): PantoneColour | null {
  const code = normalisePantoneCode(value);
  if (!code) return null;
  return byCode.get(code.toUpperCase()) ?? null;
}

export function searchPantoneColours(query: string, limit = 40): PantoneColour[] {
  const raw = query.trim().toLowerCase().replace(/^(?:pantone|pms)\s+/, '');
  if (!raw) return [];
  const spaced = raw.replace(/[_-]/g, ' ').replace(/\s+/g, ' ');
  const compact = spaced.replace(/\s/g, '');
  const ranked: { colour: PantoneColour; rank: number }[] = [];
  for (const colour of PANTONE_COLOURS) {
    const code = colour.code.toLowerCase();
    const tight = code.replace(/\s/g, '');
    if (!code.includes(spaced) && !tight.includes(compact)) continue;
    const rank =
      code.startsWith(spaced) || tight.startsWith(compact)
        ? 0
        : code.split(' ').some((part) => part.startsWith(spaced))
          ? 1
          : 2;
    ranked.push({ colour, rank });
  }
  ranked.sort((left, right) => left.rank - right.rank);
  return ranked.slice(0, limit).map((item) => item.colour);
}
