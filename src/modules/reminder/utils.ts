import ReminderModel from './models/reminder';
import schedule from '../../scheduler';
import { Reminder, ReminderFrequency } from './types';
import moment from 'moment';
import { Telegraf } from 'telegraf';
import { OmitDbFields } from 'types';
import { formatTime } from '../../utils';

export const getNewTimestampAfterInterval = (
  currentTimestamp: number,
  freq: ReminderFrequency,
): number => {
  const time = moment(currentTimestamp);
  switch (freq) {
    case ReminderFrequency.MINUTE:
      time.add(1, 'minute');
      break;
    case ReminderFrequency.HOUR:
      time.add(1, 'hour');
      break;
    case ReminderFrequency.DAY:
      time.add(1, 'day');
      break;
    case ReminderFrequency.MONTH:
      time.add(1, 'month');
      break;
    case ReminderFrequency.QUARTER:
      time.add(3, 'months');
      break;
    case ReminderFrequency.BIANNUAL:
      time.add(6, 'months');
      break;
    case ReminderFrequency.YEAR:
      time.add(1, 'year');
      break;
  }
  return time.valueOf();
};

export const createNewReminder = async (reminderFields: OmitDbFields<Reminder>) => {
  const newReminderInfo = new ReminderModel(reminderFields);
  return await newReminderInfo.save();
};

export const getReminderTemplate = (text: string, username: string): string => {
  return `Family bot reminder for @${username}\n` + text;
};

export const scheduleNonRecurringReminderTask = (bot: Telegraf, reminder: Reminder) => {
  const { _id, chatId, username, reminderText, reminderTimestamp } = reminder;
  schedule.scheduleJob(_id.toString(), new Date(reminderTimestamp), async () => {
    bot.telegram.sendMessage(chatId, getReminderTemplate(reminderText, username));
    try {
      await ReminderModel.findByIdAndDelete(_id);
      console.log(`Successfully deleted reminder id ${_id.toString()} after job completed`);
    } catch (err) {
      console.error(`Failed to delete reminder id ${_id.toString()} after job completed`);
    }
  });
};

export const scheduleRecurringReminderTask = (bot: Telegraf, reminder: Reminder) => {
  const { _id, chatId, username, reminderText, reminderTimestamp, frequency } = reminder;
  schedule.scheduleJob(_id.toString(), new Date(reminderTimestamp), async () => {
    bot.telegram.sendMessage(chatId, getReminderTemplate(reminderText, username));
    try {
      if (!frequency) {
        throw new Error('Reminder is missing frequency field.');
      }
      const newReminder = await ReminderModel.findByIdAndUpdate(
        _id,
        {
          reminderTimestamp: getNewTimestampAfterInterval(reminderTimestamp, frequency),
        },
        { returnDocument: 'after' },
      );
      if (!newReminder) {
        throw new Error('Reminder missing from DB.');
      }
      scheduleRecurringReminderTask(bot, newReminder);
      console.log(
        `Successfully updated recurring reminder id ${_id.toString()} after job completed`,
      );
    } catch (err) {
      console.error(
        `Failed to update recurring reminder id ${_id.toString()} after job completed. ${
          err.message
        }`,
      );
      bot.telegram.sendMessage(chatId, 'Failed to schedule next recurring reminder.');
    }
  });
};

export const formatReminderForDisplay = (reminder: Reminder): string => {
  const { reminderTimestamp, reminderText, type, frequency } = reminder;
  let result = `${formatTime(reminderTimestamp)} | ${reminderText} | ${type}`;
  if (frequency) {
    result += ` every ${frequency}`;
  }
  return result;
};
