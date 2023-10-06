import { encodeMerchiApiData } from './helpers';
import { urlSearchParams } from '@/utils/url';

export async function fetchJobQuote(jobJson: any) {
  const formData = encodeMerchiApiData(jobJson);
  const queryString = urlSearchParams({product_id:  jobJson.product!.id ? String(jobJson.product!.id!) : 'null', skip_rights: 'y'});
  const fetchOptions: any = {method: 'POST', body: formData};
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}specialised-order-estimate/?${queryString}`,
    fetchOptions,
  );
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
  }
  const job = await response.json()
  return job;
}
