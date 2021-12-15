import bot from '../../bot';
import { DataType } from '../../types';
import { formatTime, encodeCallbackData } from '../../utils';
import { ReminderType, ReminderFrequency } from './types';
import ReminderModel from './models/reminder';
import { scheduleNonRecurringReminderTask, scheduleRecurringReminderTask } from './utils';
import { Context } from 'telegraf';

export const handleReminderTypeCallbackQuery = async (
  ctx: Context,
  reminderId: number,
  reminderType: ReminderType,
) => {
  try {
    const reminder = await ReminderModel.findById(reminderId);
    if (!reminder) {
      throw new Error('Unable to find reminder while handling reminder type callback query');
    }
    if (reminderType === ReminderType.NON_RECURRING) {
      scheduleNonRecurringReminderTask(bot, reminder);
      ctx.reply(`Reminder scheduled on ${formatTime(reminder.reminderTimestamp)}`);
    } else {
      ctx.reply('Indicate reminder frequency', {
        reply_markup: {
          inline_keyboard: Object.values(ReminderFrequency).map((value: ReminderFrequency) => [
            {
              text: value,
              callback_data: encodeCallbackData(
                DataType.REMINDER_FREQ,
                reminder._id.toString(),
                value,
              ),
            },
          ]),
        },
      });
    }
    ctx.answerCbQuery();
  } catch (err) {
    console.error(err.message);
    ctx.answerCbQuery('Failed to create reminder');
  }
};

export const handleReminderFreqCallbackQuery = async (
  ctx: Context,
  reminderId: number,
  reminderFreq: ReminderFrequency,
) => {
  try {
    const reminder = await ReminderModel.findById(reminderId);
    if (!reminder) {
      throw new Error('Unable to find reminder while handling reminder freq callback query');
    }
    reminder.type = ReminderType.RECURRING;
    reminder.frequency = reminderFreq;
    await reminder.save();
    scheduleRecurringReminderTask(bot, reminder);
    ctx.reply(
      `Recurring reminder scheduled on ${formatTime(
        reminder.reminderTimestamp,
      )} with ${reminderFreq} frequency`,
    );
    ctx.answerCbQuery();
  } catch (err) {
    console.error(err.message);
    ctx.answerCbQuery('Failed to create recurring reminder');
  }
};
