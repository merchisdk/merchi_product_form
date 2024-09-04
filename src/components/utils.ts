import { cloneDeepWith, orderBy } from 'lodash';
import { formatCurrency } from '../utils/currency';
import { ProductType } from './types';
import { FieldType } from './types';
const pngOptionNotFound = require('../images/product-not-found.png').default;

function renderSingleCostIndication(
  cost: any,
  currencyCode: any,
  costTypeString: string
) {
  let currencyOptions = { currency: currencyCode, showCodeIfNoSymbol: false };
  let costString = '';

  if (cost) {
    costString = formatCurrency(parseFloat(cost), currencyOptions);
    costString = ' + ' + costString + ' ' + costTypeString;
  }
  return costString;
}

const costDetail = (onceOffCost: any, unitCost: any, currencyCode: string) => {
  const onceOffCostDescription = renderSingleCostIndication(
    parseFloat(onceOffCost),
    currencyCode,
    'once off'
  );
  const unitCostDescription = renderSingleCostIndication(
    parseFloat(unitCost),
    currencyCode,
    'per unit'
  );
  return onceOffCostDescription + unitCostDescription;
};

export function variationFieldCostDetail(variationField: any) {
  const { variationCost, variationUnitCost, currency } = variationField;
  return costDetail(variationCost!, variationUnitCost!, currency!);
}

export function variationCostDetail(variation: any) {
  const { onceOffCost, unitCost, currency } = variation;
  return costDetail(onceOffCost!, unitCost!, currency!);
}

export function variationFieldOptionCostDetail(option: any) {
  const { currency, variationCost, variationUnitCost } = option;
  return costDetail(variationCost!, variationUnitCost!, currency!);
}

export function splitSelectedOptions(value: any) {
  return value && Array.isArray(value) ? value : value ? value.split(',') : [];
}

export const supplierSellerEditableProductTypes: Array<number> = [
  ProductType.SUPPLIER_MOD,
  ProductType.CLONED_SUPPLIER_MOD,
];

export function optionImageUrl(option: any) {
  const imageNotFount = pngOptionNotFound.src;
  return option.linkedFile
    ? option.linkedFile
      ? option.linkedFile.viewUrl
      : imageNotFount
    : imageNotFount;
}

export function allowedFileTypes(variationField: any): string {
  const fileTypeMapping: { [key: string]: string } = {
    allowFileJpeg: '.jpeg',
    allowFileGif: '.gif',
    allowFilePdf: '.pdf',
    allowFilePng: '.png',
    allowFileAi: '.ai',
  };

  const allowedTypes: string[] = Object.keys(fileTypeMapping)
    .filter((attributeName) => variationField[attributeName])
    .map((attributeName) => fileTypeMapping[attributeName]);

  return allowedTypes.join(',');
}

function buildVariationOption(option: any) {
  return { ...option };
}

function buildEmptyVariation(variationField: any): object {
  if (variationField.defaultValue === undefined) {
    throw new Error('defaultValue is undefined, did you forget to embed it?');
  }
  if (variationField.variationCost === undefined) {
    const err = 'variationCost is undefined, did you forget to embed it?';
    throw new Error(err);
  }
  if (variationField.options === undefined) {
    throw new Error('options is undefined, did you forget to embed it?');
  }

  const isSelectable = (): boolean => {
    if (variationField.fieldType === undefined) {
      throw new Error('fieldType is undefined, did you forget to embed it?');
    }
    const selectable = new Set([
      FieldType.SELECT,
      FieldType.CHECKBOX,
      FieldType.RADIO,
      FieldType.IMAGE_SELECT,
      FieldType.COLOUR_SELECT,
    ]);
    return selectable.has(variationField.fieldType);
  };

  let value = variationField.defaultValue;
  let onceOffCost = variationField.variationCost;
  let selectableOptions: any[] = [];

  if (isSelectable()) {
    onceOffCost = 0;
    const values: number[] = [];
    for (const option of variationField.options) {
      if (
        (variationField.sellerProductEditable && option.include) ||
        (!variationField.sellerProductEditable && option.default)
      ) {
        if (option.variationCost === undefined) {
          throw new Error(
            'option.variationCost is undefined, did you ' +
              'forget to embed it?'
          );
        }
        values.push(option.id);
        onceOffCost += option.variationCost;
      }
      selectableOptions.push(buildVariationOption(option));
    }
    value = values.join();
  }

  const result = {
    value: value,
    onceOffCost: onceOffCost,
    unitCostTotal: 0,
    cost: onceOffCost,
    selectableOptions: selectableOptions,
    variationField: cloneDeepWith(variationField, (value: any, key?: string | number) => {
      if (typeof key === 'string' && key === 'merchi') {
        return value;
      }
    }),

  };

  return result;
}

export function buildEmptyVariationGroup(product: any) {
  const { groupVariationFields = [] } = product;
  const result: any = { quantity: 0, variations: [] };
  const variations = [];
  let cost = 0;
  const sortedFields = orderBy(groupVariationFields, ['position'], ['asc']);
  for (const variationField of sortedFields) {
    const empty: any = buildEmptyVariation(variationField);
    variations.push(empty);
    cost += empty.cost as number;
  }
  result.groupCost = cost;
  result.variations = variations;
  return result;
}

export function isProductSupplierMOD(product: any) {
  const productType = product && product.productType;
  return (
    product &&
    [
      String(ProductType.SUPPLIER_MOD),
      String(ProductType.SUPPLIER_RESELL_MOD),
    ].includes(String(productType))
  );
}

export function isProductTypeFileDownload(productType: any) {
  return parseInt(productType, 10) === ProductType.SELLER_FILE_DOWNLOAD;
}

export function isProductFileDownload(product: any) {
  const { productType } = product;
  return isProductTypeFileDownload(productType);
}

export const isoCountries: any = {
  AF: 'Afghanistan',
  AX: 'Aland Islands',
  AL: 'Albania',
  DZ: 'Algeria',
  AS: 'American Samoa',
  AD: 'Andorra',
  AO: 'Angola',
  AI: 'Anguilla',
  AQ: 'Antarctica',
  AG: 'Antigua And Barbuda',
  AR: 'Argentina',
  AM: 'Armenia',
  AW: 'Aruba',
  AU: 'Australia',
  AT: 'Austria',
  AZ: 'Azerbaijan',
  BS: 'Bahamas',
  BH: 'Bahrain',
  BD: 'Bangladesh',
  BB: 'Barbados',
  BY: 'Belarus',
  BE: 'Belgium',
  BZ: 'Belize',
  BJ: 'Benin',
  BM: 'Bermuda',
  BT: 'Bhutan',
  BO: 'Bolivia',
  BA: 'Bosnia And Herzegovina',
  BW: 'Botswana',
  BV: 'Bouvet Island',
  BR: 'Brazil',
  IO: 'British Indian Ocean Territory',
  BN: 'Brunei Darussalam',
  BG: 'Bulgaria',
  BF: 'Burkina Faso',
  BI: 'Burundi',
  KH: 'Cambodia',
  CM: 'Cameroon',
  CA: 'Canada',
  CV: 'Cape Verde',
  KY: 'Cayman Islands',
  CF: 'Central African Republic',
  TD: 'Chad',
  CL: 'Chile',
  CN: 'China',
  CX: 'Christmas Island',
  CC: 'Cocos (Keeling) Islands',
  CO: 'Colombia',
  KM: 'Comoros',
  CG: 'Congo',
  CD: 'Congo, Democratic Republic',
  CK: 'Cook Islands',
  CR: 'Costa Rica',
  CI: "Cote D'Ivoire",
  HR: 'Croatia',
  CU: 'Cuba',
  CY: 'Cyprus',
  CZ: 'Czech Republic',
  DK: 'Denmark',
  DJ: 'Djibouti',
  DM: 'Dominica',
  DO: 'Dominican Republic',
  EC: 'Ecuador',
  EG: 'Egypt',
  SV: 'El Salvador',
  GQ: 'Equatorial Guinea',
  ER: 'Eritrea',
  EE: 'Estonia',
  ET: 'Ethiopia',
  FK: 'Falkland Islands (Malvinas)',
  FO: 'Faroe Islands',
  FJ: 'Fiji',
  FI: 'Finland',
  FR: 'France',
  GF: 'French Guiana',
  PF: 'French Polynesia',
  TF: 'French Southern Territories',
  GA: 'Gabon',
  GM: 'Gambia',
  GE: 'Georgia',
  DE: 'Germany',
  GH: 'Ghana',
  GI: 'Gibraltar',
  GR: 'Greece',
  GL: 'Greenland',
  GD: 'Grenada',
  GP: 'Guadeloupe',
  GU: 'Guam',
  GT: 'Guatemala',
  GG: 'Guernsey',
  GN: 'Guinea',
  GW: 'Guinea-Bissau',
  GY: 'Guyana',
  HT: 'Haiti',
  HM: 'Heard Island & Mcdonald Islands',
  VA: 'Holy See (Vatican City State)',
  HN: 'Honduras',
  HK: 'Hong Kong',
  HU: 'Hungary',
  IS: 'Iceland',
  IN: 'India',
  ID: 'Indonesia',
  IR: 'Iran, Islamic Republic Of',
  IQ: 'Iraq',
  IE: 'Ireland',
  IM: 'Isle Of Man',
  IL: 'Israel',
  IT: 'Italy',
  JM: 'Jamaica',
  JP: 'Japan',
  JE: 'Jersey',
  JO: 'Jordan',
  KZ: 'Kazakhstan',
  KE: 'Kenya',
  KI: 'Kiribati',
  KR: 'Korea',
  KW: 'Kuwait',
  KG: 'Kyrgyzstan',
  LA: "Lao People's Democratic Republic",
  LV: 'Latvia',
  LB: 'Lebanon',
  LS: 'Lesotho',
  LR: 'Liberia',
  LY: 'Libyan Arab Jamahiriya',
  LI: 'Liechtenstein',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  MO: 'Macao',
  MK: 'Macedonia',
  MG: 'Madagascar',
  MW: 'Malawi',
  MY: 'Malaysia',
  MV: 'Maldives',
  ML: 'Mali',
  MT: 'Malta',
  MH: 'Marshall Islands',
  MQ: 'Martinique',
  MR: 'Mauritania',
  MU: 'Mauritius',
  YT: 'Mayotte',
  MX: 'Mexico',
  FM: 'Micronesia, Federated States Of',
  MD: 'Moldova',
  MC: 'Monaco',
  MN: 'Mongolia',
  ME: 'Montenegro',
  MS: 'Montserrat',
  MA: 'Morocco',
  MZ: 'Mozambique',
  MM: 'Myanmar',
  NA: 'Namibia',
  NR: 'Nauru',
  NP: 'Nepal',
  NL: 'Netherlands',
  AN: 'Netherlands Antilles',
  NC: 'New Caledonia',
  NZ: 'New Zealand',
  NI: 'Nicaragua',
  NE: 'Niger',
  NG: 'Nigeria',
  NU: 'Niue',
  NF: 'Norfolk Island',
  MP: 'Northern Mariana Islands',
  NO: 'Norway',
  OM: 'Oman',
  PK: 'Pakistan',
  PW: 'Palau',
  PS: 'Palestinian Territory, Occupied',
  PA: 'Panama',
  PG: 'Papua New Guinea',
  PY: 'Paraguay',
  PE: 'Peru',
  PH: 'Philippines',
  PN: 'Pitcairn',
  PL: 'Poland',
  PT: 'Portugal',
  PR: 'Puerto Rico',
  QA: 'Qatar',
  RE: 'Reunion',
  RO: 'Romania',
  RU: 'Russian Federation',
  RW: 'Rwanda',
  BL: 'Saint Barthelemy',
  SH: 'Saint Helena',
  KN: 'Saint Kitts And Nevis',
  LC: 'Saint Lucia',
  MF: 'Saint Martin',
  PM: 'Saint Pierre And Miquelon',
  VC: 'Saint Vincent And Grenadines',
  WS: 'Samoa',
  SM: 'San Marino',
  ST: 'Sao Tome And Principe',
  SA: 'Saudi Arabia',
  SN: 'Senegal',
  RS: 'Serbia',
  SC: 'Seychelles',
  SL: 'Sierra Leone',
  SG: 'Singapore',
  SK: 'Slovakia',
  SI: 'Slovenia',
  SB: 'Solomon Islands',
  SO: 'Somalia',
  ZA: 'South Africa',
  GS: 'South Georgia And Sandwich Isl.',
  ES: 'Spain',
  LK: 'Sri Lanka',
  SD: 'Sudan',
  SR: 'Suriname',
  SJ: 'Svalbard And Jan Mayen',
  SZ: 'Swaziland',
  SE: 'Sweden',
  CH: 'Switzerland',
  SY: 'Syrian Arab Republic',
  TW: 'Taiwan',
  TJ: 'Tajikistan',
  TZ: 'Tanzania',
  TH: 'Thailand',
  TL: 'Timor-Leste',
  TG: 'Togo',
  TK: 'Tokelau',
  TO: 'Tonga',
  TT: 'Trinidad And Tobago',
  TN: 'Tunisia',
  TR: 'Turkey',
  TM: 'Turkmenistan',
  TC: 'Turks And Caicos Islands',
  TV: 'Tuvalu',
  UG: 'Uganda',
  UA: 'Ukraine',
  AE: 'United Arab Emirates',
  GB: 'United Kingdom',
  US: 'United States',
  UM: 'United States Outlying Islands',
  UY: 'Uruguay',
  UZ: 'Uzbekistan',
  VU: 'Vanuatu',
  VE: 'Venezuela',
  VN: 'Viet Nam',
  VG: 'Virgin Islands, British',
  VI: 'Virgin Islands, U.S.',
  WF: 'Wallis And Futuna',
  EH: 'Western Sahara',
  YE: 'Yemen',
  ZM: 'Zambia',
  ZW: 'Zimbabwe',
};

export function getCountryName(countryCode: any) {
  if (isoCountries.hasOwnProperty(countryCode)) {
    return isoCountries[countryCode];
  } else {
    return countryCode;
  }
}

export function cleanTagIds(raw: any[]) {
  return raw.map(id => id.trim())            // Trim each ID entry to remove whitespace
    .filter(id => /^\d+$/.test(id))  // Use a regular expression to ensure the ID is entirely numeric.
    .map(id => Number(id));          // Convert the remaining, valid ID entries into numbers
}

export function getMerchiSourceJobTags(): any[] {
  if (typeof localStorage !== 'undefined' && localStorage !== null) {
    const merchiSource = localStorage.getItem('merchi_source');

    if (merchiSource) {
      const ids = cleanTagIds(merchiSource.split(','));
      return ids.map((id: number) => ({ id }));
    }
    // If "merchi_source" is not found in localStorage, return an empty array.
    return [];
  }
  return [];
}
