import mongoose from 'mongoose';
import { ReminderFrequency, ReminderType } from '../constants.js';

const reminderSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
      // will also serve as scheduler job id
    },
    chatId: {
      type: Number,
      required: true,
    },
    userId: {
      type: Number,
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

export default mongoose.model('Reminder', reminderSchema);
