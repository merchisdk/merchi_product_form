import * as React from 'react';
import { useController } from 'react-hook-form';
import { useMerchiFormContext } from './MerchiProductFormProvider';

interface Props {
  name: string;
  message?: string;
}

const VariationError: React.FC<Props> = ({ name, message }: Props) => {
  const { control } = useMerchiFormContext();
  const { fieldState } = useController({ control, name });

  return (
    <>
      {fieldState.invalid && fieldState.error ?
        <div className='input-alert-container'>
          <span className='m-r-3 text-danger'>
            {message ? message : fieldState.error.message}
          </span>
        </div> :
        null}
    </>
  );
};

export default VariationError;
