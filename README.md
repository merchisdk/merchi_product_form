# nerchi_product_form

Merchi product form for Next.js

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)

## Installation

```bash
npm install merchi_product_form

or

yarn add merchi_product_form
```

## Usage

```
import MerchiProductForm from 'merchi_product_form';
import { notFound } from 'next/navigation';

export async function fetchProduct(id: number) {
  const url = `https://api.merchi.co/v6/products/${id}/`;
  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseJson = await response.json();
    return responseJson.product;
  } catch (e: any) {
    throw new Error(e);
  }
}

export default async function Page({ params: { id } } : { params: { id: number } }) {
  const initProduct = await fetchProduct(id);
  if (!dataProduct) return notFound();
  const onBuyNow = (job: Job) => console.log(job);
  const onGetQuote = (job: Job) => console.log(job);
  return (
    <MerchiProductForm
      initProduct={initProduct}
      onBuyNow={onBuyNow}
      onGetQuote={onGetQuote}
    />
  );
}
```

## Props

```
| Name                                  | Type       | Default                                           | Description                                         |
| ------------------------------------- | ---------- | ------------------------------------------------- | --------------------------------------------------- |
| `allowAddToCart`                      | `boolean?` | undefined                                         |                                                    |
| `btnNameAddToCart`                    | `string?`  | undefined                                         |                                                    |
| `classNameAlertSellerEditable`        | `string?`  | `'alert alert-light'`                             |                                                    |
| `classNameButtonSubmit`               | `string?`  | `'btn btn-primary w-100 merchi-embed-form_button-submit'` |                                                    |
| `classNameButtonGroupAdd`             | `string?`  | `'btn btn-white'`                                 |                                                    |
| `classNameButtonGroupRemove`          | `string?`  | `'btn btn-danger'`                                |                                                    |
| `classNameButtonsSubmitContainer`     | `string?`  | `'merchi-product-buttons-submit-container'`       |                                                    |
| `classNameFileUploadContainer`        | `string?`  | `'merchi-input-file-container'`                   |                                                    |
| `classNameFileUpload`                 | `string?`  | `'merchi-embed-form_dropzone'`                    |                                                    |
| `classNameFilePreviewContainer`       | `string?`  | `'uploaded-variation-file'`                       |                                                    |
| `classNameFileUploadTextContainer`    | `string?`  | `'merchi-embed-form_dropzone-text-container'`     |                                                    |
| `classNameFilePreviewIconWrapper`     | `string?`  | `'uploaded-variation-file-icon-wrapper'`          |                                                    |
| `classNameFileUploadButton`           | `string?`  | `'btn btn-sm btn-link ml-auto'`                   |                                                    |
| `classNameFileUploadIcon`             | `string?`  | `'merchi-embed-form_dropzone-icon'`               |                                                    |
| `classNameFileUploadIconSecond`       | `string?`  | `'merchi-embed-form_dropzone-icon-plus'`          |                                                    |
| `classNameFileUploadIconContainer`    | `string?`  | `'merchi-embed-form_dropzone-icon-container'`     |                                                    |
| `classNameFileListItem`               | `string?`  | `'list-group-item no-z-index-hover'`              |                                                    |
| `classNameFileButtonDownload`         | `string?`  | `'btn btn-sm btn-secondary'`                      |                                                    |
| `classNameFileButtonDelete`           | `string?`  | `'btn btn-sm btn-danger ml-2'`                    |                                                    |
| `classNameFileListItemContainer`      | `string?`  | `'list-group'`                                    |                                                    |
| `classNameGroupsContainer`            | `string?`  | `'merchi-embed-form_product-group-container'`     |                                                    |
| `classNameGroupPriceContainer`        | `string?`  | `'merchi-embed-form_product-group-total-cost'`    |                                                    |
| `classNameInput`                      | `string?`  | `'form-control'`                                  |                                                    |
| `classNameInventoryStatus`            | `string?`  | `'flex-fill'`                                     |                                                    |
| `classNameInputContainer`             | `string?`  | `'merchi-embed-form_product-group-input-qty-container'` |                                              |
| `classNameOptionContainer`            | `string?`  | `'merchi-embed-form_checkbox_radio-item'`         |                                                    |
| `classNameOptionInput`                | `string?`  | `'merchi-embed-form_checkbox_radio-input'`        |                                                    |
| `classNameOptionLabel`                | `string?`  | `'merchi-embed-form_checkbox_radio-label'`        |                                                    |
| `classNameOptionSuper`                | `string?`  | `'merchi-embed-form_checkbox_radio-super'`        |                                                    |
| `classNameOptionsCheckboxRadioContainer`| `string?` | `''`                                              |                                                   |
| `classNameOptionImage`                | `string?`  | `'merchi-embed-form_image-select-option-item-img'`|                                                    |
| `classNameOptionImageContainer`       | `string?`  | `'merchi-embed-form_image-select-option-item-container'` |                                             |
| `classNameOptionColour`               | `string?`  | `'merchi-embed-form_color-select-indicator'`      |                                                    |
| `classNameOptionColourContainer`      | `string?`  | `'merchi-embed-form_color-select-item'`           |                                                    |
| `classNameProductTitle`               | `string?`  | `'merchi-product-title'`                          |                                                    |
| `classNameProductOriginTitle`         | `string?`  | `'merchi-product-origin-title'`                   |                                                    |
| `classNameProductTotalContainer`      | `string?`  | `'merchi-embed-form_summary-product-cost-container'` |                                                 |
| `classNameProductTotal`               | `string?`  | `'merchi-embed-form_summary-product-cost'`        |                                                    |
| `classNameQuantityLabelContainer`     | `string?`  | `'merchi-embed-form_quantity-label-container'`    |                                                    |
| `classNameUnitPrice`                  | `string?`  | undefined                                         |                                                    |
| `currentUser`                         | `User?`    | undefined                                         |                                                    |
| `hideCost`                            | `boolean?` | undefined                                         |                                                    |
| `hideCalculatedPrice`                 | `boolean?` | undefined                                         |                                                    |
| `hideQuantityField`                   | `boolean?` | undefined                                         |                                                    |
| `hideRequestQuotationButton`          | `boolean?` | undefined                                         |                                                    |
| `hidePaymentUpfrontButton`            | `boolean?` | undefined                                         |                                                    |
| `initProduct`                         | `Product`  | undefined                                         |                                                    |
| `isCartItem`                          | `boolean?` | undefined                                         |                                                    |
| `onAddToCart`                         | `() => void?` | undefined                                      |                                                    |
| `onBuyNow`                            | `() => void?` | undefined                                      |                                                    |
| `onGetQuote`                          | `() => void?` | undefined                                      |                                                    |
| `productFormId`                       | `string?`  | undefined                                         |                                                    |
| `showCurrency`                        | `boolean?` | undefined                                         |                                                    |
| `showCurrencyCode`                    | `boolean?` | undefined                                         |                                                    |
| `showUnitPrice`                       | `boolean?` | undefined                                         |                                                    |

```
