import { useRef } from 'react';
import { useMerchiFormContext } from './context/MerchiProductFormProvider';
import {
  LinkedProductImage,
  LinkedProductImageState,
  resolveLinkedProductImage,
} from './utils/linkedProductImage';

export function useLinkedProductImage(): LinkedProductImage | null {
  const { product, hookForm } = useMerchiFormContext();
  const variations = hookForm.watch?.('variations');
  const variationsGroups = hookForm.watch?.('variationsGroups');
  const previous = useRef<LinkedProductImageState>({
    ids: [],
    winnerId: null,
    ready: false,
  });
  const resolved = resolveLinkedProductImage(
    product,
    { variations, variationsGroups },
    previous.current,
  );
  previous.current = {
    ids: resolved.ids,
    winnerId: resolved.winnerId,
    ready: true,
  };
  return resolved.image;
}
