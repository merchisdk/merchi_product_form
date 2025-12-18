import * as React from 'react';
import TooltipElement from '../TooltipElement';
import { FaTimesCircle } from 'react-icons/fa';

function IconNoStock() {
  return (
  	<TooltipElement tooltip='Insufficient stock'>
      <FaTimesCircle />
    </TooltipElement>
  );
}

export default IconNoStock;
