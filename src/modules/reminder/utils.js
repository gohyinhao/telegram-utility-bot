const Reminder = require('./models/reminder');

const createNewReminder = async (reminderFields) => {
  const newReminderInfo = new Reminder(reminderFields);
  return await newReminderInfo.save();
};

const getReminderTemplate = (text, username) => {
  return `Family bot reminder for @${username}\n` + text;
};

module.exports = { createNewReminder, getReminderTemplate };
