declare module 'intl-format-cache' {
  type IntlFormatCacheFn = <T>(fn: T) => T;

  const IntlFormatCache: IntlFormatCacheFn;

  export = IntlFormatCache;
}
