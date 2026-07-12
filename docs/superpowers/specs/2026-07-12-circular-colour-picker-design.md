# Circular colour picker input

**Date:** 2026-07-12  
**Repo:** `merchi_product_form`  
**Status:** Approved for implementation

## Goal

Style the native `COLOUR_PICKER` field (`input[type=color]`) as a 50px circle on its own line under the field label/instructions, instead of a full-width colour strip.

## Out of scope

- `COLOUR_SELECT` option swatches (already circular)
- Custom picker UI replacing the native colour input
- Behaviour / quote / pricing changes

## Design

- **Size:** 50×50px (matches `_color-select-option` swatches)
- **Shape:** `border-radius: 50%`
- **Chrome:** white border + light shadow consistent with colour-select options
- **Layout:** `display: block`, fixed width (not 100%), `clear: both` so the control cannot sit beside Draft.js instructions
- **Hook:** existing classes from `VariationInput` — container `merchi-input-color-container`, variation class `merchi-input-color`

## Implementation

CSS-only changes in `src/styles/globals.scss` (and compiled `globals.css` via build). Target the colour picker container/input; do not change React markup unless CSS alone cannot force a new line.

## Verification

Visually check a product with a colour picker field (e.g. product 78 “Lanyard colour”): circle is 50px, below instructions, not sharing that line.
