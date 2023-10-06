'use client';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { useMerchiFormContext } from './MerchiProductFormProvider';
import { CgSpinner } from 'react-icons/cg';

function StatusDot({ color }: any) {
  return (
    <span
      className='badge'
      style={{
        backgroundColor: '#fff',
        display: 'flex',
        padding: '3px',
        borderRadius: '100%',
        margin: '0 1px',
      }}
    >
      <div
        className='inventory-icon-indicator'
        style={{
          backgroundColor: color,
          borderRadius: '100%',
          height: 8,
          width: 8,
        }}
      />
    </span>
  );
}

interface Props {
  inventoryCount: number;
  inventorySufficient: boolean;
}

function InventoryStatus({ inventoryCount = 0, inventorySufficient }: Props) {
  const { classNameInventoryStatus, loading } = useMerchiFormContext();
  let color = '#65cf85';
  let msg = 'In stock';
  if (!inventorySufficient) {
    color = '#ff4449';
    msg = 'no stock';
    if (inventoryCount) {
      color = '#ffc928';
      msg = `insufficient stock (${inventoryCount} in stock)`;
    }
  }
  return (
    <div
      className={`${classNameInventoryStatus} merchi-embed-form_product-group-inventory-status`}
      style={{ background: color }}
    >
      {loading ? (
        <CgSpinner fontSize='1.1rem' className='animate_spin' />
      ) : (
        <>
          <StatusDot color={color} /> <span className='mr-1'>{msg}</span>
        </>
      )}
    </div>
  );
}

export default InventoryStatus;
