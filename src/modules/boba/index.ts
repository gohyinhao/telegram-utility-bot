import bot from '../../bot';
import { MAX_BOBA_STORE_LENGTH } from './constants';
import BobaRecordModel from './models/bobaRecord';
import { BobaRecord } from './types';
import { createNewBobaRecord } from './utils';

bot.command('boba', (ctx) => {
  ctx.reply(
    'What would you like to do?\n' +
      '1. I need more detailed help with boba functions /bobahelp\n' +
      '2. Add new boba store to list /addbobastore\n' +
      '3. List all the boba store in the list /listbobastore\n',
  );
});

bot.hears(/\/addbobastore (.+)/, async (ctx) => {
  const chatId = ctx.message.chat.id;
  const bobaStore = ctx.match[1].trim().toLowerCase();

  if (bobaStore.length > MAX_BOBA_STORE_LENGTH) {
    ctx.reply(
      `Sorry! Boba store cannot exceed text length of ${MAX_BOBA_STORE_LENGTH} characters!`,
    );
    return;
  }

  try {
    const bobaRecord = await BobaRecordModel.findOne({ chatId, bobaStore });
    if (bobaRecord) {
      ctx.reply('Boba store you are trying to add already exists in the list!');
      return;
    }

    await createNewBobaRecord({
      chatId,
      bobaStore,
    });
    ctx.reply('New boba store successfully added to the list!');
  } catch (err) {
    console.error(`Failed to add new boba store for chat ${chatId}. ` + err.message);
    ctx.reply('Failed to add new boba store to the list. Sorry!');
  }
});

bot.command('addbobastore', (ctx) => {
  ctx.reply(
    'Add new boba store by using the following format \n' +
      '/addbobastore {boba store} \n' +
      'e.g. /addbobastore koi',
  );
});

bot.command('listbobastore', async (ctx) => {
  const chatId = ctx.message.chat.id;
  let response = 'List of boba stores\n';
  try {
    const bobaRecords = await BobaRecordModel.find({ chatId });
    bobaRecords.forEach((bobaRecord: BobaRecord, index: number) => {
      response += `${index + 1}. ${bobaRecord.bobaStore}\n`;
    });
    ctx.reply(response);
  } catch (err) {
    console.error(`Failed to retrieve boba store list for chat ${chatId}. ` + err.message);
    ctx.reply('Failed to list boba stores. Family Bot is sorry!');
  }
});
