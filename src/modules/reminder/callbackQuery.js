const bot = require('../../bot');
const { formatTime } = require('../../utils');
const { ReminderType } = require('./constants');
const Reminder = require('./models/reminder');
const { scheduleNonRecurringReminderTask } = require('./utils');

const handleReminderTypeCallbackQuery = async (ctx, callbackQueryId, reminderId, reminderType) => {
  try {
    const reminder = await Reminder.findById(reminderId);
    if (!reminder) {
      throw new Error('Unable to find reminder while handling reminder type callback query');
    }
    if (reminderType === ReminderType.NON_RECURRING) {
      scheduleNonRecurringReminderTask(bot, reminder);
      ctx.reply(`Reminder scheduled on ${formatTime(reminder.reminderTimestamp)}`);
      ctx.answerCbQuery(callbackQueryId, { text: undefined });
    } else {
      // handle recurring reminder
    }
  } catch (err) {
    console.error(err.message);
    ctx.answerCbQuery(callbackQueryId, { text: 'Failed to create reminder' });
  }
};

module.exports = { handleReminderTypeCallbackQuery };
