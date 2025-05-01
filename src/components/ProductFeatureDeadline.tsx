import * as React from 'react';
import * as moment from 'moment-timezone';
import DateCountdown from './DateCountdown';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';

function ProductFeatureDeadline() {
  const { product } = useMerchiFormContext();
  const { featureDeadline } = product;
  const tz = (Intl as any) && (Intl as any).DateTimeFormat() && (Intl as any).DateTimeFormat().resolvedOptions() ?
    (Intl as any).DateTimeFormat().resolvedOptions().timeZone : '';
  const tooltip = featureDeadline ?
    `Available until ${moment.unix(featureDeadline / 1000).tz(tz).format('ddd Do MMM')}` : '';
  return (
    <>
      {featureDeadline &&
        <div className='merchi-feature-deadline-container'>
          <DateCountdown
            deadline={featureDeadline}
            tooltip={tooltip}
          />
        </div>
      }
    </>
  );
}

export default ProductFeatureDeadline;
