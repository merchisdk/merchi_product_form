import { Merchi } from 'merchi_sdk_ts';

const merchi = new Merchi();
type AnyObject = Record<string, any>;

function removeNullValues(obj: AnyObject): AnyObject {
  const variation = Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== null)
  );
  return {...variation, id: undefined};
}

function removeNullValuesFromArray(objs: AnyObject[]): AnyObject[] {
  return objs.map((obj) => {
    const cleanedObj = removeNullValues(obj);
    if (cleanedObj.variations) {
      // Recursively clean variations if it's an object
      cleanedObj.variations = cleanedObj.variations.map(
        (variation: AnyObject) => removeNullValues(variation)
      );
    }
    return {id: undefined, ...cleanedObj};
  });
}

export async function fetchJobQuote(jobJson: AnyObject) {
  const merchiJob = new merchi.Job();
  const { variations = [], variationsGroups = [] } = jobJson;
  
  // Clean the input data by removing nulls
  const cleanedVariationsGroups = removeNullValuesFromArray(variationsGroups);
  const cleanedVariations = removeNullValuesFromArray(variations);
  const cleanedJob = removeNullValues(jobJson);

  // Passing cleaned data into merchiJob object
  merchiJob.fromJson(
    {
      ...cleanedJob,
      variations: cleanedVariations,
      variationsGroups: cleanedVariationsGroups,
    },
    { makeDirty: false, arrayValueStrict: false }
  );

  return merchiJob.getQuote();
}
