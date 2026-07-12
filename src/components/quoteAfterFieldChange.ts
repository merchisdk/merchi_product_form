type FieldOnChange = (value: any) => void;
type GetQuote = () => void;
type Mutation = () => void;

export function quoteAfterFieldChange(
  onChange: FieldOnChange,
  getQuote: GetQuote,
  value: any
) {
  onChange(value);
  Promise.resolve().then(getQuote);
}

/** Run getQuote after a form mutation (append/remove) has been applied. */
export function quoteAfterMutation(mutate: Mutation, getQuote: GetQuote) {
  mutate();
  Promise.resolve().then(getQuote);
}
