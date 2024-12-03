import { ProductType } from "./types";
const productNotFound = require('../images/product-not-found.png').default;

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
    activeTheme: {mainCss: {}},
    logo: {}
  },
  draftTemplates: {file: {}},
  groupBuyStatus: {},
  groupVariationFields: {options: {linkedFile: {}}},
  images: {},
  independentVariationFields: {options: {linkedFile: {}}},
  publicFiles: {},
};

export function productProfileUrl(product: any) {
  if (product && product.featureImage && product.featureImage.viewUrl) {
    return String(product.featureImage.viewUrl);
  }
  return productNotFound.src;
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
  return !!product?.groupVariationFields.length;
}
