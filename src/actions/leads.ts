import { Merchi } from 'merchi_sdk_ts';

import { cleanJobVariationsAndGroups } from '../components/utils';

type AnyObject = Record<string, any>;

export function buildLeadJobPayload(jobJson: AnyObject): AnyObject {
  const { client, product, domain, variations, variationsGroups } = jobJson;
  const cleaned = cleanJobVariationsAndGroups({
    variations: variations ?? [],
    variationsGroups: variationsGroups ?? [],
  });

  const payload: AnyObject = {
    client,
    variations: cleaned.variations,
    variationsGroups: cleaned.variationsGroups,
  };

  if (product?.id != null) {
    payload.product = { id: product.id };
  } else if (product) {
    payload.product = product;
  }

  if (domain) {
    payload.domain = domain;
  } else if (product?.domain) {
    payload.domain = product.domain;
  }

  return payload;
}

export async function submitLead(jobJson: AnyObject, apiUrl: string): Promise<unknown> {
  const merchi = new Merchi(
    undefined,
    undefined,
    undefined,
    undefined,
    apiUrl,
  );
  const merchiJob = new merchi.Job();
  const leadPayload = buildLeadJobPayload(jobJson);

  merchiJob.fromJson(leadPayload, { makeDirty: true, arrayValueStrict: false });

  const formData = merchiJob.toFormData();
  return merchi.authenticatedFetch('create_new_lead/', { body: formData, method: 'POST' });
}
