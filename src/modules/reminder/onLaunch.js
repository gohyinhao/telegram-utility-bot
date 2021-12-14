const bot = require('../../bot');
const Reminder = require('./models/reminder');
const { scheduleNonRecurringReminderTask } = require('./utils');

const runOnLaunch = async () => {
  console.log('Starting to re-schedule all reminder jobs');
  try {
    const reminders = await Reminder.find({});
    reminders.forEach((reminder) => {
      scheduleNonRecurringReminderTask(bot, reminder);
    });
    console.log('Finished re-scheduling all reminder jobs');
  } catch (err) {
    console.error('Failed to re-schedule all reminder jobs');
  }
};

runOnLaunch();
