export const currencyMap: any =
  {ALL: 'L',
    AFN: '؋',
    ARS: '$',
    AWG: 'ƒ',
    AUD: '$',
    AZN: '₼',
    BSD: '$',
    BBD: '$',
    BYR: 'p.',
    BZD: 'BZ$',
    BMD: '$',
    BOB: 'Bs.',
    BAM: 'KM',
    BWP: 'P',
    BGN: 'лв',
    BRL: 'R$',
    BND: '$',
    KHR: '៛',
    CAD: '$',
    KYD: '$',
    CLP: '$',
    CNY: '¥',
    COP: '$',
    CRC: '₡',
    HRK: 'kn',
    CUP: '₱',
    CZK: 'Kč',
    DKK: 'kr',
    DOP: 'RD$',
    XCD: '$',
    EGP: '£',
    SVC: '$',
    EEK: 'kr',
    EUR: '€',
    FKP: '£',
    FJD: '$',
    GHC: '₵',
    GIP: '£',
    GTQ: 'Q',
    GGP: '£',
    GYD: '$',
    HNL: 'L',
    HKD: '$',
    HUF: 'Ft',
    ISK: 'kr',
    INR: '₹',
    IDR: 'Rp',
    IRR: '﷼',
    IMP: '£',
    ILS: '₪',
    JMD: '`J$',
    JPY: '¥',
    JEP: '£',
    KES: 'KSh',
    KZT: 'лв',
    KPW: '₩',
    KRW: '₩',
    KGS: 'лв',
    LAK: '₭',
    LVL: 'Ls',
    LBP: '£',
    LRD: '$',
    LTL: 'Lt',
    MKD: 'ден',
    MYR: 'RM',
    MUR: '₨',
    MXN: '$',
    MNT: '₮',
    MZN: 'MT',
    NAD: '$',
    NPR: '₨',
    ANG: 'ƒ',
    NZD: '$',
    NIO: 'C$',
    NGN: '₦',
    NOK: 'kr',
    OMR: '﷼',
    PKR: '₨',
    PAB: 'B/.',
    PYG: 'Gs',
    PEN: 'S/.',
    PHP: '₱',
    PLN: 'zł',
    QAR: '﷼',
    RON: 'lei',
    RUB: '₽',
    RMB: '￥',
    SHP: '£',
    SAR: '﷼',
    RSD: 'Дин.',
    SCR: '₨',
    SGD: '$',
    SBD: '$',
    SOS: 'S',
    ZAR: 'R',
    LKR: '₨',
    SEK: 'kr',
    CHF: 'CHF',
    SRD: '$',
    SYP: '£',
    TZS: 'TSh',
    TWD: 'NT$',
    THB: '฿',
    TTD: 'TT$',
    TRY: '₺',
    TRL: '₤',
    TVD: '$',
    UGX: 'USh',
    UAH: '₴',
    GBP: '£',
    USD: '$',
    UYU: '$U',
    UZS: 'лв',
    VEF: 'Bs',
    VND: '₫',
    YER: '﷼',
    ZWD: 'Z$'};

type CurrencyOptions = {
  currency?: string;
  showCodeIfNoSymbol?: boolean;
  symbolAfterAmount?: boolean;
  financialNegative?: boolean;
  codeAfterSymbol?: boolean;
  codeBeforeSymbol?: boolean;
  spaceBetweenSymbol?: boolean;
  decimalPlaces?: number;
  decimalSeperator?: string;
  codeAfterAmount?: boolean;
};

export function formatCurrency(amount: any, options: CurrencyOptions = {}): string {
  const {
    currency = 'AUD',
    showCodeIfNoSymbol = true,
    symbolAfterAmount = false,
    financialNegative = false,
    codeAfterSymbol = false,
    codeBeforeSymbol = false,
    spaceBetweenSymbol = false,
    decimalPlaces = 2,
    decimalSeperator = '.',
    codeAfterAmount = false
  } = options;

  let symbol = '';
  let result = '';
  let negative = amount < 0;
  if (negative) amount = Math.abs(amount);

  if (Object.prototype.hasOwnProperty.call(currencyMap, currency)) {
    symbol = currencyMap[currency];
    if (codeAfterSymbol) symbol += `(${currency})`;
    if (codeBeforeSymbol) symbol = `(${currency})${symbol}`;
  } else if (showCodeIfNoSymbol) {
    symbol = currency;
  }

  amount = Number(amount.toFixed(decimalPlaces)).toFixed(decimalPlaces).replace('.', decimalSeperator);

  if (symbolAfterAmount) {
    result = amount + (spaceBetweenSymbol ? ' ' : '') + symbol;
  } else {
    result = symbol + (spaceBetweenSymbol ? ' ' : '') + amount;
  }

  if (negative) {
    result = financialNegative ? `(${result})` : `-${result}`;
  }

  if (codeAfterAmount) {
    result += ` (${currency})`;
  }

  return result;
}

function taxPercent(tax: any) {
  return tax ? `(${tax.taxPercent}%)` : '';
}

function includesTax(tax: any) {
  return tax && tax.taxPercent > 0 ?
    ` inc ${tax.taxName} ${taxPercent(tax)}` : '';
}

export function currencyTotalCostShowIncTax(job: any) {
  const { currency, taxType, totalCost } = job;
  const currencyOptions = {currency, showCodeIfNoSymbol: false};
  const withCurrency = formatCurrency(
    totalCost ? totalCost : 0,
    currencyOptions
  );
  return `${currency} ${withCurrency} ${includesTax(taxType)}`;
}
