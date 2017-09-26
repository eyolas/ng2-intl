export interface DateTimeFormatOptions {
  localeMatcher?: 'best fit' | 'lookup';
  formatMatcher?: 'basic' | 'best fit';
  timeZone?: string;
  hour12?: boolean;
  weekday?: 'narrow' | 'short' | 'long';
  era?: 'narrow' | 'short' | 'long';
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long';
  day?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
  timeZoneName?: 'short' | 'long';
}

export interface RelativeFormatOptions {
  style?: 'best fit' | 'numeric';
  units?: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';
}

export interface NumberFormatOptions {
  localeMatcher?: 'best fit' | 'lookup';
  style?: 'decimal' | 'currency' | 'percent';
  currency?: string;
  currencyDisplay?: 'symbol' | 'code' | 'name';
  useGrouping?: boolean;
  minimumIntegerDigits?: number;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  minimumSignificantDigits?: number;
  maximumSignificantDigits?: number;
}

export interface PluralFormatOptions {
    style?: 'cardinal' | 'ordinal';
}


export interface MessageDescriptor {
  id: string;
  defaultMessage?: string;
}
