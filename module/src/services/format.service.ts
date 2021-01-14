import IntlRelativeFormat from 'intl-relativeformat';
import * as formatters from '../formatters';
import { escape, filterProps } from '../utils';
import { Observable ,  Observer } from 'rxjs';
import { Injectable } from '@angular/core';
import { IntlService } from './intl.service';
import {
  DATE_TIME_FORMAT_OPTIONS,
  RELATIVE_FORMAT_OPTIONS,
  RELATIVE_FORMAT_THRESHOLDS,
  NUMBER_FORMAT_OPTIONS,
  PLURAL_FORMAT_OPTIONS
} from './format';
import { MessageDescriptor, DateTimeFormatOptions, NumberFormatOptions, PluralFormatOptions, RelativeFormatOptions } from '../interfaces';
import { debug } from '../debug';


function updateRelativeFormatThresholds(newThresholds: Thresholds) {
  const {thresholds} = IntlRelativeFormat;
  ({
    second: thresholds.second,
    minute: thresholds.minute,
    hour: thresholds.hour,
    day: thresholds.day,
    month: thresholds.month,
  } = newThresholds);
}

function getNamedFormat(formats: any, type: string, name: string) {
  const format = formats && formats[type] && formats[type][name];
  if (format) {
    return format;
  }

  debug(
    `[Ng2 Intl] No ${type} format named: ${name}`
  );
}


@Injectable()
export class FormatService {
  constructor(private intlService: IntlService) { }

  formatDate(value: any, options: DateTimeFormatOptions & { format?: any } = {}): string {
    const { locale, formats } = this.intlService.getConfig();
    const {format} = options;

    const date = value instanceof Date ? value : new Date(value);
    const defaults = format && getNamedFormat(formats, 'date', format);
    const filteredOptions = filterProps(options, DATE_TIME_FORMAT_OPTIONS, defaults);

    try {
      return formatters.getDateTimeFormat(locale, filteredOptions).format(date);
    } catch (e) {
      debug(
        `[Ng2 Intl] Error formatting date.\n${e}`
      );
    }

    return String(date);
  }

  formatTime(value: any, options: DateTimeFormatOptions & { format?: string } = {}): string {
    const {locale, formats} = this.intlService.getConfig();
    const {format} = options;

    const date = value instanceof Date ? value : new Date(value);
    const defaults = format && getNamedFormat(formats, 'time', format);
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
      debug(
        `[Ng2 Intl] Error formatting time.\n${e}`
      );
    }

    return String(date);
  }

  formatRelative(value: any, options: RelativeFormatOptions & {
    format?: string,
    now?: any
  } = {}): string {
    const {formats, locale} = this.intlService.getConfig();
    const {format} = options;

    const date = value instanceof Date ? value : new Date(value);
    const now = new Date();
    const defaults = format && getNamedFormat(formats, 'relative', format);
    const filteredOptions = filterProps(options, RELATIVE_FORMAT_OPTIONS, defaults);

    // Capture the current threshold values, then temporarily override them with
    // specific values just for this render.
    const oldThresholds = Object.assign({}, IntlRelativeFormat.thresholds);
    updateRelativeFormatThresholds(RELATIVE_FORMAT_THRESHOLDS);

    try {
      return formatters.getRelativeFormat(locale, filteredOptions).format(date, {
        now: now
      });
    } catch (e) {
      debug(
        `[Ng2 Intl] Error formatting relative time.\n${e}`
      );
    } finally {
      updateRelativeFormatThresholds(oldThresholds);
    }

    return String(date);
  }

  formatNumber(value: any, options: NumberFormatOptions & { format?: any } = {}): string {
    const {formats, locale } = this.intlService.getConfig();
    const {format} = options;

    const defaults = format && getNamedFormat(formats, 'number', format);
    const filteredOptions = filterProps(options, NUMBER_FORMAT_OPTIONS, defaults);

    try {
      return formatters.getNumberFormat(locale, filteredOptions).format(value);
    } catch (e) {
      debug(
        `[Ng2 Intl] Error formatting number.\n${e}`
      );
    }

    return String(value);
  }

  formatPlural(value: any, options: PluralFormatOptions = {}): string {
    const {locale} = this.intlService.getConfig();

    const filteredOptions = filterProps(options, PLURAL_FORMAT_OPTIONS);

    try {
      return formatters.getPluralFormat.bind(null)(locale, filteredOptions).format(value);
    } catch (e) {
      debug(
        `[Ng2 Intl] Error formatting plural.\n${e}`
      );
    }

    return 'other';
  }

  formatMessageAsync(descriptor: MessageDescriptor, values = {}): Observable<undefined | string> {
    const {
      id
    } = descriptor;

    return Observable.create((observer: Observer<undefined | string>) => {
      this.intlService.getAsync(id)
        .subscribe((message: string) => {
          observer.next(this.processFormatMessage(message, descriptor, values));
          observer.complete();
        });
    });
  }


  formatMessage(descriptor: MessageDescriptor, values = {}): undefined | string {
    const {
      id
    } = descriptor;

    const message = this.intlService.get(id);
    return this.processFormatMessage(message, descriptor, values);
  }

  private processFormatMessage(message: string, descriptor: MessageDescriptor, values = {}): undefined | string {
    const {
      formats,
      locale,
      defaultLocale
    } = this.intlService.getConfig();

    const {
      id,
      defaultMessage
    } = descriptor;
    const hasValues = Object.keys(values).length > 0;

    // Avoid expensive message formatting for simple messages without values. In
    // development messages will always be formatted in case of missing values.
    if (!hasValues) {
      return message || defaultMessage || id;
    }

    let formattedMessage: undefined | string;
    let defaultFormattedMessage: undefined | string;

    if (message) {
      try {
        const formatter = formatters.getMessageFormat(
          message, locale, formats
        );

        formattedMessage = formatter.format(values);
      } catch (e) {
        debug(
          `[Ng2 Intl] Error formatting message: "${id}" for locale: "${locale}"` +
          (defaultMessage ? ', using default message as fallback.' : '') +
          `\n${e}`
        );
      }
    } else {
      if (!defaultMessage ||
        (locale && defaultLocale && locale.toLowerCase() !== defaultLocale.toLowerCase())) {

        debug(
          `[Ng2 Intl] Missing message: "${id}" for locale: "${locale}"` +
          (defaultMessage ? ', using default message as fallback.' : '')
        );
      }
    }

    if (!formattedMessage && defaultMessage) {
      try {
        const formatter = formatters.getMessageFormat(
          defaultMessage, defaultLocale, formats
        );

        defaultFormattedMessage = formatter.format(values);
      } catch (e) {
        debug(
          `[Ng2 Intl] Error formatting the default message for: "${id}"` +
          `\n${e}`
        );
      }
    }

    if (!defaultFormattedMessage && typeof formattedMessage !== 'string') {
      debug(
        `[Ng2 Intl] Cannot format message: "${id}", ` +
        `using message ${message || defaultMessage ? 'source' : 'id'} as fallback.`
      );
    }

    if (formattedMessage) {
      return formattedMessage;
    }

    return defaultFormattedMessage || typeof formattedMessage === 'string' ? formattedMessage : message || defaultMessage || id;
  }

  formatHTMLMessage(descriptor: MessageDescriptor, rawValues: { [k: string]: any } = {}): undefined | string {
    const escapedValues = this.escapeValues(rawValues);
    return this.formatMessage(descriptor, escapedValues);
  }

  formatHTMLMessageAsync(descriptor: MessageDescriptor, rawValues: { [k: string]: any } = {}): Observable<undefined | string> {
    const escapedValues = this.escapeValues(rawValues);
    return this.formatMessageAsync(descriptor, escapedValues);
  }

  private escapeValues(rawValues: { [k: string]: any } = {}) {
    // Process all the values before they are used when formatting the ICU
    // Message string. Since the formatted message might be injected via
    // `innerHTML`, all String-based values need to be HTML-escaped.
    return Object.keys(rawValues).reduce<{ [k: string]: any }>((escaped, name) => {
      const value = rawValues[name];
      escaped[name] = typeof value === 'string' ? escape(value) : value;
      return escaped;
    }, {});
  }


}
