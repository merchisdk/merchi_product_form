'use client';
import * as React from 'react';
const VariationFieldInstructions = ({ variation }: any) => {
  const { variationField } = variation;
  const instructions = variationField && variationField.name
    ? variation.variationField.name
    : 'No instructions to displlay.';
  return (
    <div className='d-block merchi-input-instructions-container'>
      <p>
        {instructions}
      </p>
    </div>
  );
};

export default VariationFieldInstructions;
