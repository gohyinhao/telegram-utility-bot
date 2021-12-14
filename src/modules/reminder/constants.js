/**
 * Enum to indicate reminder frequency
 */
const ReminderFrequency = {
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
const ReminderType = {
  RECURRING: 'recurring',
  NON_RECURRING: 'non-recurring',
};

module.exports = { ReminderFrequency, ReminderType };
