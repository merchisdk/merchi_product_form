export enum ProductType {
  SUPPLIER_MOD = 0,
  SUPPLIER = 1,
  SELLER = 2,
  SELLER_MOD = 3,
  CLONED_SUPPLIER_MOD = 4,
  CLONED_SELLER_MOD = 5,
  PRODUCTION_MOD = 6,
  CLONED_SUPPLIER = 7,
  INVENTORY_SELLER = 8,
  INVENTORY_SUPPLIER = 9,
  SELLER_GROUP_BUY = 10,
  SUPPLIER_RESELL_MOD = 11,
  SUPPLIER_RESELL = 12,
  SUPPLIER_GROUP_BUY_INVENTORY = 13,
  CLONED_INVENTORY_SELLER = 14,
  CLONED_SELLER_GROUP_BUY_INVENTORY = 15,
  CLONED_SUPPLIER_RESELL_MOD = 16,
  SUPPLIER_TO_SUPPLIER_RESELL_MOD = 17,
  CLONED_SUPPLIER_RESELL = 18,
  SUPPLY_DOMAIN_REFERENCE = 19,
  SELLER_FILE_DOWNLOAD = 20,
  SUPPLIER_MOD_SUPPLY_CHAIN_REQUEST = 21,
  SUPPLIER_SUPPLY_CHAIN_REQUEST = 22,
  LEAD_FORM = 23,
}

export enum FieldType {
  TEXT_INPUT = 1,
  SELECT = 2,
  FILE_UPLOAD = 3,
  TEXT_AREA = 4,
  NUMBER_INPUT = 5,
  CHECKBOX = 6,
  RADIO = 7,
  FIELD_INSTRUCTIONS = 8,
  IMAGE_SELECT = 9,
  COLOUR_PICKER = 10,
  COLOUR_SELECT = 11,
  TURNAROUND_TIME = 12,
  COLOUR_EXTRACT = 13,
  AREA = 14,
}

export type DraftCanvasObjectType = 'text' | 'image' | 'rect';

export type DraftArtworkRole =
  | 'auto'
  | 'text'
  | 'image'
  | 'text_fill'
  | 'body_colour_fill';

export interface DraftFieldBinding {
  fieldId: number;
  role?: DraftArtworkRole;
  targetFieldId?: number;
  lockAspectRatio?: boolean;
}

export interface DraftCanvasObject {
  id: string;
  type: DraftCanvasObjectType;
  merchiFieldId?: number;
  colourFieldId?: number;
  artworkRole?: DraftArtworkRole;
  locked?: boolean;
  lockAspectRatio?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  text?: string;
  fontSize?: number;
  fill?: string;
  fontFamily?: string;
  align?: string;
  src?: string;
}

export interface DraftCanvasState {
  width: number;
  height: number;
  objects: DraftCanvasObject[];
  detachedFieldIds?: number[];
}

export interface RenderedDraftPreview {
  templateId: number;
  draft: string; // base64 string of the template artwork as a draft
  canvasPreview: string; // base64 string of the template rendered with the full canvas
  canvasJson?: DraftCanvasState;
}

export interface DraftTemplateData {
  groupIndex: number;
  productId: number;
  templateData: RenderedDraftPreview[];
  previews: any[];
}

export const BLANK_TEMPLATE_ID = 0;
export const DEFAULT_ARTBOARD = { width: 1000, height: 1000 };

export interface MerchiFile {
  id?: number;
  uploadId?: string;
  name?: string | null;
  mimetype?: string | null;
  size?: number;
  creationDate?: Date | null;
  archived?: Date | null;
  cachedViewUrl?: string | null;
  viewUrlExpires?: Date | null;
  cachedDownloadUrl?: string | null;
  fileData?: File;
}
