import IntlRelativeFormat from 'intl-relativeformat';

import * as formatters from '../formatters';
import {
  escape,
  filterProps,
} from '../utils';

import { Injectable } from '@angular/core';
import { IntlService } from './intl.service';

const DATE_TIME_FORMAT_OPTIONS = [
  'localeMatcher',
  'formatMatcher',
  'timeZone',
  'hour12',
  'weekday',
  'era',
  'year',
  'month',
  'day',
  'hour',
  'minute',
  'second',
  'timeZoneName'
];

const NUMBER_FORMAT_OPTIONS = [
  'localeMatcher',
  'style',
  'currency',
  'currencyDisplay',
  'useGrouping',
  'minimumIntegerDigits',
  'minimumFractionDigits',
  'maximumFractionDigits',
  'minimumSignificantDigits',
  'maximumSignificantDigits',
];
const RELATIVE_FORMAT_OPTIONS = ['style', 'units'];
const PLURAL_FORMAT_OPTIONS = ['style'];

const RELATIVE_FORMAT_THRESHOLDS = {
  second: 60, // seconds to minute
  minute: 60, // minutes to hour
  hour: 24, // hours to day
  day: 30, // days to month
  month: 12, // months to year
};

function updateRelativeFormatThresholds(newThresholds) {
  const {thresholds} = IntlRelativeFormat;
  ({
    second: thresholds.second,
    minute: thresholds.minute,
    hour: thresholds.hour,
    day: thresholds.day,
    month: thresholds.month,
  } = newThresholds);
}

function getNamedFormat(formats, type, name) {
  let format = formats && formats[type] && formats[type][name];
  if (format) {
    return format;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(
      `[Ng Intl] No ${type} format named: ${name}`
    );
  }
}


@Injectable()
export class FormatService {
  constructor(private intlService: IntlService) {

  }

  formatDate(value, options: { format?: any } = {}) {
    const { locale, formats } = this.intlService.getConfig();
    const {format} = options;

    let date = new Date(value);
    let defaults = format && getNamedFormat(formats, 'date', format);
    let filteredOptions = filterProps(options, DATE_TIME_FORMAT_OPTIONS, defaults);

    try {
      return formatters.getDateTimeFormat(locale, filteredOptions).format(date);
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(
          `[Ng Intl] Error formatting date.\n${e}`
        );
      }
    }

    return String(date);
  }

  formatTime(value, options: { format?: any } = {}) {
    const {locale, formats} = this.intlService.getConfig();
    const {format} = options;

    let date = new Date(value);
    let defaults = format && getNamedFormat(formats, 'time', format);
    let filteredOptions = filterProps(options, DATE_TIME_FORMAT_OPTIONS, defaults);

    if (!filteredOptions.hour && !filteredOptions.minute && !filteredOptions.second) {
      // Add default formatting options if hour, minute, or second isn't defined.
      filteredOptions = Object.assign({},
        filteredOptions,
        {
          hour: 'numeric',
          minute: 'numeric'
        });
    }

    try {
      return formatters.getDateTimeFormat(locale, filteredOptions).format(date);
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(
          `[Ng Intl] Error formatting time.\n${e}`
        );
      }
    }

    return String(date);
  }

  formatRelative(value, options: { format?: any, now?: any } = {}) {
    const {formats, locale} = this.intlService.getConfig();
    const {format} = options;

    let date = new Date(value);
    let now = new Date();
    let defaults = format && getNamedFormat(formats, 'relative', format);
    let filteredOptions = filterProps(options, RELATIVE_FORMAT_OPTIONS, defaults);

    // Capture the current threshold values, then temporarily override them with
    // specific values just for this render.
    const oldThresholds = Object.assign({}, IntlRelativeFormat.thresholds);
    updateRelativeFormatThresholds(RELATIVE_FORMAT_THRESHOLDS);

    try {
      return formatters.getRelativeFormat(locale, filteredOptions).format(date, {
        now: now
      });
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(
          `[Ng Intl] Error formatting relative time.\n${e}`
        );
      }
    } finally {
      updateRelativeFormatThresholds(oldThresholds);
    }

    return String(date);
  }

  formatNumber(value, options: { format?: any } = {}) {
    const {formats, locale } = this.intlService.getConfig();
    const {format} = options;

    let defaults = format && getNamedFormat(formats, 'number', format);
    let filteredOptions = filterProps(options, NUMBER_FORMAT_OPTIONS, defaults);

    try {
      return formatters.getNumberFormat(locale, filteredOptions).format(value);
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(
          `[Ng Intl] Error formatting number.\n${e}`
        );
      }
    }

    return String(value);
  }

  formatPlural(value, options = {}) {
    const {locale} = this.intlService.getConfig();

    let filteredOptions = filterProps(options, PLURAL_FORMAT_OPTIONS);

    try {
      return formatters.getPluralFormat.bind(null)(locale, filteredOptions).format(value);
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(
          `[Ng Intl] Error formatting plural.\n${e}`
        );
      }
    }

    return 'other';
  }

  formatMessage(message, values = {}) {
    const {
      formats,
      locale
    } = this.intlService.getConfig();

    return formatters.getMessageFormat(
      message, locale, formats
    ).format(values);
  }

  formatHTMLMessage(message, rawValues = {}) {
    // Process all the values before they are used when formatting the ICU
    // Message string. Since the formatted message might be injected via
    // `innerHTML`, all String-based values need to be HTML-escaped.
    let escapedValues = Object.keys(rawValues).reduce((escaped, name) => {
      let value = rawValues[name];
      escaped[name] = typeof value === 'string' ? escape(value) : value;
      return escaped;
    }, {});

    return this.formatMessage(message, escapedValues);
  }
}
