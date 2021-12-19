export type OmitDbFields<T> = Omit<T, '_id' | 'createdAt' | 'updatedAt'>;

/**
 * Enum to differentiate data from callback queries
 */
export enum DataType {
  PARKING_INFO = 'parking',
  REMINDER_TYPE = 'reminder-type',
  REMINDER_FREQ = 'reminder-freq',
  BOBA_STORE = 'boba-store',
  FOOD_STORE = 'food-store',
}
