'use client';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMerchiFormContext } from '../MerchiProductFormProvider';

interface Props {
  count: number;
  disabled?: boolean;
  remove: () => void;
}

function ButtonRemoveGroup({ count, disabled, remove }: Props) {
  const { classNameButtonGroupRemove } = useMerchiFormContext();
  return (
    <button
      className={`${classNameButtonGroupRemove} merchi-embed-form_product-group-button-remove`}
      onClick={remove}
      disabled={disabled}
    >
      <FontAwesomeIcon icon={faTrash} /> {`Group (${count})`}
    </button>
  );
}

export default ButtonRemoveGroup;
