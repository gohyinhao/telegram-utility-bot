import mongoose from 'mongoose';
import { MAX_REMINDER_TEXT_LENGTH } from '../constants';
import { Reminder, ReminderFrequency, ReminderType } from '../types';

const ReminderSchema = new mongoose.Schema(
  {
    chatId: {
      type: Number,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    reminderTimestamp: {
      type: Number,
      required: true,
    },
    reminderText: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxlength: MAX_REMINDER_TEXT_LENGTH,
    },
    type: {
      type: String,
      enum: Object.values(ReminderType),
      default: ReminderType.NON_RECURRING,
    },
    frequency: {
      type: String,
      enum: Object.values(ReminderFrequency),
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<Reminder>('Reminder', ReminderSchema);
