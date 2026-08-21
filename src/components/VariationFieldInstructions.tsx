'use client';
import * as React from 'react';

const VariationFieldInstructions = ({ variation }: any) => {
  const { variationField } = variation;
  const instructions = variationField?.name || 'No instructions to displlay.';
  const isHtml = Boolean(variationField?.isHtml);

  return (
    <div className='d-block merchi-input-instructions-container'>
      {isHtml ? (
        <div dangerouslySetInnerHTML={{ __html: instructions }} />
      ) : (
        <p>{instructions}</p>
      )}
    </div>
  );
};

export default VariationFieldInstructions;
