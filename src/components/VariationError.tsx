'use client';
import * as React from 'react';
import { useFormState } from 'react-hook-form';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';

interface Props {
  name: string;
  message?: string;
}

function getErrorAtPath(errors: Record<string, any> | undefined, name: string) {
  if (!errors || !name) return undefined;
  // Support both "variationsGroups[0].quantity" and "variationsGroups.0.quantity"
  const parts = name
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean);
  let current: any = errors;
  for (const part of parts) {
    if (current == null) return undefined;
    current = current[part];
  }
  return current;
}

const VariationError: React.FC<Props> = ({ name, message }: Props) => {
  const { control } = useMerchiFormContext();
  const { errors } = useFormState({ control, name });
  const error = getErrorAtPath(errors as Record<string, any>, name);

  if (!error) return null;

  return (
    <div className='input-alert-container' role='alert'>
      <span className='m-r-3 text-danger'>
        {message ? message : error.message}
      </span>
    </div>
  );
};

export default VariationError;
