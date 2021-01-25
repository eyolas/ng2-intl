/* eslint-disable @typescript-eslint/naming-convention */
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
    thresholds: Thresholds;

    __addLocaleData: (localStorage: any) => void;

    __localeData__: { [k: string]: any };

    new (
      message: string,
      options?: IntlRelativeFormatOptions
    ): IntlRelativeFormat;

    (message: string, options?: IntlRelativeFormatOptions): IntlRelativeFormat;
  }

  const IntlRelativeFormat: IntlRelativeFormatConstructor;

  export = IntlRelativeFormat;
}
