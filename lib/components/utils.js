function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { cloneDeepWith, orderBy } from 'lodash';
import { formatCurrency } from '../utils/currency';
import { ProductType } from './types';
import pngOptionNotFound from '../images/product-not-found.png';
import { FieldType } from './types';
function renderSingleCostIndication(cost, currencyCode, costTypeString) {
  var currencyOptions = {
    currency: currencyCode,
    showCodeIfNoSymbol: false
  };
  var costString = '';
  if (cost) {
    costString = formatCurrency(parseFloat(cost), currencyOptions);
    costString = ' + ' + costString + ' ' + costTypeString;
  }
  return costString;
}
var costDetail = function costDetail(onceOffCost, unitCost, currencyCode) {
  var onceOffCostDescription = renderSingleCostIndication(parseFloat(onceOffCost), currencyCode, 'once off');
  var unitCostDescription = renderSingleCostIndication(parseFloat(unitCost), currencyCode, 'per unit');
  return onceOffCostDescription + unitCostDescription;
};
export function variationFieldCostDetail(variationField) {
  var variationCost = variationField.variationCost,
    variationUnitCost = variationField.variationUnitCost,
    currency = variationField.currency;
  return costDetail(variationCost, variationUnitCost, currency);
}
export function variationCostDetail(variation) {
  var onceOffCost = variation.onceOffCost,
    unitCost = variation.unitCost,
    currency = variation.currency;
  return costDetail(onceOffCost, unitCost, currency);
}
export function variationFieldOptionCostDetail(option) {
  var currency = option.currency,
    variationCost = option.variationCost,
    variationUnitCost = option.variationUnitCost;
  return costDetail(variationCost, variationUnitCost, currency);
}
export function splitSelectedOptions(value) {
  return value && Array.isArray(value) ? value : value ? value.split(',') : [];
}
export var supplierSellerEditableProductTypes = [ProductType.SUPPLIER_MOD, ProductType.CLONED_SUPPLIER_MOD];
export function optionImageUrl(option) {
  var imageNotFount = pngOptionNotFound.src;
  return option.linkedFile ? option.linkedFile ? option.linkedFile.viewUrl : imageNotFount : imageNotFount;
}
export function allowedFileTypes(variationField) {
  var fileTypeMapping = {
    allowFileJpeg: '.jpeg',
    allowFileGif: '.gif',
    allowFilePdf: '.pdf',
    allowFilePng: '.png',
    allowFileAi: '.ai'
  };
  var allowedTypes = Object.keys(fileTypeMapping).filter(function (attributeName) {
    return variationField[attributeName];
  }).map(function (attributeName) {
    return fileTypeMapping[attributeName];
  });
  return allowedTypes.join(',');
}
function buildVariationOption(option) {
  return _objectSpread({}, option);
}
function buildEmptyVariation(variationField) {
  if (variationField.defaultValue === undefined) {
    throw new Error('defaultValue is undefined, did you forget to embed it?');
  }
  if (variationField.variationCost === undefined) {
    var err = 'variationCost is undefined, did you forget to embed it?';
    throw new Error(err);
  }
  if (variationField.options === undefined) {
    throw new Error('options is undefined, did you forget to embed it?');
  }
  var isSelectable = function isSelectable() {
    if (variationField.fieldType === undefined) {
      throw new Error('fieldType is undefined, did you forget to embed it?');
    }
    var selectable = new Set([FieldType.SELECT, FieldType.CHECKBOX, FieldType.RADIO, FieldType.IMAGE_SELECT, FieldType.COLOUR_SELECT]);
    return selectable.has(variationField.fieldType);
  };
  var value = variationField.defaultValue;
  var onceOffCost = variationField.variationCost;
  var selectableOptions = [];
  if (isSelectable()) {
    onceOffCost = 0;
    var values = [];
    var _iterator = _createForOfIteratorHelper(variationField.options),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var option = _step.value;
        if (variationField.sellerProductEditable && option.include || !variationField.sellerProductEditable && option["default"]) {
          if (option.variationCost === undefined) {
            throw new Error('option.variationCost is undefined, did you ' + 'forget to embed it?');
          }
          values.push(option.id);
          onceOffCost += option.variationCost;
        }
        selectableOptions.push(buildVariationOption(option));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    value = values.join();
  }
  var result = {
    value: value,
    onceOffCost: onceOffCost,
    unitCostTotal: 0,
    cost: onceOffCost,
    selectableOptions: selectableOptions,
    variationField: cloneDeepWith(variationField, function (value, key) {
      if (typeof key === 'string' && key === 'merchi') {
        return value;
      }
    })
  };
  return result;
}
export function buildEmptyVariationGroup(product) {
  var _product$groupVariati = product.groupVariationFields,
    groupVariationFields = _product$groupVariati === void 0 ? [] : _product$groupVariati;
  var result = {
    quantity: 0,
    variations: []
  };
  var variations = [];
  var cost = 0;
  var sortedFields = orderBy(groupVariationFields, ['position'], ['asc']);
  var _iterator2 = _createForOfIteratorHelper(sortedFields),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var variationField = _step2.value;
      var empty = buildEmptyVariation(variationField);
      variations.push(empty);
      cost += empty.cost;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  result.groupCost = cost;
  result.variations = variations;
  return result;
}
export function isProductSupplierMOD(product) {
  var productType = product && product.productType;
  return product && [String(ProductType.SUPPLIER_MOD), String(ProductType.SUPPLIER_RESELL_MOD)].includes(String(productType));
}
export function isProductTypeFileDownload(productType) {
  return parseInt(productType, 10) === ProductType.SELLER_FILE_DOWNLOAD;
}
export function isProductFileDownload(product) {
  var productType = product.productType;
  return isProductTypeFileDownload(productType);
}
export var isoCountries = {
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
  ZW: 'Zimbabwe'
};
export function getCountryName(countryCode) {
  if (isoCountries.hasOwnProperty(countryCode)) {
    return isoCountries[countryCode];
  } else {
    return countryCode;
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjbG9uZURlZXBXaXRoIiwib3JkZXJCeSIsImZvcm1hdEN1cnJlbmN5IiwiUHJvZHVjdFR5cGUiLCJwbmdPcHRpb25Ob3RGb3VuZCIsIkZpZWxkVHlwZSIsInJlbmRlclNpbmdsZUNvc3RJbmRpY2F0aW9uIiwiY29zdCIsImN1cnJlbmN5Q29kZSIsImNvc3RUeXBlU3RyaW5nIiwiY3VycmVuY3lPcHRpb25zIiwiY3VycmVuY3kiLCJzaG93Q29kZUlmTm9TeW1ib2wiLCJjb3N0U3RyaW5nIiwicGFyc2VGbG9hdCIsImNvc3REZXRhaWwiLCJvbmNlT2ZmQ29zdCIsInVuaXRDb3N0Iiwib25jZU9mZkNvc3REZXNjcmlwdGlvbiIsInVuaXRDb3N0RGVzY3JpcHRpb24iLCJ2YXJpYXRpb25GaWVsZENvc3REZXRhaWwiLCJ2YXJpYXRpb25GaWVsZCIsInZhcmlhdGlvbkNvc3QiLCJ2YXJpYXRpb25Vbml0Q29zdCIsInZhcmlhdGlvbkNvc3REZXRhaWwiLCJ2YXJpYXRpb24iLCJ2YXJpYXRpb25GaWVsZE9wdGlvbkNvc3REZXRhaWwiLCJvcHRpb24iLCJzcGxpdFNlbGVjdGVkT3B0aW9ucyIsInZhbHVlIiwiQXJyYXkiLCJpc0FycmF5Iiwic3BsaXQiLCJzdXBwbGllclNlbGxlckVkaXRhYmxlUHJvZHVjdFR5cGVzIiwiU1VQUExJRVJfTU9EIiwiQ0xPTkVEX1NVUFBMSUVSX01PRCIsIm9wdGlvbkltYWdlVXJsIiwiaW1hZ2VOb3RGb3VudCIsInNyYyIsImxpbmtlZEZpbGUiLCJ2aWV3VXJsIiwiYWxsb3dlZEZpbGVUeXBlcyIsImZpbGVUeXBlTWFwcGluZyIsImFsbG93RmlsZUpwZWciLCJhbGxvd0ZpbGVHaWYiLCJhbGxvd0ZpbGVQZGYiLCJhbGxvd0ZpbGVQbmciLCJhbGxvd0ZpbGVBaSIsImFsbG93ZWRUeXBlcyIsIk9iamVjdCIsImtleXMiLCJmaWx0ZXIiLCJhdHRyaWJ1dGVOYW1lIiwibWFwIiwiam9pbiIsImJ1aWxkVmFyaWF0aW9uT3B0aW9uIiwiX29iamVjdFNwcmVhZCIsImJ1aWxkRW1wdHlWYXJpYXRpb24iLCJkZWZhdWx0VmFsdWUiLCJ1bmRlZmluZWQiLCJFcnJvciIsImVyciIsIm9wdGlvbnMiLCJpc1NlbGVjdGFibGUiLCJmaWVsZFR5cGUiLCJzZWxlY3RhYmxlIiwiU2V0IiwiU0VMRUNUIiwiQ0hFQ0tCT1giLCJSQURJTyIsIklNQUdFX1NFTEVDVCIsIkNPTE9VUl9TRUxFQ1QiLCJoYXMiLCJzZWxlY3RhYmxlT3B0aW9ucyIsInZhbHVlcyIsIl9pdGVyYXRvciIsIl9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyIiwiX3N0ZXAiLCJzIiwibiIsImRvbmUiLCJzZWxsZXJQcm9kdWN0RWRpdGFibGUiLCJpbmNsdWRlIiwicHVzaCIsImlkIiwiZSIsImYiLCJyZXN1bHQiLCJ1bml0Q29zdFRvdGFsIiwia2V5IiwiYnVpbGRFbXB0eVZhcmlhdGlvbkdyb3VwIiwicHJvZHVjdCIsIl9wcm9kdWN0JGdyb3VwVmFyaWF0aSIsImdyb3VwVmFyaWF0aW9uRmllbGRzIiwicXVhbnRpdHkiLCJ2YXJpYXRpb25zIiwic29ydGVkRmllbGRzIiwiX2l0ZXJhdG9yMiIsIl9zdGVwMiIsImVtcHR5IiwiZ3JvdXBDb3N0IiwiaXNQcm9kdWN0U3VwcGxpZXJNT0QiLCJwcm9kdWN0VHlwZSIsIlN0cmluZyIsIlNVUFBMSUVSX1JFU0VMTF9NT0QiLCJpbmNsdWRlcyIsImlzUHJvZHVjdFR5cGVGaWxlRG93bmxvYWQiLCJwYXJzZUludCIsIlNFTExFUl9GSUxFX0RPV05MT0FEIiwiaXNQcm9kdWN0RmlsZURvd25sb2FkIiwiaXNvQ291bnRyaWVzIiwiQUYiLCJBWCIsIkFMIiwiRFoiLCJBUyIsIkFEIiwiQU8iLCJBSSIsIkFRIiwiQUciLCJBUiIsIkFNIiwiQVciLCJBVSIsIkFUIiwiQVoiLCJCUyIsIkJIIiwiQkQiLCJCQiIsIkJZIiwiQkUiLCJCWiIsIkJKIiwiQk0iLCJCVCIsIkJPIiwiQkEiLCJCVyIsIkJWIiwiQlIiLCJJTyIsIkJOIiwiQkciLCJCRiIsIkJJIiwiS0giLCJDTSIsIkNBIiwiQ1YiLCJLWSIsIkNGIiwiVEQiLCJDTCIsIkNOIiwiQ1giLCJDQyIsIkNPIiwiS00iLCJDRyIsIkNEIiwiQ0siLCJDUiIsIkNJIiwiSFIiLCJDVSIsIkNZIiwiQ1oiLCJESyIsIkRKIiwiRE0iLCJETyIsIkVDIiwiRUciLCJTViIsIkdRIiwiRVIiLCJFRSIsIkVUIiwiRksiLCJGTyIsIkZKIiwiRkkiLCJGUiIsIkdGIiwiUEYiLCJURiIsIkdBIiwiR00iLCJHRSIsIkRFIiwiR0giLCJHSSIsIkdSIiwiR0wiLCJHRCIsIkdQIiwiR1UiLCJHVCIsIkdHIiwiR04iLCJHVyIsIkdZIiwiSFQiLCJITSIsIlZBIiwiSE4iLCJISyIsIkhVIiwiSVMiLCJJTiIsIklEIiwiSVIiLCJJUSIsIklFIiwiSU0iLCJJTCIsIklUIiwiSk0iLCJKUCIsIkpFIiwiSk8iLCJLWiIsIktFIiwiS0kiLCJLUiIsIktXIiwiS0ciLCJMQSIsIkxWIiwiTEIiLCJMUyIsIkxSIiwiTFkiLCJMSSIsIkxUIiwiTFUiLCJNTyIsIk1LIiwiTUciLCJNVyIsIk1ZIiwiTVYiLCJNTCIsIk1UIiwiTUgiLCJNUSIsIk1SIiwiTVUiLCJZVCIsIk1YIiwiRk0iLCJNRCIsIk1DIiwiTU4iLCJNRSIsIk1TIiwiTUEiLCJNWiIsIk1NIiwiTkEiLCJOUiIsIk5QIiwiTkwiLCJBTiIsIk5DIiwiTloiLCJOSSIsIk5FIiwiTkciLCJOVSIsIk5GIiwiTVAiLCJOTyIsIk9NIiwiUEsiLCJQVyIsIlBTIiwiUEEiLCJQRyIsIlBZIiwiUEUiLCJQSCIsIlBOIiwiUEwiLCJQVCIsIlBSIiwiUUEiLCJSRSIsIlJPIiwiUlUiLCJSVyIsIkJMIiwiU0giLCJLTiIsIkxDIiwiTUYiLCJQTSIsIlZDIiwiV1MiLCJTTSIsIlNUIiwiU0EiLCJTTiIsIlJTIiwiU0MiLCJTTCIsIlNHIiwiU0siLCJTSSIsIlNCIiwiU08iLCJaQSIsIkdTIiwiRVMiLCJMSyIsIlNEIiwiU1IiLCJTSiIsIlNaIiwiU0UiLCJDSCIsIlNZIiwiVFciLCJUSiIsIlRaIiwiVEgiLCJUTCIsIlRHIiwiVEsiLCJUTyIsIlRUIiwiVE4iLCJUUiIsIlRNIiwiVEMiLCJUViIsIlVHIiwiVUEiLCJBRSIsIkdCIiwiVVMiLCJVTSIsIlVZIiwiVVoiLCJWVSIsIlZFIiwiVk4iLCJWRyIsIlZJIiwiV0YiLCJFSCIsIllFIiwiWk0iLCJaVyIsImdldENvdW50cnlOYW1lIiwiY291bnRyeUNvZGUiLCJoYXNPd25Qcm9wZXJ0eSJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL3V0aWxzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNsb25lRGVlcFdpdGgsIG9yZGVyQnkgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgZm9ybWF0Q3VycmVuY3kgfSBmcm9tICcuLi91dGlscy9jdXJyZW5jeSc7XG5pbXBvcnQgeyBQcm9kdWN0VHlwZSB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHBuZ09wdGlvbk5vdEZvdW5kIGZyb20gJy4uL2ltYWdlcy9wcm9kdWN0LW5vdC1mb3VuZC5wbmcnO1xuaW1wb3J0IHsgRmllbGRUeXBlIH0gZnJvbSAnLi90eXBlcyc7XG5cbmZ1bmN0aW9uIHJlbmRlclNpbmdsZUNvc3RJbmRpY2F0aW9uKFxuICBjb3N0OiBhbnksXG4gIGN1cnJlbmN5Q29kZTogYW55LFxuICBjb3N0VHlwZVN0cmluZzogc3RyaW5nXG4pIHtcbiAgbGV0IGN1cnJlbmN5T3B0aW9ucyA9IHsgY3VycmVuY3k6IGN1cnJlbmN5Q29kZSwgc2hvd0NvZGVJZk5vU3ltYm9sOiBmYWxzZSB9O1xuICBsZXQgY29zdFN0cmluZyA9ICcnO1xuXG4gIGlmIChjb3N0KSB7XG4gICAgY29zdFN0cmluZyA9IGZvcm1hdEN1cnJlbmN5KHBhcnNlRmxvYXQoY29zdCksIGN1cnJlbmN5T3B0aW9ucyk7XG4gICAgY29zdFN0cmluZyA9ICcgKyAnICsgY29zdFN0cmluZyArICcgJyArIGNvc3RUeXBlU3RyaW5nO1xuICB9XG4gIHJldHVybiBjb3N0U3RyaW5nO1xufVxuXG5jb25zdCBjb3N0RGV0YWlsID0gKG9uY2VPZmZDb3N0OiBhbnksIHVuaXRDb3N0OiBhbnksIGN1cnJlbmN5Q29kZTogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IG9uY2VPZmZDb3N0RGVzY3JpcHRpb24gPSByZW5kZXJTaW5nbGVDb3N0SW5kaWNhdGlvbihcbiAgICBwYXJzZUZsb2F0KG9uY2VPZmZDb3N0KSxcbiAgICBjdXJyZW5jeUNvZGUsXG4gICAgJ29uY2Ugb2ZmJ1xuICApO1xuICBjb25zdCB1bml0Q29zdERlc2NyaXB0aW9uID0gcmVuZGVyU2luZ2xlQ29zdEluZGljYXRpb24oXG4gICAgcGFyc2VGbG9hdCh1bml0Q29zdCksXG4gICAgY3VycmVuY3lDb2RlLFxuICAgICdwZXIgdW5pdCdcbiAgKTtcbiAgcmV0dXJuIG9uY2VPZmZDb3N0RGVzY3JpcHRpb24gKyB1bml0Q29zdERlc2NyaXB0aW9uO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHZhcmlhdGlvbkZpZWxkQ29zdERldGFpbCh2YXJpYXRpb25GaWVsZDogYW55KSB7XG4gIGNvbnN0IHsgdmFyaWF0aW9uQ29zdCwgdmFyaWF0aW9uVW5pdENvc3QsIGN1cnJlbmN5IH0gPSB2YXJpYXRpb25GaWVsZDtcbiAgcmV0dXJuIGNvc3REZXRhaWwodmFyaWF0aW9uQ29zdCEsIHZhcmlhdGlvblVuaXRDb3N0ISwgY3VycmVuY3khKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhcmlhdGlvbkNvc3REZXRhaWwodmFyaWF0aW9uOiBhbnkpIHtcbiAgY29uc3QgeyBvbmNlT2ZmQ29zdCwgdW5pdENvc3QsIGN1cnJlbmN5IH0gPSB2YXJpYXRpb247XG4gIHJldHVybiBjb3N0RGV0YWlsKG9uY2VPZmZDb3N0ISwgdW5pdENvc3QhLCBjdXJyZW5jeSEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFyaWF0aW9uRmllbGRPcHRpb25Db3N0RGV0YWlsKG9wdGlvbjogYW55KSB7XG4gIGNvbnN0IHsgY3VycmVuY3ksIHZhcmlhdGlvbkNvc3QsIHZhcmlhdGlvblVuaXRDb3N0IH0gPSBvcHRpb247XG4gIHJldHVybiBjb3N0RGV0YWlsKHZhcmlhdGlvbkNvc3QhLCB2YXJpYXRpb25Vbml0Q29zdCEsIGN1cnJlbmN5ISk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGxpdFNlbGVjdGVkT3B0aW9ucyh2YWx1ZTogYW55KSB7XG4gIHJldHVybiB2YWx1ZSAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogdmFsdWUgPyB2YWx1ZS5zcGxpdCgnLCcpIDogW107XG59XG5cbmV4cG9ydCBjb25zdCBzdXBwbGllclNlbGxlckVkaXRhYmxlUHJvZHVjdFR5cGVzOiBBcnJheTxudW1iZXI+ID0gW1xuICBQcm9kdWN0VHlwZS5TVVBQTElFUl9NT0QsXG4gIFByb2R1Y3RUeXBlLkNMT05FRF9TVVBQTElFUl9NT0QsXG5dO1xuXG5leHBvcnQgZnVuY3Rpb24gb3B0aW9uSW1hZ2VVcmwob3B0aW9uOiBhbnkpIHtcbiAgY29uc3QgaW1hZ2VOb3RGb3VudCA9IHBuZ09wdGlvbk5vdEZvdW5kLnNyYztcbiAgcmV0dXJuIG9wdGlvbi5saW5rZWRGaWxlXG4gICAgPyBvcHRpb24ubGlua2VkRmlsZVxuICAgICAgPyBvcHRpb24ubGlua2VkRmlsZS52aWV3VXJsXG4gICAgICA6IGltYWdlTm90Rm91bnRcbiAgICA6IGltYWdlTm90Rm91bnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhbGxvd2VkRmlsZVR5cGVzKHZhcmlhdGlvbkZpZWxkOiBhbnkpOiBzdHJpbmcge1xuICBjb25zdCBmaWxlVHlwZU1hcHBpbmc6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7XG4gICAgYWxsb3dGaWxlSnBlZzogJy5qcGVnJyxcbiAgICBhbGxvd0ZpbGVHaWY6ICcuZ2lmJyxcbiAgICBhbGxvd0ZpbGVQZGY6ICcucGRmJyxcbiAgICBhbGxvd0ZpbGVQbmc6ICcucG5nJyxcbiAgICBhbGxvd0ZpbGVBaTogJy5haScsXG4gIH07XG5cbiAgY29uc3QgYWxsb3dlZFR5cGVzOiBzdHJpbmdbXSA9IE9iamVjdC5rZXlzKGZpbGVUeXBlTWFwcGluZylcbiAgICAuZmlsdGVyKChhdHRyaWJ1dGVOYW1lKSA9PiB2YXJpYXRpb25GaWVsZFthdHRyaWJ1dGVOYW1lXSlcbiAgICAubWFwKChhdHRyaWJ1dGVOYW1lKSA9PiBmaWxlVHlwZU1hcHBpbmdbYXR0cmlidXRlTmFtZV0pO1xuXG4gIHJldHVybiBhbGxvd2VkVHlwZXMuam9pbignLCcpO1xufVxuXG5mdW5jdGlvbiBidWlsZFZhcmlhdGlvbk9wdGlvbihvcHRpb246IGFueSkge1xuICByZXR1cm4geyAuLi5vcHRpb24gfTtcbn1cblxuZnVuY3Rpb24gYnVpbGRFbXB0eVZhcmlhdGlvbih2YXJpYXRpb25GaWVsZDogYW55KTogb2JqZWN0IHtcbiAgaWYgKHZhcmlhdGlvbkZpZWxkLmRlZmF1bHRWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdkZWZhdWx0VmFsdWUgaXMgdW5kZWZpbmVkLCBkaWQgeW91IGZvcmdldCB0byBlbWJlZCBpdD8nKTtcbiAgfVxuICBpZiAodmFyaWF0aW9uRmllbGQudmFyaWF0aW9uQ29zdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3QgZXJyID0gJ3ZhcmlhdGlvbkNvc3QgaXMgdW5kZWZpbmVkLCBkaWQgeW91IGZvcmdldCB0byBlbWJlZCBpdD8nO1xuICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICB9XG4gIGlmICh2YXJpYXRpb25GaWVsZC5vcHRpb25zID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ29wdGlvbnMgaXMgdW5kZWZpbmVkLCBkaWQgeW91IGZvcmdldCB0byBlbWJlZCBpdD8nKTtcbiAgfVxuXG4gIGNvbnN0IGlzU2VsZWN0YWJsZSA9ICgpOiBib29sZWFuID0+IHtcbiAgICBpZiAodmFyaWF0aW9uRmllbGQuZmllbGRUeXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZmllbGRUeXBlIGlzIHVuZGVmaW5lZCwgZGlkIHlvdSBmb3JnZXQgdG8gZW1iZWQgaXQ/Jyk7XG4gICAgfVxuICAgIGNvbnN0IHNlbGVjdGFibGUgPSBuZXcgU2V0KFtcbiAgICAgIEZpZWxkVHlwZS5TRUxFQ1QsXG4gICAgICBGaWVsZFR5cGUuQ0hFQ0tCT1gsXG4gICAgICBGaWVsZFR5cGUuUkFESU8sXG4gICAgICBGaWVsZFR5cGUuSU1BR0VfU0VMRUNULFxuICAgICAgRmllbGRUeXBlLkNPTE9VUl9TRUxFQ1QsXG4gICAgXSk7XG4gICAgcmV0dXJuIHNlbGVjdGFibGUuaGFzKHZhcmlhdGlvbkZpZWxkLmZpZWxkVHlwZSk7XG4gIH07XG5cbiAgbGV0IHZhbHVlID0gdmFyaWF0aW9uRmllbGQuZGVmYXVsdFZhbHVlO1xuICBsZXQgb25jZU9mZkNvc3QgPSB2YXJpYXRpb25GaWVsZC52YXJpYXRpb25Db3N0O1xuICBsZXQgc2VsZWN0YWJsZU9wdGlvbnM6IGFueVtdID0gW107XG5cbiAgaWYgKGlzU2VsZWN0YWJsZSgpKSB7XG4gICAgb25jZU9mZkNvc3QgPSAwO1xuICAgIGNvbnN0IHZhbHVlczogbnVtYmVyW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiB2YXJpYXRpb25GaWVsZC5vcHRpb25zKSB7XG4gICAgICBpZiAoXG4gICAgICAgICh2YXJpYXRpb25GaWVsZC5zZWxsZXJQcm9kdWN0RWRpdGFibGUgJiYgb3B0aW9uLmluY2x1ZGUpIHx8XG4gICAgICAgICghdmFyaWF0aW9uRmllbGQuc2VsbGVyUHJvZHVjdEVkaXRhYmxlICYmIG9wdGlvbi5kZWZhdWx0KVxuICAgICAgKSB7XG4gICAgICAgIGlmIChvcHRpb24udmFyaWF0aW9uQ29zdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgJ29wdGlvbi52YXJpYXRpb25Db3N0IGlzIHVuZGVmaW5lZCwgZGlkIHlvdSAnICtcbiAgICAgICAgICAgICAgJ2ZvcmdldCB0byBlbWJlZCBpdD8nXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZXMucHVzaChvcHRpb24uaWQpO1xuICAgICAgICBvbmNlT2ZmQ29zdCArPSBvcHRpb24udmFyaWF0aW9uQ29zdDtcbiAgICAgIH1cbiAgICAgIHNlbGVjdGFibGVPcHRpb25zLnB1c2goYnVpbGRWYXJpYXRpb25PcHRpb24ob3B0aW9uKSk7XG4gICAgfVxuICAgIHZhbHVlID0gdmFsdWVzLmpvaW4oKTtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IHtcbiAgICB2YWx1ZTogdmFsdWUsXG4gICAgb25jZU9mZkNvc3Q6IG9uY2VPZmZDb3N0LFxuICAgIHVuaXRDb3N0VG90YWw6IDAsXG4gICAgY29zdDogb25jZU9mZkNvc3QsXG4gICAgc2VsZWN0YWJsZU9wdGlvbnM6IHNlbGVjdGFibGVPcHRpb25zLFxuICAgIHZhcmlhdGlvbkZpZWxkOiBjbG9uZURlZXBXaXRoKHZhcmlhdGlvbkZpZWxkLCAodmFsdWU6IGFueSwga2V5Pzogc3RyaW5nIHwgbnVtYmVyKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycgJiYga2V5ID09PSAnbWVyY2hpJykge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgfSksXG5cbiAgfTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRFbXB0eVZhcmlhdGlvbkdyb3VwKHByb2R1Y3Q6IGFueSkge1xuICBjb25zdCB7IGdyb3VwVmFyaWF0aW9uRmllbGRzID0gW10gfSA9IHByb2R1Y3Q7XG4gIGNvbnN0IHJlc3VsdDogYW55ID0geyBxdWFudGl0eTogMCwgdmFyaWF0aW9uczogW10gfTtcbiAgY29uc3QgdmFyaWF0aW9ucyA9IFtdO1xuICBsZXQgY29zdCA9IDA7XG4gIGNvbnN0IHNvcnRlZEZpZWxkcyA9IG9yZGVyQnkoZ3JvdXBWYXJpYXRpb25GaWVsZHMsIFsncG9zaXRpb24nXSwgWydhc2MnXSk7XG4gIGZvciAoY29uc3QgdmFyaWF0aW9uRmllbGQgb2Ygc29ydGVkRmllbGRzKSB7XG4gICAgY29uc3QgZW1wdHk6IGFueSA9IGJ1aWxkRW1wdHlWYXJpYXRpb24odmFyaWF0aW9uRmllbGQpO1xuICAgIHZhcmlhdGlvbnMucHVzaChlbXB0eSk7XG4gICAgY29zdCArPSBlbXB0eS5jb3N0IGFzIG51bWJlcjtcbiAgfVxuICByZXN1bHQuZ3JvdXBDb3N0ID0gY29zdDtcbiAgcmVzdWx0LnZhcmlhdGlvbnMgPSB2YXJpYXRpb25zO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9kdWN0U3VwcGxpZXJNT0QocHJvZHVjdDogYW55KSB7XG4gIGNvbnN0IHByb2R1Y3RUeXBlID0gcHJvZHVjdCAmJiBwcm9kdWN0LnByb2R1Y3RUeXBlO1xuICByZXR1cm4gKFxuICAgIHByb2R1Y3QgJiZcbiAgICBbXG4gICAgICBTdHJpbmcoUHJvZHVjdFR5cGUuU1VQUExJRVJfTU9EKSxcbiAgICAgIFN0cmluZyhQcm9kdWN0VHlwZS5TVVBQTElFUl9SRVNFTExfTU9EKSxcbiAgICBdLmluY2x1ZGVzKFN0cmluZyhwcm9kdWN0VHlwZSkpXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Byb2R1Y3RUeXBlRmlsZURvd25sb2FkKHByb2R1Y3RUeXBlOiBhbnkpIHtcbiAgcmV0dXJuIHBhcnNlSW50KHByb2R1Y3RUeXBlLCAxMCkgPT09IFByb2R1Y3RUeXBlLlNFTExFUl9GSUxFX0RPV05MT0FEO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9kdWN0RmlsZURvd25sb2FkKHByb2R1Y3Q6IGFueSkge1xuICBjb25zdCB7IHByb2R1Y3RUeXBlIH0gPSBwcm9kdWN0O1xuICByZXR1cm4gaXNQcm9kdWN0VHlwZUZpbGVEb3dubG9hZChwcm9kdWN0VHlwZSk7XG59XG5cbmV4cG9ydCBjb25zdCBpc29Db3VudHJpZXM6IGFueSA9IHtcbiAgQUY6ICdBZmdoYW5pc3RhbicsXG4gIEFYOiAnQWxhbmQgSXNsYW5kcycsXG4gIEFMOiAnQWxiYW5pYScsXG4gIERaOiAnQWxnZXJpYScsXG4gIEFTOiAnQW1lcmljYW4gU2Ftb2EnLFxuICBBRDogJ0FuZG9ycmEnLFxuICBBTzogJ0FuZ29sYScsXG4gIEFJOiAnQW5ndWlsbGEnLFxuICBBUTogJ0FudGFyY3RpY2EnLFxuICBBRzogJ0FudGlndWEgQW5kIEJhcmJ1ZGEnLFxuICBBUjogJ0FyZ2VudGluYScsXG4gIEFNOiAnQXJtZW5pYScsXG4gIEFXOiAnQXJ1YmEnLFxuICBBVTogJ0F1c3RyYWxpYScsXG4gIEFUOiAnQXVzdHJpYScsXG4gIEFaOiAnQXplcmJhaWphbicsXG4gIEJTOiAnQmFoYW1hcycsXG4gIEJIOiAnQmFocmFpbicsXG4gIEJEOiAnQmFuZ2xhZGVzaCcsXG4gIEJCOiAnQmFyYmFkb3MnLFxuICBCWTogJ0JlbGFydXMnLFxuICBCRTogJ0JlbGdpdW0nLFxuICBCWjogJ0JlbGl6ZScsXG4gIEJKOiAnQmVuaW4nLFxuICBCTTogJ0Jlcm11ZGEnLFxuICBCVDogJ0JodXRhbicsXG4gIEJPOiAnQm9saXZpYScsXG4gIEJBOiAnQm9zbmlhIEFuZCBIZXJ6ZWdvdmluYScsXG4gIEJXOiAnQm90c3dhbmEnLFxuICBCVjogJ0JvdXZldCBJc2xhbmQnLFxuICBCUjogJ0JyYXppbCcsXG4gIElPOiAnQnJpdGlzaCBJbmRpYW4gT2NlYW4gVGVycml0b3J5JyxcbiAgQk46ICdCcnVuZWkgRGFydXNzYWxhbScsXG4gIEJHOiAnQnVsZ2FyaWEnLFxuICBCRjogJ0J1cmtpbmEgRmFzbycsXG4gIEJJOiAnQnVydW5kaScsXG4gIEtIOiAnQ2FtYm9kaWEnLFxuICBDTTogJ0NhbWVyb29uJyxcbiAgQ0E6ICdDYW5hZGEnLFxuICBDVjogJ0NhcGUgVmVyZGUnLFxuICBLWTogJ0NheW1hbiBJc2xhbmRzJyxcbiAgQ0Y6ICdDZW50cmFsIEFmcmljYW4gUmVwdWJsaWMnLFxuICBURDogJ0NoYWQnLFxuICBDTDogJ0NoaWxlJyxcbiAgQ046ICdDaGluYScsXG4gIENYOiAnQ2hyaXN0bWFzIElzbGFuZCcsXG4gIENDOiAnQ29jb3MgKEtlZWxpbmcpIElzbGFuZHMnLFxuICBDTzogJ0NvbG9tYmlhJyxcbiAgS006ICdDb21vcm9zJyxcbiAgQ0c6ICdDb25nbycsXG4gIENEOiAnQ29uZ28sIERlbW9jcmF0aWMgUmVwdWJsaWMnLFxuICBDSzogJ0Nvb2sgSXNsYW5kcycsXG4gIENSOiAnQ29zdGEgUmljYScsXG4gIENJOiBcIkNvdGUgRCdJdm9pcmVcIixcbiAgSFI6ICdDcm9hdGlhJyxcbiAgQ1U6ICdDdWJhJyxcbiAgQ1k6ICdDeXBydXMnLFxuICBDWjogJ0N6ZWNoIFJlcHVibGljJyxcbiAgREs6ICdEZW5tYXJrJyxcbiAgREo6ICdEamlib3V0aScsXG4gIERNOiAnRG9taW5pY2EnLFxuICBETzogJ0RvbWluaWNhbiBSZXB1YmxpYycsXG4gIEVDOiAnRWN1YWRvcicsXG4gIEVHOiAnRWd5cHQnLFxuICBTVjogJ0VsIFNhbHZhZG9yJyxcbiAgR1E6ICdFcXVhdG9yaWFsIEd1aW5lYScsXG4gIEVSOiAnRXJpdHJlYScsXG4gIEVFOiAnRXN0b25pYScsXG4gIEVUOiAnRXRoaW9waWEnLFxuICBGSzogJ0ZhbGtsYW5kIElzbGFuZHMgKE1hbHZpbmFzKScsXG4gIEZPOiAnRmFyb2UgSXNsYW5kcycsXG4gIEZKOiAnRmlqaScsXG4gIEZJOiAnRmlubGFuZCcsXG4gIEZSOiAnRnJhbmNlJyxcbiAgR0Y6ICdGcmVuY2ggR3VpYW5hJyxcbiAgUEY6ICdGcmVuY2ggUG9seW5lc2lhJyxcbiAgVEY6ICdGcmVuY2ggU291dGhlcm4gVGVycml0b3JpZXMnLFxuICBHQTogJ0dhYm9uJyxcbiAgR006ICdHYW1iaWEnLFxuICBHRTogJ0dlb3JnaWEnLFxuICBERTogJ0dlcm1hbnknLFxuICBHSDogJ0doYW5hJyxcbiAgR0k6ICdHaWJyYWx0YXInLFxuICBHUjogJ0dyZWVjZScsXG4gIEdMOiAnR3JlZW5sYW5kJyxcbiAgR0Q6ICdHcmVuYWRhJyxcbiAgR1A6ICdHdWFkZWxvdXBlJyxcbiAgR1U6ICdHdWFtJyxcbiAgR1Q6ICdHdWF0ZW1hbGEnLFxuICBHRzogJ0d1ZXJuc2V5JyxcbiAgR046ICdHdWluZWEnLFxuICBHVzogJ0d1aW5lYS1CaXNzYXUnLFxuICBHWTogJ0d1eWFuYScsXG4gIEhUOiAnSGFpdGknLFxuICBITTogJ0hlYXJkIElzbGFuZCAmIE1jZG9uYWxkIElzbGFuZHMnLFxuICBWQTogJ0hvbHkgU2VlIChWYXRpY2FuIENpdHkgU3RhdGUpJyxcbiAgSE46ICdIb25kdXJhcycsXG4gIEhLOiAnSG9uZyBLb25nJyxcbiAgSFU6ICdIdW5nYXJ5JyxcbiAgSVM6ICdJY2VsYW5kJyxcbiAgSU46ICdJbmRpYScsXG4gIElEOiAnSW5kb25lc2lhJyxcbiAgSVI6ICdJcmFuLCBJc2xhbWljIFJlcHVibGljIE9mJyxcbiAgSVE6ICdJcmFxJyxcbiAgSUU6ICdJcmVsYW5kJyxcbiAgSU06ICdJc2xlIE9mIE1hbicsXG4gIElMOiAnSXNyYWVsJyxcbiAgSVQ6ICdJdGFseScsXG4gIEpNOiAnSmFtYWljYScsXG4gIEpQOiAnSmFwYW4nLFxuICBKRTogJ0plcnNleScsXG4gIEpPOiAnSm9yZGFuJyxcbiAgS1o6ICdLYXpha2hzdGFuJyxcbiAgS0U6ICdLZW55YScsXG4gIEtJOiAnS2lyaWJhdGknLFxuICBLUjogJ0tvcmVhJyxcbiAgS1c6ICdLdXdhaXQnLFxuICBLRzogJ0t5cmd5enN0YW4nLFxuICBMQTogXCJMYW8gUGVvcGxlJ3MgRGVtb2NyYXRpYyBSZXB1YmxpY1wiLFxuICBMVjogJ0xhdHZpYScsXG4gIExCOiAnTGViYW5vbicsXG4gIExTOiAnTGVzb3RobycsXG4gIExSOiAnTGliZXJpYScsXG4gIExZOiAnTGlieWFuIEFyYWIgSmFtYWhpcml5YScsXG4gIExJOiAnTGllY2h0ZW5zdGVpbicsXG4gIExUOiAnTGl0aHVhbmlhJyxcbiAgTFU6ICdMdXhlbWJvdXJnJyxcbiAgTU86ICdNYWNhbycsXG4gIE1LOiAnTWFjZWRvbmlhJyxcbiAgTUc6ICdNYWRhZ2FzY2FyJyxcbiAgTVc6ICdNYWxhd2knLFxuICBNWTogJ01hbGF5c2lhJyxcbiAgTVY6ICdNYWxkaXZlcycsXG4gIE1MOiAnTWFsaScsXG4gIE1UOiAnTWFsdGEnLFxuICBNSDogJ01hcnNoYWxsIElzbGFuZHMnLFxuICBNUTogJ01hcnRpbmlxdWUnLFxuICBNUjogJ01hdXJpdGFuaWEnLFxuICBNVTogJ01hdXJpdGl1cycsXG4gIFlUOiAnTWF5b3R0ZScsXG4gIE1YOiAnTWV4aWNvJyxcbiAgRk06ICdNaWNyb25lc2lhLCBGZWRlcmF0ZWQgU3RhdGVzIE9mJyxcbiAgTUQ6ICdNb2xkb3ZhJyxcbiAgTUM6ICdNb25hY28nLFxuICBNTjogJ01vbmdvbGlhJyxcbiAgTUU6ICdNb250ZW5lZ3JvJyxcbiAgTVM6ICdNb250c2VycmF0JyxcbiAgTUE6ICdNb3JvY2NvJyxcbiAgTVo6ICdNb3phbWJpcXVlJyxcbiAgTU06ICdNeWFubWFyJyxcbiAgTkE6ICdOYW1pYmlhJyxcbiAgTlI6ICdOYXVydScsXG4gIE5QOiAnTmVwYWwnLFxuICBOTDogJ05ldGhlcmxhbmRzJyxcbiAgQU46ICdOZXRoZXJsYW5kcyBBbnRpbGxlcycsXG4gIE5DOiAnTmV3IENhbGVkb25pYScsXG4gIE5aOiAnTmV3IFplYWxhbmQnLFxuICBOSTogJ05pY2FyYWd1YScsXG4gIE5FOiAnTmlnZXInLFxuICBORzogJ05pZ2VyaWEnLFxuICBOVTogJ05pdWUnLFxuICBORjogJ05vcmZvbGsgSXNsYW5kJyxcbiAgTVA6ICdOb3J0aGVybiBNYXJpYW5hIElzbGFuZHMnLFxuICBOTzogJ05vcndheScsXG4gIE9NOiAnT21hbicsXG4gIFBLOiAnUGFraXN0YW4nLFxuICBQVzogJ1BhbGF1JyxcbiAgUFM6ICdQYWxlc3RpbmlhbiBUZXJyaXRvcnksIE9jY3VwaWVkJyxcbiAgUEE6ICdQYW5hbWEnLFxuICBQRzogJ1BhcHVhIE5ldyBHdWluZWEnLFxuICBQWTogJ1BhcmFndWF5JyxcbiAgUEU6ICdQZXJ1JyxcbiAgUEg6ICdQaGlsaXBwaW5lcycsXG4gIFBOOiAnUGl0Y2Fpcm4nLFxuICBQTDogJ1BvbGFuZCcsXG4gIFBUOiAnUG9ydHVnYWwnLFxuICBQUjogJ1B1ZXJ0byBSaWNvJyxcbiAgUUE6ICdRYXRhcicsXG4gIFJFOiAnUmV1bmlvbicsXG4gIFJPOiAnUm9tYW5pYScsXG4gIFJVOiAnUnVzc2lhbiBGZWRlcmF0aW9uJyxcbiAgUlc6ICdSd2FuZGEnLFxuICBCTDogJ1NhaW50IEJhcnRoZWxlbXknLFxuICBTSDogJ1NhaW50IEhlbGVuYScsXG4gIEtOOiAnU2FpbnQgS2l0dHMgQW5kIE5ldmlzJyxcbiAgTEM6ICdTYWludCBMdWNpYScsXG4gIE1GOiAnU2FpbnQgTWFydGluJyxcbiAgUE06ICdTYWludCBQaWVycmUgQW5kIE1pcXVlbG9uJyxcbiAgVkM6ICdTYWludCBWaW5jZW50IEFuZCBHcmVuYWRpbmVzJyxcbiAgV1M6ICdTYW1vYScsXG4gIFNNOiAnU2FuIE1hcmlubycsXG4gIFNUOiAnU2FvIFRvbWUgQW5kIFByaW5jaXBlJyxcbiAgU0E6ICdTYXVkaSBBcmFiaWEnLFxuICBTTjogJ1NlbmVnYWwnLFxuICBSUzogJ1NlcmJpYScsXG4gIFNDOiAnU2V5Y2hlbGxlcycsXG4gIFNMOiAnU2llcnJhIExlb25lJyxcbiAgU0c6ICdTaW5nYXBvcmUnLFxuICBTSzogJ1Nsb3Zha2lhJyxcbiAgU0k6ICdTbG92ZW5pYScsXG4gIFNCOiAnU29sb21vbiBJc2xhbmRzJyxcbiAgU086ICdTb21hbGlhJyxcbiAgWkE6ICdTb3V0aCBBZnJpY2EnLFxuICBHUzogJ1NvdXRoIEdlb3JnaWEgQW5kIFNhbmR3aWNoIElzbC4nLFxuICBFUzogJ1NwYWluJyxcbiAgTEs6ICdTcmkgTGFua2EnLFxuICBTRDogJ1N1ZGFuJyxcbiAgU1I6ICdTdXJpbmFtZScsXG4gIFNKOiAnU3ZhbGJhcmQgQW5kIEphbiBNYXllbicsXG4gIFNaOiAnU3dhemlsYW5kJyxcbiAgU0U6ICdTd2VkZW4nLFxuICBDSDogJ1N3aXR6ZXJsYW5kJyxcbiAgU1k6ICdTeXJpYW4gQXJhYiBSZXB1YmxpYycsXG4gIFRXOiAnVGFpd2FuJyxcbiAgVEo6ICdUYWppa2lzdGFuJyxcbiAgVFo6ICdUYW56YW5pYScsXG4gIFRIOiAnVGhhaWxhbmQnLFxuICBUTDogJ1RpbW9yLUxlc3RlJyxcbiAgVEc6ICdUb2dvJyxcbiAgVEs6ICdUb2tlbGF1JyxcbiAgVE86ICdUb25nYScsXG4gIFRUOiAnVHJpbmlkYWQgQW5kIFRvYmFnbycsXG4gIFROOiAnVHVuaXNpYScsXG4gIFRSOiAnVHVya2V5JyxcbiAgVE06ICdUdXJrbWVuaXN0YW4nLFxuICBUQzogJ1R1cmtzIEFuZCBDYWljb3MgSXNsYW5kcycsXG4gIFRWOiAnVHV2YWx1JyxcbiAgVUc6ICdVZ2FuZGEnLFxuICBVQTogJ1VrcmFpbmUnLFxuICBBRTogJ1VuaXRlZCBBcmFiIEVtaXJhdGVzJyxcbiAgR0I6ICdVbml0ZWQgS2luZ2RvbScsXG4gIFVTOiAnVW5pdGVkIFN0YXRlcycsXG4gIFVNOiAnVW5pdGVkIFN0YXRlcyBPdXRseWluZyBJc2xhbmRzJyxcbiAgVVk6ICdVcnVndWF5JyxcbiAgVVo6ICdVemJla2lzdGFuJyxcbiAgVlU6ICdWYW51YXR1JyxcbiAgVkU6ICdWZW5lenVlbGEnLFxuICBWTjogJ1ZpZXQgTmFtJyxcbiAgVkc6ICdWaXJnaW4gSXNsYW5kcywgQnJpdGlzaCcsXG4gIFZJOiAnVmlyZ2luIElzbGFuZHMsIFUuUy4nLFxuICBXRjogJ1dhbGxpcyBBbmQgRnV0dW5hJyxcbiAgRUg6ICdXZXN0ZXJuIFNhaGFyYScsXG4gIFlFOiAnWWVtZW4nLFxuICBaTTogJ1phbWJpYScsXG4gIFpXOiAnWmltYmFid2UnLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvdW50cnlOYW1lKGNvdW50cnlDb2RlOiBhbnkpIHtcbiAgaWYgKGlzb0NvdW50cmllcy5oYXNPd25Qcm9wZXJ0eShjb3VudHJ5Q29kZSkpIHtcbiAgICByZXR1cm4gaXNvQ291bnRyaWVzW2NvdW50cnlDb2RlXTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY291bnRyeUNvZGU7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsU0FBU0EsYUFBYSxF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