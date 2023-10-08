'use client';
import Tooltip from '../Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

function IconNoStock() {
  return (
  	<Tooltip tooltip='Insufficient stock'>
      <FontAwesomeIcon icon={faTimesCircle} />
    </Tooltip>
  );
}

export default IconNoStock;
