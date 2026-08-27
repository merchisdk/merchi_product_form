import * as React from 'react';
import * as moment from 'moment-timezone';
import DateCountdown from './DateCountdown';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';

function ProductFeatureDeadline() {
  const { product } = useMerchiFormContext();
  const { featureDeadline } = product;
  const tz = (Intl as any) && (Intl as any).DateTimeFormat() && (Intl as any).DateTimeFormat().resolvedOptions() ?
    (Intl as any).DateTimeFormat().resolvedOptions().timeZone : '';
  const deadlineUnix =
    featureDeadline > 1e12 ? featureDeadline / 1000 : featureDeadline;
  const tooltip = deadlineUnix ?
    `Available until ${moment.unix(deadlineUnix).tz(tz).format('ddd Do MMM')}` : '';
  return (
    <>
      {featureDeadline &&
        <div className='merchi-feature-deadline-container'>
          <DateCountdown
            deadline={deadlineUnix}
            hideSeconds={false}
            tooltip={tooltip}
          />
        </div>
      }
    </>
  );
}

export default ProductFeatureDeadline;
