'use client';
import TooltipElement from '../TooltipElement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

function IconNoStock() {
  return (
  	<TooltipElement tooltip='Insufficient stock'>
      <FontAwesomeIcon icon={faTimesCircle} />
    </TooltipElement>
  );
}

export default IconNoStock;
