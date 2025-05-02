# Merchi Product Form

[![npm version](https://img.shields.io/npm/v/merchi_product_form.svg)](https://www.npmjs.com/package/merchi_product_form)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A React component library for rendering customizable e-commerce product forms for Merchi products. This package provides a seamless integration for Next.js applications, allowing for interactive product forms with various customization options.

## Features

- Interactive product form with real-time price calculations
- Customizable styling through extensive class name props
- Support for product variations, groups, and options
- File upload capability for product customizations
- Cart and quote request functionality
- Responsive design suitable for all devices

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Example](#usage-example)
- [Component Props](#component-props)
- [CSS Class Props](#css-class-props)
- [Styling](#styling)
- [Advanced Usage](#advanced-usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
# Using npm
npm install merchi_product_form

# Using yarn
yarn add merchi_product_form
```

## Quick Start

```jsx
import MerchiProductForm from 'merchi_product_form';

function ProductPage({ product }) {
  return (
    <MerchiProductForm
      initProduct={product}
      onBuyNow={(job) => console.log(job)}
      onGetQuote={(job) => console.log(job)}
    />
  );
}
```

## Usage Example

Here's a complete example of how to use the `MerchiProductForm` component in a Next.js page:

```jsx
import MerchiProductForm from 'merchi_product_form';
import { notFound } from 'next/navigation';

export async function fetchProduct(id) {
  const url = `https://api.merchi.co/v6/products/${id}/`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseJson = await response.json();
    return responseJson.product;
  } catch (e) {
    throw new Error(e);
  }
}

export default async function Page({ params: { id } }) {
  const initProduct = await fetchProduct(id);
  if (!initProduct) return notFound();
  
  const onBuyNow = (job) => {
    // Handle buy now action
    console.log('Buy now job:', job);
  };
  
  const onGetQuote = (job) => {
    // Handle quote request
    console.log('Quote request job:', job);
  };
  
  return (
    <div className="product-container">
      <MerchiProductForm
        initProduct={initProduct}
        onBuyNow={onBuyNow}
        onGetQuote={onGetQuote}
        showCurrency={true}
      />
    </div>
  );
}
```

## Component Props

The `MerchiProductForm` component accepts the following props:

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `apiUrl` | `string?` | `'https://api.merchi.co/v6/'` | The Merchi API endpoint URL |
| `initProduct` | `Product` | *required* | The Merchi product object to use for the form |
| `allowAddToCart` | `boolean?` | `false` | Controls if the add to cart button is shown |
| `btnNameAddToCart` | `string?` | `"Add to Cart"` | The text on the add to cart button |
| `currentUser` | `User?` | `undefined` | A Merchi client object to be used as the form's client |
| `draftApproveCallback` | `(job) => Promise<void> \| null` | `null` | Async callback function that is triggered when drafts are approved |
| `hideTitle` | `boolean?` | `false` | Hide the product title |
| `hideCost` | `boolean?` | `false` | Hide the cost (useful for quote requests) |
| `hideCountry` | `boolean?` | `false` | Hide the country flag |
| `hideCalculatedPrice` | `boolean?` | `false` | Hide calculated price (useful for quote requests) |
| `hideDomainName` | `boolean?` | `false` | Hide product domain |
| `hideQuantityField` | `boolean?` | `false` | Hide the quantity field |
| `hideRequestQuotationButton` | `boolean?` | `false` | Hide request quote button |
| `hidePaymentUpfrontButton` | `boolean?` | `false` | Hide buy now button |
| `isCartItem` | `boolean?` | `false` | Used if the product form is being used in cart item context |
| `initJob` | `job | cartItem` | `undefined` | The Merchi job or cartItem to be used for the form |
| `onAddToCart` | `(job) => void?` | `undefined` | Callback function for the add to cart button |
| `onBuyNow` | `(job) => void?` | `undefined` | Callback function for the buy now button |
| `onGetQuote` | `(job) => void?` | `undefined` | Callback function for the get quote button |
| `onSubmit` | `(job) => void?` | `undefined` | Callback function that returns the latest job data |
| `productFormId` | `string?` | `undefined` | Optional ID to be applied to the product form |
| `showCurrency` | `boolean?` | `false` | Show the currency symbol |
| `showCurrencyCode` | `boolean?` | `false` | Show the currency code |
| `showFeatureDeadline` | `boolean?` | `false` | Will display a countdown timer |
| `showGroupBuyStatus` | `boolean?` | `false` | Will show the group buy status bar |
| `showUnitPrice` | `boolean?` | `false` | Show the unit price to the user |

## CSS Class Props

The component provides extensive CSS class customization options:

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `classNameAlertSellerEditable` | `string?` | `'alert alert-light'` | Class for the seller editable alert element |
| `classNameButtonSubmit` | `string?` | `'btn btn-primary w-100 merchi-embed-form_button-submit'` | Class for the Submit button element |
| `classNameButtonGroupAdd` | `string?` | `'btn btn-white'` | Class for the add group button element |
| `classNameButtonGroupRemove` | `string?` | `'btn btn-danger'` | Class for the delete group button element |
| `classNameButtonsSubmitContainer` | `string?` | `'merchi-product-buttons-submit-container'` | Class for the container of the submit buttons |
| `classNameButtonApproveDrafts` | `string?` | `'btn btn-success'` | Class for the approve drafts button element |
| `classNameButtonCloseDrafts` | `string?` | `'btn btn-secondary'` | Class for the close drafts button element |
| `classNameFileUploadContainer` | `string?` | `'merchi-input-file-container'` | Class for the input file container |
| `classNameFileUpload` | `string?` | `'merchi-embed-form_dropzone'` | Class for the dropzone container |
| `classNameFilePreviewContainer` | `string?` | `'uploaded-variation-file'` | Class for the file variation upload element |
| `classNameFileUploadTextContainer` | `string?` | `'merchi-embed-form_dropzone-text-container'` | Class for the dropzone text element |
| `classNameFilePreviewIconWrapper` | `string?` | `'uploaded-variation-file-icon-wrapper'` | Class for the upload variation icon wrapper |
| `classNameFileUploadButton` | `string?` | `'btn btn-sm btn-link ml-auto'` | Class for the file upload button element |
| `classNameFileUploadIcon` | `string?` | `'merchi-embed-form_dropzone-icon'` | Class for the form dropzone icon element |
| `classNameFileUploadIconSecond` | `string?` | `'merchi-embed-form_dropzone-icon-plus'` | Class for the form dropzone plus icon element |
| `classNameFileUploadIconContainer` | `string?` | `'merchi-embed-form_dropzone-icon-container'` | Class for the form dropzone icon container |
| `classNameFileListItem` | `string?` | `'list-group-item no-z-index-hover'` | Class for file list item element |
| `classNameFileButtonDownload` | `string?` | `'btn btn-sm btn-secondary'` | Class for the file download button element |
| `classNameFileButtonDelete` | `string?` | `'btn btn-sm btn-danger ml-2'` | Class for the file delete button element |
| `classNameFileListItemContainer` | `string?` | `'list-group'` | Class for the file item list |
| `classNameGroupsContainer` | `string?` | `'merchi-embed-form_product-group-container'` | Class for the product variation group container |
| `classNameGroupPriceContainer` | `string?` | `'merchi-embed-form_product-group-total-cost'` | Class for the variation group total cost |
| `classNameInput` | `string?` | `'form-control'` | Class for form inputs |
| `classNameInventoryStatus` | `string?` | `'flex-fill'` | Class for the inventory status element |
| `classNameInputContainer` | `string?` | `'merchi-embed-form_product-group-input-qty-container'` | Class for the input container |
| `classNameOptionContainer` | `string?` | `'merchi-embed-form_checkbox_radio-item'` | Class for the radio/checkbox container |
| `classNameOptionInput` | `string?` | `'merchi-embed-form_checkbox_radio-input'` | Class for the radio input |
| `classNameOptionLabel` | `string?` | `'merchi-embed-form_checkbox_radio-label'` | Class for the radio label |
| `classNameOptionSuper` | `string?` | `'merchi-embed-form_checkbox_radio-super'` | Class for the checkbox radio super |
| `classNameOptionsCheckboxRadioContainer` | `string?` | `''` | Class for the option checkbox/radio container |
| `classNameOptionImage` | `string?` | `'merchi-embed-form_image-select-option-item-img'` | Class for the variation image select element |
| `classNameOptionImageContainer` | `string?` | `'merchi-embed-form_image-select-option-item-container'` | Class for the variation image container element |
| `classNameOptionColour` | `string?` | `'merchi-embed-form_color-select-option'` | Class for the variation colour element |
| `classNameOptionColourContainer` | `string?` | `'merchi-embed-form_color-select-item'` | Class for the variation colour container element |
| `classNameProductTitle` | `string?` | `'merchi-product-title'` | Class for the product title element |
| `classNameProductOriginTitle` | `string?` | `'merchi-product-origin-title'` | Class for the product origin title element |
| `classNameProductTotalContainer` | `string?` | `'merchi-embed-form_summary-product-cost-container'` | Class for the product total cost container element |
| `classNameProductTotal` | `string?` | `'merchi-embed-form_summary-product-cost'` | Class for the product total cost element |
| `classNameQuantityLabelContainer` | `string?` | `'merchi-embed-form_quantity-label-container'` | Class for the product quantity label element |
| `classNameUnitPrice` | `string?` | `undefined` | Class for the unit price element |

## Styling

The component provides extensive customization options through class name props. Here are some of the most commonly used styling props:

```jsx
<MerchiProductForm
  initProduct={product}
  classNameButtonSubmit="custom-submit-button"
  classNameInput="custom-input"
  classNameProductTitle="custom-product-title"
  classNameProductTotal="custom-product-total"
/>
```

## Advanced Usage

### Working with Product Variations

```jsx
<MerchiProductForm
  initProduct={product}
  classNameGroupsContainer="custom-groups-container"
  classNameOptionContainer="custom-option-container"
  onBuyNow={handleBuyNow}
/>
```

### Handling File Uploads

```jsx
<MerchiProductForm
  initProduct={product}
  classNameFileUploadContainer="custom-file-upload"
  classNameFilePreviewContainer="custom-file-preview"
  onGetQuote={handleQuoteRequest}
/>
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

For detailed information about all available props, please refer to the TypeScript definitions in the source code.
