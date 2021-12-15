import bot from '../../bot';
import { ReminderType } from './types';
import ReminderModel from './models/reminder';
import { scheduleNonRecurringReminderTask, scheduleRecurringReminderTask } from './utils';

const runOnLaunch = async () => {
  console.log('Starting to re-schedule all reminder jobs');
  try {
    const reminders = await ReminderModel.find({});
    reminders.forEach((reminder) => {
      if (reminder.type === ReminderType.NON_RECURRING) {
        scheduleNonRecurringReminderTask(bot, reminder);
      } else {
        scheduleRecurringReminderTask(bot, reminder);
      }
    });
    console.log('Finished re-scheduling all reminder jobs');
  } catch (err) {
    console.error('Failed to re-schedule all reminder jobs');
  }
};

runOnLaunch();
