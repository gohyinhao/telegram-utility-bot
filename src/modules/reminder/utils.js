const Reminder = require('./models/reminder');
const schedule = require('../../scheduler');
const { ReminderFrequency } = require('./constants');
const moment = require('moment');

const getNewTimestampAfterInterval = (currentTimestamp, freq) => {
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
          reminderTimestamp: getNewTimestampAfterInterval(reminderTimestamp, frequency),
        },
        { returnDocument: 'after' },
      );
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
    }
  });
};

module.exports = {
  getNewTimestampAfterInterval,
  createNewReminder,
  getReminderTemplate,
  scheduleNonRecurringReminderTask,
  scheduleRecurringReminderTask,
};
