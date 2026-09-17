import { ProductType } from "./types";
import { sanitizeProductVariationFields } from './variationFields';
const productNotFound = require('../images/product-not-found.png');

export const supplierProductCreationTypes: Array<number> = [
  ProductType.SUPPLIER_MOD,
  ProductType.SUPPLIER,
];

export const embedProducts: any = {
  domain: {
    company: {},
    logo: {},
  },
  featureImage: {},
  images: {},
};

export const embedProduct = {
  component: {},
  defaultJob: {},
  domain: {
    activeTheme: { mainCss: {} },
    logo: {}
  },
  draftTemplates: {
    file: {},
    selectedByVariationFieldOptions: {},
    editedByVariationFields: {},
  },
  groupBuyStatus: {},
  groupVariationFields: {
    options: { linkedFile: {}, selectedBy: {} },
    selectedBy: {},
  },
  images: {},
  independentVariationFields: {
    options: { linkedFile: {}, selectedBy: {} },
    selectedBy: {},
  },
  publicFiles: {},
};

export function productProfileUrl(product: any) {
  if (product && product.featureImage && product.featureImage.viewUrl) {
    return String(product.featureImage.viewUrl);
  }
  const image = productNotFound.default || productNotFound;
  return image ? (image.src || image) : '';
}

export function productFeatureImageUrl(product: any, noImageSrc?: string) {
  return product!.featureImage
    && product!.featureImage!.viewUrl
    ? product!.featureImage!.viewUrl
    : product!.images && product!.images[0]
      && product!.images[0]!.viewUrl
      ? product!.images[0]!.viewUrl
      : noImageSrc
        ? noImageSrc
        : productProfileUrl(product);
}

export function productHasGroups(product: any) {
  const fields = sanitizeProductVariationFields(product)?.groupVariationFields;
  return Array.isArray(fields) && fields.length > 0;
}

export function productHasGroupRows(job: any) {
  return Array.isArray(job?.variationsGroups) && job.variationsGroups.length > 0;
}

/** Product-level qty when there are no real group fields, or group rows never materialised. */
export function needsProductLevelQuantity(product: any, job?: any) {
  return !productHasGroups(product) || !productHasGroupRows(job);
}
