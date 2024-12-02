import { urlSearchParams } from '../utils/url';

export async function fetchJobQuote(jobJson: any, apiUrl: string) {
  const queryString = urlSearchParams({product_id:  jobJson.product!.id ? String(jobJson.product!.id!) : 'null', skip_rights: 'y'});
  const fetchOptions: any = {method: 'POST', body: JSON.stringify(jobJson)};
  const response = await fetch(
    `${apiUrl}specialised-order-estimate/?${queryString}`,
    fetchOptions,
  );
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
  }
  const job = await response.json()
  return job;
}
