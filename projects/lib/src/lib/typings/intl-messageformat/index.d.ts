/* eslint-disable @typescript-eslint/naming-convention */
declare module 'intl-messageformat' {
  interface IntlMessageFormat {
    format(values?: any): string;
    resolvedOptions(): { locale: string };
  }

  interface IntlMessageFormatOptions {
    number?: {
      currency?: {
        style?: string;
      };

      percent?: {
        style?: string;
      };
    };

    date?: {
      short?: {
        month?: string;
        day?: string;
        year?: string;
      };

      medium?: {
        month?: string;
        day?: string;
        year?: string;
      };

      long?: {
        month?: string;
        day?: string;
        year?: string;
      };

      full?: {
        weekday?: string;
        month?: string;
        day?: string;
        year?: string;
      };
    };

    time?: {
      short?: {
        hour?: string;
        minute?: string;
      };

      medium?: {
        hour?: string;
        minute?: string;
        second?: string;
      };

      long?: {
        hour?: string;
        minute?: string;
        second?: string;
        timeZoneName?: string;
      };

      full?: {
        hour?: string;
        minute?: string;
        second?: string;
        timeZoneName?: string;
      };
    };
  }

  interface IntlMessageFormatConstructor {
    __addLocaleData: (localStorage: any) => void;
    __localeData__: { [k: string]: any };

    new <T>(
      message: string,
      locales?: string | string[],
      formats?: IntlMessageFormatOptions
    ): IntlMessageFormat;

    (
      message: string,
      locales?: string | string[],
      formats?: IntlMessageFormatOptions
    ): IntlMessageFormat;
  }

  const IntlMessageFormat: IntlMessageFormatConstructor;

  export = IntlMessageFormat;
}
