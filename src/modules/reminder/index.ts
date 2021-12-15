import bot from '../../bot';
import moment from 'moment';
import { encodeCallbackData } from '../../utils/index';
import { Reminder, ReminderType } from './types';
import { createNewReminder, deleteReminder, formatReminderForDisplay } from './utils';
import { DataType } from '../../types';
import ReminderModel from './models/reminder';
import { MAX_REMINDER_TEXT_LENGTH } from './constants';

bot.command('reminder', (ctx) => {
  ctx.reply(
    'What would you like to do?\n' +
      '1. Create new reminder /newreminder\n' +
      '2. List your scheduled reminders to view or delete /listreminder',
  );
});

bot.hears(/\/newreminder (\d?\d-\d?\d-\d\d \d?\d:\d\d) (.+)/, async (ctx) => {
  const chatId = ctx.message.chat.id;
  const { id: userId, username } = ctx.message.from;
  const reminderTimestamp = moment(ctx.match[1], 'D-M-YY H:mm').valueOf();
  const reminderText = ctx.match[2];

  if (reminderText.trim().length > MAX_REMINDER_TEXT_LENGTH) {
    ctx.reply('Sorry! Please limit reminder text length to 500!');
    return;
  }

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
    ctx.reply('Failed to create reminder. Sorry!');
  }
});

bot.command('newreminder', (ctx) => {
  ctx.reply(
    'Create new reminder by using the following command \n' +
      '/newreminder DD-MM-YY hh:mm {reminder text} \n' +
      'e.g. /newreminder 25-12-21 17:00 remember to bring christmas present!',
  );
});

bot.command('listreminder', async (ctx) => {
  const chatId = ctx.message.chat.id;
  const { id: userId, username } = ctx.message.from;

  try {
    const reminders = await ReminderModel.find({ chatId, userId });
    if (reminders.length === 0) {
      ctx.reply('You have no scheduled reminders!');
    } else {
      const reminderStrings = [`List of scheduled reminders for @${username}`];
      reminders.forEach((reminder: Reminder, index: number) => {
        reminderStrings.push(`${index + 1}. ` + formatReminderForDisplay(reminder, true));
      });
      ctx.reply(reminderStrings.join('\n'));
    }
  } catch (err) {
    console.error(
      `Failed to retrieve list of reminders for user ${username} (${userId}). ` + err.message,
    );
    ctx.reply('Sorry! Family bot failed to retrieve your list of scheduled reminders!');
  }
});

bot.hears(/\/deletereminder(.*)$/, async (ctx) => {
  const chatId = ctx.message.chat.id;
  const { id: userId, username } = ctx.message.from;
  const reminderId = ctx.match[1];
  try {
    await deleteReminder(reminderId);
    ctx.reply('Reminder successfully deleted!');
  } catch (err) {
    console.error(
      `Failed to delete reminder for user ${username} (${userId}) in chat ${chatId}. ` +
        err.message,
    );
    ctx.reply('Invalid delete reminder command! Nothing was deleted!');
  }
});
