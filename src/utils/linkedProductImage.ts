export interface LinkedProductImage {
  id: string;
  viewUrl?: string;
}

export interface LinkedProductImageState {
  ids: number[];
  winnerId: number | null;
  ready: boolean;
}

function optionIdsFromVariation(variation: any): number[] {
  const raw = variation?.value;
  if (raw !== undefined && raw !== null && raw !== '') {
    const fromValue = String(raw)
      .split(',')
      .map((part) => parseInt(part.trim(), 10))
      .filter((id) => Number.isFinite(id));
    if (fromValue.length) return fromValue;
  }
  if (!Array.isArray(variation?.selectedOptions)) return [];
  return variation.selectedOptions
    .map((option: any) => Number(option?.id ?? option?.optionId))
    .filter((id: number) => Number.isFinite(id));
}

export function orderedSelectedOptionIds(job: any): number[] {
  const ids: number[] = [];
  const pushVariations = (variations: any) => {
    for (const variation of variations || []) {
      ids.push(...optionIdsFromVariation(variation));
    }
  };
  pushVariations(job?.variations);
  for (const group of job?.variationsGroups || []) {
    pushVariations(group?.variations);
  }
  const unique: number[] = [];
  const seen = new Set<number>();
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    unique.push(id);
  }
  return unique;
}

function optionsById(product: any): Map<number, any> {
  const map = new Map<number, any>();
  const fields = [
    ...(product?.independentVariationFields || []),
    ...(product?.groupVariationFields || []),
  ];
  for (const field of fields) {
    for (const option of field?.options || []) {
      const id = Number(option?.id);
      if (Number.isFinite(id)) map.set(id, option);
    }
  }
  return map;
}

export function linkedImageFromOption(option: any): LinkedProductImage | null {
  const file = option?.linkedProductImage;
  if (file?.id == null || file.id === '') return null;
  const image: LinkedProductImage = { id: String(file.id) };
  if (file.viewUrl) image.viewUrl = String(file.viewUrl);
  return image;
}

export function resolveLinkedProductImage(
  product: any,
  job: any,
  previous?: LinkedProductImageState | null,
): { image: LinkedProductImage | null; ids: number[]; winnerId: number | null } {
  const byId = optionsById(product);
  const ids = orderedSelectedOptionIds(job);
  const withImage = ids
    .map((id) => ({ id, image: linkedImageFromOption(byId.get(id)) }))
    .filter((item): item is { id: number; image: LinkedProductImage } => Boolean(item.image));
  const ready = Boolean(previous?.ready);
  const previousIds = previous?.ids || [];
  const added = ids.filter((id) => !previousIds.includes(id));
  const addedWithImage = added
    .map((id) => withImage.find((item) => item.id === id))
    .filter((item): item is { id: number; image: LinkedProductImage } => Boolean(item));

  let chosen: { id: number; image: LinkedProductImage } | undefined;
  if (!ready || previousIds.length === 0) {
    chosen = withImage[0];
  } else if (addedWithImage.length) {
    chosen = addedWithImage[addedWithImage.length - 1];
  } else if (
    previous?.winnerId != null
    && ids.includes(previous.winnerId)
  ) {
    chosen = withImage.find((item) => item.id === previous.winnerId) || withImage[0];
  } else {
    chosen = withImage[0];
  }

  return {
    image: chosen?.image ?? null,
    ids,
    winnerId: chosen?.id ?? null,
  };
}
