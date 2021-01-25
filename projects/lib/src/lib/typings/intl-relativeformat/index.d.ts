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
    new (
      message: string,
      options?: IntlRelativeFormatOptions
    ): IntlRelativeFormat;

    (message: string, options?: IntlRelativeFormatOptions): IntlRelativeFormat;

    __addLocaleData: (localStorage: any) => void;

    __localeData__: { [k: string]: any };

    thresholds: Thresholds;
  }

  const IntlRelativeFormat: IntlRelativeFormatConstructor;

  export = IntlRelativeFormat;
}
