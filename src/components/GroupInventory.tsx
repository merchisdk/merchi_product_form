import * as React from 'react';
import InventoryStatus from './InventoryStatus';

interface Props {
  group: any;
}

function GroupInventory({ group = {} }: Props) {
  const { inventoryCount = 0, inventorySufficient } = group;
  return (
    <InventoryStatus
      inventoryCount={inventoryCount}
      inventorySufficient={inventorySufficient}
    />
  );
}

export default GroupInventory;
