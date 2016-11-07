import memoizeIntlConstructor from 'intl-format-cache';
import IntlMessageFormat from 'intl-messageformat';
import IntlRelativeFormat from 'intl-relativeformat';
import {IntlPluralFormatConstructor, IntlPluralFormatImpl} from './plural';


export const getDateTimeFormat = memoizeIntlConstructor(Intl.DateTimeFormat).bind(null);
export const getNumberFormat = memoizeIntlConstructor(Intl.NumberFormat).bind(null);
export const getMessageFormat = memoizeIntlConstructor(IntlMessageFormat).bind(null);
export const getRelativeFormat = memoizeIntlConstructor(IntlRelativeFormat).bind(null);
export const getPluralFormat = <IntlPluralFormatConstructor>memoizeIntlConstructor((IntlPluralFormatImpl as any)).bind(null);


