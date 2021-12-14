/**
 * Enum to differentiate data from callback queries
 */
export const DataType = {
  PARKING_INFO: 'parking',
};

/**
 * Enum to indicate reminder frequency
 */
export const ReminderFrequency = {
  MINUTE: 'min',
  HOUR: 'hour',
  DAY: 'day',
  MONTH: 'mth',
  QUARTER: 'quarter',
  BIANNUAL: 'biannual',
  YEAR: 'year',
};

/**
 * Enum to indicate reminder type
 */
export const ReminderType = {
  RECURRING: 'recurring',
  NON_RECURRING: 'non-recurring',
};
