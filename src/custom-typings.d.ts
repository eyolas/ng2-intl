declare module 'intl-messageformat' {
  interface IntlMessageFormat {
    format(values?: any): string;
    resolvedOptions(): { locale: string };
  }

  interface IntlMessageFormatOptions {
    number?: {
      'currency'?: {
        style?: string
      },

      'percent'?: {
        style?: string
      }
    };

    date?: {
      'short'?: {
        month?: string,
        day?: string,
        year?: string
      },

      'medium'?: {
        month?: string,
        day?: string,
        year?: string
      },

      'long'?: {
        month?: string,
        day?: string,
        year?: string
      },

      'full'?: {
        weekday?: string,
        month?: string,
        day?: string,
        year?: string
      }
    };

    time?: {
      'short'?: {
        hour?: string,
        minute?: string
      },

      'medium'?: {
        hour?: string
        minute?: string
        second?: string
      },

      'long'?: {
        hour?: string
        minute?: string
        second?: string
        timeZoneName?: string
      },

      'full'?: {
        hour?: string
        minute?: string
        second?: string
        timeZoneName?: string
      }
    };
  }

  interface IntlMessageFormatConstructor {
    new <T>(message: string, locales?: string | string[], formats?: IntlMessageFormatOptions): IntlMessageFormat;

    (message: string, locales?: string | string[], formats?: IntlMessageFormatOptions): IntlMessageFormat;

    __addLocaleData: (localStorage: any) => void;
    __localeData__: { [k: string]: any };
  }

  const IntlMessageFormat: IntlMessageFormatConstructor;

  export = IntlMessageFormat;
}

interface Thresholds {
  second: number,  // seconds to minute
  minute: number,  // minutes to hour
  hour: number,  // hours to day
  day: number,  // days to month
  month: number   // months to year
}

declare module 'intl-relativeformat' {
  interface IntlRelativeFormat {
    format(values?: any, options?: { now?: number | Date }): string;
    resolvedOptions(): { locale: string };
  }

  interface IntlRelativeFormatOptions {
    units?: string;
    style?: string;
  }

  interface IntlRelativeFormatConstructor {
    new (message: string, options?: IntlRelativeFormatOptions): IntlRelativeFormat;

    (message: string, options?: IntlRelativeFormatOptions): IntlRelativeFormat;

    __addLocaleData: (localStorage: any) => void;

    __localeData__: { [k: string]: any };

    thresholds: Thresholds
  }

  const IntlRelativeFormat: IntlRelativeFormatConstructor;

  export = IntlRelativeFormat;
}

declare module 'intl-format-cache' {
  interface intlFormatCacheFn {
    <T>(fn: T): T;
  }

  const IntlFormatCache: intlFormatCacheFn;

  export = IntlFormatCache;
}
