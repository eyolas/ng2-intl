
export const DATE_TIME_FORMAT_OPTIONS = [
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

export const NUMBER_FORMAT_OPTIONS = [
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
export const RELATIVE_FORMAT_OPTIONS = ['style', 'units'];
export const PLURAL_FORMAT_OPTIONS = ['style'];

export const RELATIVE_FORMAT_THRESHOLDS = {
  second: 60, // seconds to minute
  minute: 60, // minutes to hour
  hour: 24, // hours to day
  day: 30, // days to month
  month: 12, // months to year
};
