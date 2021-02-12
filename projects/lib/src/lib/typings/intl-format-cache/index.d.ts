declare module 'intl-format-cache' {
  type IntlFormatCacheFn = <T>(fn: T) => T;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const IntlFormatCache: IntlFormatCacheFn;

  export = IntlFormatCache;
}
