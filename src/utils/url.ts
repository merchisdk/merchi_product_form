export function urlSearchParams(inputParams: any): string {
  const params = { ...inputParams };  // Create a shallow copy to prevent mutation

  Object.keys(params).forEach(key => {
    if (params[key] === undefined || params[key] === null || params[key] === "") {
      delete params[key];
    } else if (Array.isArray(params[key])) {
      params[key] = params[key].join(',');
    } else if (typeof params[key] === 'object') {
      params[key] = JSON.stringify(params[key]);
    }
  });

  return new URLSearchParams(params).toString();
}

export function updateRouteParams(pathname: string, router: any, params: any) {

  // Remove keys with undefined values
  Object.keys(params).forEach(key => {
    if (params[key] === undefined) {
      delete params[key];
    }
  });
  const embed = JSON.stringify(params.embed || {});
  delete params.embed;

  const queryString = new URLSearchParams(params).toString();
  router.push(`${pathname}?${queryString}`);
}

export function paramsToObject(queryString: string): any {
  const searchParams = new URLSearchParams(queryString);
  const obj: { [key: string]: any } = {};

  for (const [key, value] of searchParams.entries() as any) {
    try {
      // Try to parse as JSON
      obj[key] = JSON.parse(value);
    } catch (e) {
      // If it's not valid JSON, use the raw value
      obj[key] = value;
    }
  }

  return obj;
}

