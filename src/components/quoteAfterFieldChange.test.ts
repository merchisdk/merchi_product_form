import { quoteAfterFieldChange, quoteAfterMutation } from './quoteAfterFieldChange';

test('runs quote after the field change has been applied', async () => {
  const calls: string[] = [];
  const onChange = jest.fn(() => calls.push('change'));
  const getQuote = jest.fn(() => calls.push('quote'));

  quoteAfterFieldChange(onChange, getQuote, '200');

  expect(onChange).toHaveBeenCalledWith('200');
  expect(getQuote).not.toHaveBeenCalled();
  expect(calls).toEqual(['change']);

  await Promise.resolve();

  expect(getQuote).toHaveBeenCalledTimes(1);
  expect(calls).toEqual(['change', 'quote']);
});

test('runs quote after a group mutation has been applied', async () => {
  const calls: string[] = [];
  const mutate = jest.fn(() => calls.push('mutate'));
  const getQuote = jest.fn(() => calls.push('quote'));

  quoteAfterMutation(mutate, getQuote);

  expect(mutate).toHaveBeenCalledTimes(1);
  expect(getQuote).not.toHaveBeenCalled();
  expect(calls).toEqual(['mutate']);

  await Promise.resolve();

  expect(getQuote).toHaveBeenCalledTimes(1);
  expect(calls).toEqual(['mutate', 'quote']);
});
