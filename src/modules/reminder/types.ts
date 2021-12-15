import { ObjectId } from 'mongoose';

/**
 * Enum to indicate reminder frequency
 */
export enum ReminderFrequency {
  MINUTE = 'min',
  HOUR = 'hour',
  DAY = 'day',
  MONTH = 'month',
  QUARTER = 'quarter',
  BIANNUAL = 'biannual',
  YEAR = 'year',
}

/**
 * Enum to indicate reminder type
 */
export enum ReminderType {
  RECURRING = 'recurring',
  NON_RECURRING = 'non-recurring',
}

export interface Reminder {
  _id: ObjectId;
  chatId: number;
  userId: number;
  username: string;
  reminderTimestamp: number;
  reminderText: string;
  type: ReminderType;
  frequency?: ReminderFrequency;
  createdAt: Date;
  updatedAt: Date;
}
