const bot = require('../../bot');
const { DataType } = require('../../constants');
const { formatTime, encodeCallbackData } = require('../../utils');
const { ReminderType, ReminderFrequency } = require('./constants');
const Reminder = require('./models/reminder');
const { scheduleNonRecurringReminderTask, scheduleRecurringReminderTask } = require('./utils');

const handleReminderTypeCallbackQuery = async (ctx, callbackQueryId, reminderId, reminderType) => {
  try {
    const reminder = await Reminder.findById(reminderId);
    if (!reminder) {
      throw new Error('Unable to find reminder while handling reminder type callback query');
    }
    if (reminderType === ReminderType.NON_RECURRING) {
      scheduleNonRecurringReminderTask(bot, reminder);
      ctx.reply(`Reminder scheduled on ${formatTime(reminder.reminderTimestamp)}`);
    } else {
      ctx.reply('Indicate reminder frequency', {
        reply_markup: {
          inline_keyboard: Object.keys(ReminderFrequency).map((freq) => [
            {
              text: freq,
              callback_data: encodeCallbackData(
                DataType.REMINDER_FREQ,
                reminder._id.toString(),
                ReminderFrequency[freq],
              ),
            },
          ]),
        },
      });
    }
    ctx.answerCbQuery(callbackQueryId, { text: undefined });
  } catch (err) {
    console.error(err.message);
    ctx.answerCbQuery(callbackQueryId, { text: 'Failed to create reminder' });
  }
};

const handleReminderFreqCallbackQuery = async (ctx, callbackQueryId, reminderId, reminderFreq) => {
  try {
    const reminder = await Reminder.findById(reminderId);
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
    ctx.answerCbQuery(callbackQueryId, { text: undefined });
  } catch (err) {
    console.error(err.message);
    ctx.answerCbQuery(callbackQueryId, { text: 'Failed to create recurring reminder' });
  }
};

module.exports = { handleReminderTypeCallbackQuery, handleReminderFreqCallbackQuery };
