const Reminder = require('./models/reminder');
const schedule = require('../../scheduler');
const { ReminderFrequency } = require('./constants');

const convertReminderFreqToMs = (freq) => {
  switch (freq) {
    case ReminderFrequency.MINUTE:
      return 1000 * 60;
    case ReminderFrequency.HOUR:
      return 1000 * 60 * 60;
    case ReminderFrequency.DAY:
      return 1000 * 60 * 60 * 24;
    case ReminderFrequency.MONTH:
      return 1000 * 60 * 60 * 24 * 30;
    case ReminderFrequency.QUARTER:
      return 1000 * 60 * 60 * 24 * 30 * 3;
    case ReminderFrequency.BIANNUAL:
      return 1000 * 60 * 60 * 24 * 30 * 3 * 2;
    case ReminderFrequency.YEAR:
      return 1000 * 60 * 60 * 24 * 30 * 3 * 2 * 2;
  }
};

const createNewReminder = async (reminderFields) => {
  const newReminderInfo = new Reminder(reminderFields);
  return await newReminderInfo.save();
};

const getReminderTemplate = (text, username) => {
  return `Family bot reminder for @${username}\n` + text;
};

const scheduleNonRecurringReminderTask = (bot, reminder) => {
  const { _id, chatId, username, reminderText, reminderTimestamp } = reminder;
  schedule.scheduleJob(_id.toString(), new Date(reminderTimestamp), async () => {
    bot.telegram.sendMessage(chatId, getReminderTemplate(reminderText, username));
    try {
      await Reminder.findByIdAndDelete(_id);
      console.log(`Successfully deleted reminder id ${_id.toString()} after job completed`);
    } catch (err) {
      console.error(`Failed to delete reminder id ${_id.toString()} after job completed`);
    }
  });
};

const scheduleRecurringReminderTask = (bot, reminder) => {
  const { _id, chatId, username, reminderText, reminderTimestamp, frequency } = reminder;
  schedule.scheduleJob(_id.toString(), new Date(reminderTimestamp), async () => {
    bot.telegram.sendMessage(chatId, getReminderTemplate(reminderText, username));
    try {
      const newReminder = await Reminder.findByIdAndUpdate(
        _id,
        {
          reminderTimestamp: reminderTimestamp + convertReminderFreqToMs(frequency),
        },
        { returnDocument: 'after' },
      );
      scheduleRecurringReminderTask(bot, newReminder);
      console.log(
        `Successfully updated recurring reminder id ${_id.toString()} after job completed`,
      );
    } catch (err) {
      console.log(err.message);
      console.error(`Failed to update recurring reminder id ${_id.toString()} after job completed`);
    }
  });
};

module.exports = {
  convertReminderFreqToMs,
  createNewReminder,
  getReminderTemplate,
  scheduleNonRecurringReminderTask,
  scheduleRecurringReminderTask,
};
