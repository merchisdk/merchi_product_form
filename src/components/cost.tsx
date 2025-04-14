'use client';
import { useMerchiFormContext } from './MerchiProductFormProvider';
import { formatCurrency } from './currency';
import { CgSpinner } from 'react-icons/cg';

interface Props {
  cost?: string | number;
  label?: string;
}

export function LabelCost({ cost = 0, label }: Props) {
  const { loading, product } = useMerchiFormContext();
  const { currency } = product;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {`${label} `}
      {loading && cost ? (
        <CgSpinner fontSize='1.25rem' className='animate_spin ml-1' />
      ) : (
        formatCurrency(parseFloat(String(cost)), {
          currency,
          showCodeIfNoSymbol: false,
        })
      )}
    </span>
  );
}

interface PropsGroup {
  group: any;
}

export function LabelGroupCost({ group }: PropsGroup) {
  const { classNameGroupPriceContainer } = useMerchiFormContext();
  const { groupCost = 0 } = group;
  return (
    <div className={classNameGroupPriceContainer}>
      <LabelCost cost={groupCost} label='Group cost' />
    </div>
  );
}
