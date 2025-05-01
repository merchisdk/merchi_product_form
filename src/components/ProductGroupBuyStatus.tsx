import * as React from 'react';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';

interface ProgressBarProps {
  value?: number;
}

function ProgressBar({ value = 0 }: ProgressBarProps) {
  return (
    <div
      className='progress'
      style={{
        backgroundColor: '#f8f9fe',
        display: 'flex',
        height: 10,
        overflow: 'hidden',
        fontSize: '.75rem',
        borderRadius: '0.25rem',
      }}
    >
      <div
        className='progress-bar'
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={value}
        role='progressbar'
        style={{
          backgroundColor: '#303dbf',
          height: 10,
          width: `${value}%`,
        }}
      />
    </div>
  );
}

function ProductGroupBuyStatus() {
  const { product } = useMerchiFormContext();
  const { groupBuyStatus = 0 } = product;
  return (
    <div className='merchi-group-buy-status'>
      <div className='merchi-group-buy-status-text'>
        Minimum order quantity target ( {groupBuyStatus}% )
      </div>
  	  <ProgressBar value={groupBuyStatus} />
  	</div>
  );
}


export default ProductGroupBuyStatus;
