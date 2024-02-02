# merchi_product_form

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

| Name                                       | Type           | Default                                              | Description                                         |
| ------------------------------------------ | -------------- | ---------------------------------------------------- | --------------------------------------------------- |
| `apiUrl`                                   | `string?`      | `'https://api.merchi.co/v6/'`                        | The api url for merchi                              |
| `allowAddToCart`                           | `boolean?`     | undefined                                            | Controls if the add to cart button is shown         |
| `btnNameAddToCart`                         | `string?`      | undefined                                            | The text on the add to cart button                  |
| `classNameAlertSellerEditable`             | `string?`      | `'alert alert-light'`                                | Class for the seller editable alert element         |
| `classNameButtonSubmit`                    | `string?`      | `'btn btn-primary w-100 merchi-embed-form_button-submit'`| Class for the Submit button element             |
| `classNameButtonGroupAdd`                  | `string?`      | `'btn btn-white'`                                    | Class for the add group button element              |
| `classNameButtonGroupRemove`               | `string?`      | `'btn btn-danger'`                                   | Class for the delete group button element           |
| `classNameButtonsSubmitContainer`          | `string?`      | `'merchi-product-buttons-submit-container'`          | Class for the container of the submit buttons       |
| `classNameFileUploadContainer`             | `string?`      | `'merchi-input-file-container'`                      | Class for the input file container                  |
| `classNameFileUpload`                      | `string?`      | `'merchi-embed-form_dropzone'`                       | Class for the dropzone container                    |
| `classNameFilePreviewContainer`            | `string?`      | `'uploaded-variation-file'`                          | Class for the file variation upload element         |
| `classNameFileUploadTextContainer`         | `string?`      | `'merchi-embed-form_dropzone-text-container'`        | Class for the dropzone text element                 |
| `classNameFilePreviewIconWrapper`          | `string?`      | `'uploaded-variation-file-icon-wrapper'`             | Class for the upload variation icon wrapper         |
| `classNameFileUploadButton`                | `string?`      | `'btn btn-sm btn-link ml-auto'`                      | Class for the file upload button element            |
| `classNameFileUploadIcon`                  | `string?`      | `'merchi-embed-form_dropzone-icon'`                  | Class for the form dropzone icon element            |
| `classNameFileUploadIconSecond`            | `string?`      | `'merchi-embed-form_dropzone-icon-plus'`             | Class for the form dropzone plus icon element       |
| `classNameFileUploadIconContainer`         | `string?`      | `'merchi-embed-form_dropzone-icon-container'`        | Class for the form dropzone icon container          |
| `classNameFileListItem`                    | `string?`      | `'list-group-item no-z-index-hover'`                 | Class for file list item element                    |
| `classNameFileButtonDownload`              | `string?`      | `'btn btn-sm btn-secondary'`                         | Class for the file download button element          |
| `classNameFileButtonDelete`                | `string?`      | `'btn btn-sm btn-danger ml-2'`                       | Class for the file delete button element            |
| `classNameFileListItemContainer`           | `string?`      | `'list-group'`                                       | Class for the file item list                        |
| `classNameGroupsContainer`                 | `string?`      | `'merchi-embed-form_product-group-container'`        | Class for the product variation group container     |
| `classNameGroupPriceContainer`             | `string?`      | `'merchi-embed-form_product-group-total-cost'`       | Class for the variation group total cost            |
| `classNameInput`                           | `string?`      | `'form-control'`                                     | Class for form inputs                               |
| `classNameInventoryStatus`                 | `string?`      | `'flex-fill'`                                        | Class for the inventory status element              |
| `classNameInputContainer`                  | `string?`      | `'merchi-embed-form_product-group-input-qty-container'`| Class for the input container                     |
| `classNameOptionContainer`                 | `string?`      | `'merchi-embed-form_checkbox_radio-item'`            | Class for the radio/checkbox container              |
| `classNameOptionInput`                     | `string?`      | `'merchi-embed-form_checkbox_radio-input'`           | Class for the radio input                           |
| `classNameOptionLabel`                     | `string?`      | `'merchi-embed-form_checkbox_radio-label'`           | Class for the radio label                           |
| `classNameOptionSuper`                     | `string?`      | `'merchi-embed-form_checkbox_radio-super'`           | Class for the checkbox radio super                  |
| `classNameOptionsCheckboxRadioContainer`   | `string?`      | `''`                                                 | Class for the option checkbox/radio container       |
| `classNameOptionImage`                     | `string?`      | `'merchi-embed-form_image-select-option-item-img'`   | Class for the variation image select element        |
| `classNameOptionImageContainer`            | `string?`      | `'merchi-embed-form_image-select-option-item-container'`| Class for the variation image container element  |
| `classNameOptionColour`                    | `string?`      | `'merchi-embed-form_color-select-option'`            | Class for the variation colour element              |
| `classNameOptionColourContainer`           | `string?`      | `'merchi-embed-form_color-select-item'`              | Class for the variation colour container element    |
| `classNameProductTitle`                    | `string?`      | `'merchi-product-title'`                             | Class for the product title element                 |
| `classNameProductOriginTitle`              | `string?`      | `'merchi-product-origin-title'`                      | Class for the product origin title element          |
| `classNameProductTotalContainer`           | `string?`      | `'merchi-embed-form_summary-product-cost-container'` | Class for the product total cost container element  |
| `classNameProductTotal`                    | `string?`      | `'merchi-embed-form_summary-product-cost'`           | Class for the product total cost element            |
| `classNameQuantityLabelContainer`          | `string?`      | `'merchi-embed-form_quantity-label-container'`       | Class for the product quantity label element        |
| `classNameUnitPrice`                       | `string?`      | undefined                                            | Class for the unit price element                    |
| `currentUser`                              | `User?`        | undefined                                            | A Merchi client json object to be used as client    |
| `hideCost`                                 | `boolean?`     | undefined                                            | Hide the cost. Used for quote requests              |
| `hideCalculatedPrice`                      | `boolean?`     | undefined                                            | Hide calculated price. Used for quote requests      |
| `hideQuantityField`                        | `boolean?`     | undefined                                            | Hide Quantity field. Used for quote requests        |
| `hideRequestQuotationButton`               | `boolean?`     | undefined                                            | Hide request quote button                           |
| `hidePaymentUpfrontButton`                 | `boolean?`     | undefined                                            | Hide buy now button                                 |
| `isCartItem`                               | `boolean?`     | undefined                                            | Used if the product form in being used in cart item context |
| `initJob`                                  | `job | cartItem`| undefined                                           | The Merchi job or cartItem to be used for the form|
| `initProduct`                              | `Product`      | undefined                                            | The Merchi product to be used for the form        |
| `onAddToCart`                              | `() => void?`  | undefined                                            | An action to be applied to the add to cart button |
| `onBuyNow`                                 | `() => void?`  | undefined                                            | An action to be added to the buy now button       |
| `onGetQuote`                               | `() => void?`  | undefined                                            | An action to be added to the get quote button     |
| `onSubmit`                                 | `(data) => void?`| undefined                                          | An callback which returns the most recent job data|
| `productFormId`                            | `string?`      | undefined                                            | An option id to be applied to the product form    |
| `showCurrency`                             | `boolean?`     | undefined                                            | Show the currency icon to the user                |
| `showCurrencyCode`                         | `boolean?`     | undefined                                            | Show the currency code to the user                |
| `showUnitPrice`                            | `boolean?`     | undefined                                            | Show the unit price to the user                   |
