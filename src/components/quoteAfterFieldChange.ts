type FieldOnChange = (value: any) => void;
type GetQuote = () => void;

export function quoteAfterFieldChange(
  onChange: FieldOnChange,
  getQuote: GetQuote,
  value: any
) {
  onChange(value);
  Promise.resolve().then(getQuote);
}
