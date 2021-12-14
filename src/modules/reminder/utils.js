const Reminder = require('./models/reminder');
const schedule = require('../../scheduler');

const createNewReminder = async (reminderFields) => {
  const newReminderInfo = new Reminder(reminderFields);
  return await newReminderInfo.save();
};

const getReminderTemplate = (text, username) => {
  return `Family bot reminder for @${username}\n` + text;
};

const scheduleNonRecurringReminderTask = (bot, reminder) => {
  const { _id, chatId, username, reminderText, reminderTimestamp } = reminder;
  schedule.scheduleJob(new Date(reminderTimestamp), async () => {
    bot.telegram.sendMessage(chatId, getReminderTemplate(reminderText, username));
    try {
      await Reminder.findByIdAndDelete(_id);
      console.log(`Successfully deleted reminder id ${_id.toString()} after job completed`);
    } catch (err) {
      console.error(`Failed to delete reminder id ${_id.toString()} after job completed`);
    }
  });
};

module.exports = { createNewReminder, getReminderTemplate, scheduleNonRecurringReminderTask };
