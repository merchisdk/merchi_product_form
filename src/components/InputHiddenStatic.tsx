'use client';
import { useMerchiFormContext } from './MerchiProductFormProvider';

interface Props {
  name: string;
  value: any;
  rules?: Record<string, any>;  // Add this line
}

function InputHiddenStatic({ name, value, rules }: Props) {
  const { hookForm } = useMerchiFormContext();
  return (
    <input
      type='hidden'
      defaultValue={value}
      {...hookForm.register(name, rules)}  // Pass the rules here
    />
  );
}

export default InputHiddenStatic;
