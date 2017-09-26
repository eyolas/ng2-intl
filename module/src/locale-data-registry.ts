/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

import IntlMessageFormat from 'intl-messageformat';
import IntlRelativeFormat from 'intl-relativeformat';

export function addLocaleData(data: any = []) {
    const locales = Array.isArray(data) ? data : [data];

    locales.forEach((localeData) => {
        if (localeData && localeData.locale) {
            IntlMessageFormat.__addLocaleData(localeData);
            IntlRelativeFormat.__addLocaleData(localeData);
        }
    });
}

export function hasLocaleData(locale: string): boolean {
    const localeParts = (locale || '').split('-');

    while (localeParts.length > 0) {
        if (hasIMFAndIRFLocaleData(localeParts.join('-'))) {
            return true;
        }

        localeParts.pop();
    }

    return false;
}

function hasIMFAndIRFLocaleData(locale: string): boolean {
    const normalizedLocale = locale && locale.toLowerCase();

    return !!(
        IntlMessageFormat.__localeData__[normalizedLocale] &&
        IntlRelativeFormat.__localeData__[normalizedLocale]
    );
}
