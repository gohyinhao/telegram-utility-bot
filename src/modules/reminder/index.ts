import bot from '../../bot';
import moment from 'moment';
import { encodeCallbackData } from '../../utils/index';
import { ReminderType } from './types';
import { createNewReminder } from './utils';
import { DataType } from '../../types';

bot.command('reminder', (ctx) => {
  ctx.reply('What would you like to do?\n' + '1. Create new reminder /newreminder');
});

bot.hears(/\/newreminder (\d?\d-\d?\d-\d\d \d?\d:\d\d) (.+)/, async (ctx) => {
  const chatId = ctx.message.chat.id;
  const { id: userId, username } = ctx.message.from;
  const reminderTimestamp = moment(ctx.match[1], 'D-M-YY H:mm').valueOf();
  const reminderText = ctx.match[2];

  try {
    if (!username) {
      throw new Error("Missing user's username");
    }
    // need to create reminder first and retrieve from db later due to max byte limit of 64 in callback data
    const reminder = await createNewReminder({
      chatId,
      userId,
      username,
      reminderTimestamp,
      reminderText,
      type: ReminderType.NON_RECURRING, // set as NON_RECURRING first, will have to edit later if it is recurring
    });
    ctx.reply('Is this a recurring reminder?', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Yes',
              callback_data: encodeCallbackData(
                DataType.REMINDER_TYPE,
                reminder._id.toString(),
                ReminderType.RECURRING,
              ),
            },
            {
              text: 'No',
              callback_data: encodeCallbackData(
                DataType.REMINDER_TYPE,
                reminder._id.toString(),
                ReminderType.NON_RECURRING,
              ),
            },
          ],
        ],
      },
    });
  } catch (err) {
    console.error(err.message);
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
