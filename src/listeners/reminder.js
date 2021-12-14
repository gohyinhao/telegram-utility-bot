import bot from '../bot.js';
import moment from 'moment';
import Reminder from '../models/reminder.js';
import { schedule } from '../scheduler.js';
import { formatTime } from '../utils/index.js';
import { ReminderType } from '../constants.js';

const createNewReminder = async (reminderFields) => {
  const newReminderInfo = new Reminder(reminderFields);
  return await newReminderInfo.save();
};

const getReminderTemplate = (text, username) => {
  return `Family bot reminder for @${username}\n` + text;
};

export default () => {
  bot.command('reminder', (ctx) => {
    ctx.reply('What would you like to do?\n' + '1. Create new reminder /newreminder');
  });

  bot.hears(/\/newreminder (\d?\d-\d?\d-\d\d \d?\d:\d\d) (.+)/, async (ctx) => {
    const chatId = ctx.message.chat.id;
    const { id: userId, username } = ctx.message.from;
    const reminderTimestamp = moment(ctx.match[1], 'D-M-YY H:mm').valueOf();
    const reminderText = ctx.match[2];

    await createNewReminder({
      chatId,
      userId,
      reminderTimestamp,
      reminderText,
      type: ReminderType.NON_RECURRING,
    });
    schedule.scheduleJob(new Date(reminderTimestamp), () => {
      ctx.reply(getReminderTemplate(reminderText, username));
    });
    ctx.reply(`Reminder scheduled on ${formatTime(reminderTimestamp)}`);
  });

  bot.command('newreminder', (ctx) => {
    ctx.reply(
      'Create new reminder by using the following command \n' +
        '/newreminder DD-MM-YY hh:mm {reminder text} \n' +
        'e.g. /newreminder 25-12-21 17:00 remember to bring christmas present!',
    );
  });
};
