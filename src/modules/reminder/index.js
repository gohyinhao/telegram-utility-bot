const bot = require('../../bot');
const moment = require('moment');
const Reminder = require('./reminder');
const schedule = require('../../scheduler');
const { formatTime } = require('../../utils/index');
const { ReminderType } = require('./constants');
const { createNewReminder, getReminderTemplate } = require('./utils');

bot.command('reminder', (ctx) => {
  ctx.reply('What would you like to do?\n' + '1. Create new reminder /newreminder');
});

bot.hears(/\/newreminder (\d?\d-\d?\d-\d\d \d?\d:\d\d) (.+)/, async (ctx) => {
  const chatId = ctx.message.chat.id;
  const { id: userId, username } = ctx.message.from;
  const reminderTimestamp = moment(ctx.match[1], 'D-M-YY H:mm').valueOf();
  const reminderText = ctx.match[2];

  try {
    const reminder = await createNewReminder({
      chatId,
      userId,
      username,
      reminderTimestamp,
      reminderText,
      type: ReminderType.NON_RECURRING,
    });
    schedule.scheduleJob(new Date(reminderTimestamp), async () => {
      ctx.reply(getReminderTemplate(reminderText, username));
      try {
        await Reminder.findByIdAndDelete(reminder._id);
        console.log(
          `Successfully deleted reminder id ${reminder._id.toString()} after job completed`,
        );
      } catch (err) {
        console.error(
          `Failed to delete reminder id ${reminder._id.toString()} after job completed`,
        );
      }
    });
    ctx.reply(`Reminder scheduled on ${formatTime(reminderTimestamp)}`);
  } catch (err) {
    console.log(err.message);
    ctx.reply('Failed to create reminder. Database error.');
  }
});

bot.command('newreminder', (ctx) => {
  ctx.reply(
    'Create new reminder by using the following command \n' +
      '/newreminder DD-MM-YY hh:mm {reminder text} \n' +
      'e.g. /newreminder 25-12-21 17:00 remember to bring christmas present!',
  );
});
