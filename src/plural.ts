/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

// This is a "hack" until a proper `intl-pluralformat` package is created.
import IntlMessageFormat from 'intl-messageformat';

function resolveLocale(locales: string | string[]) {
  // IntlMessageFormat#_resolveLocale() does not depend on `this`.
  return IntlMessageFormat.prototype._resolveLocale(locales);
}

function findPluralFunction(locale: string) {
  // IntlMessageFormat#_findPluralFunction() does not depend on `this`.
  return IntlMessageFormat.prototype._findPluralRuleFunction(locale);
}

export interface IntlPluralFormat {
  format: (values?: any) => string;
}

export interface IntlPluralFormatConstructor {
  new (locales: string | string[], options: { style?: string }): IntlPluralFormat;
  (locales: string | string[], options: { style?: string }): IntlPluralFormat;
}

export class IntlPluralFormatImpl {
  format: (values?: any) => string;

  constructor(locales: string | string[], options: { style?: string } = {}) {
    let useOrdinal = options.style === 'ordinal';
    let pluralFn = findPluralFunction(resolveLocale(locales));

    this.format = (value) => pluralFn(value, useOrdinal);
  }
}
