import bot from '../../bot';
import { getRandomInt } from '../../utils';
import { MAX_BOBA_STORE_LENGTH } from './constants';
import BobaRecordModel from './models/bobaRecord';
import { BobaRecord } from './types';
import { createNewBobaRecord, formatBobaStoreForDisplay } from './utils';

bot.command('boba', (ctx) => {
  ctx.reply(
    'What would you like to do?\n' +
      '\nGeneral\n' +
      '1. What boba to drink today? /randombobastore\n' +
      '2. I need more detailed help with boba functions /bobahelp\n' +
      '\nBoba Store Management\n' +
      '1. Add new boba store to list /addbobastore\n' +
      '2. List all the boba store in the list /listbobastore\n' +
      '3. Delete boba store from list /deletebobastore\n',
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
    if (bobaRecords.length === 0) {
      ctx.reply('No boba stores added to the list!');
      return;
    }
    bobaRecords.forEach((bobaRecord: BobaRecord, index: number) => {
      response += `${index + 1}. ${formatBobaStoreForDisplay(bobaRecord)}\n`;
    });
    ctx.reply(response);
  } catch (err) {
    console.error(`Failed to retrieve boba store list for chat ${chatId}. ` + err.message);
    ctx.reply('Failed to list boba stores. Family Bot is sorry!');
  }
});

bot.command('randombobastore', async (ctx) => {
  const chatId = ctx.message.chat.id;
  try {
    const bobaRecords = await BobaRecordModel.find({ chatId });
    if (bobaRecords.length === 0) {
      ctx.reply('Add one of your favourite boba stores with /addbobastore command first!');
      return;
    }
    const randomBobaRecord = bobaRecords[getRandomInt(bobaRecords.length)];
    ctx.reply(`How about having some ${randomBobaRecord.bobaStore} today?`);
  } catch (err) {
    console.error(`Failed to get random boba store for chat ${chatId}. ` + err.message);
    ctx.reply('Something is wrong! Family bot failed to give boba suggestion. Sorry!');
  }
});

bot.hears(/\/deletebobastore(.+)$/, async (ctx) => {
  const bobaRecordId = ctx.match[1];
  try {
    const bobaRecord = await BobaRecordModel.findByIdAndDelete(bobaRecordId);
    if (!bobaRecord) {
      throw new Error('Unable to find boba record');
    }
    ctx.reply('Boba store record successfully deleted by family bot!');
  } catch (err) {
    console.error('Error while deleting boba record. ' + err.message);
    ctx.reply('Failed to delete boba store record. Sorry!');
  }
});

bot.command('deletebobastore', async (ctx) => {
  const chatId = ctx.message.chat.id;
  let response =
    "Which boba store do you want to delete? Note that this will also delete all users' saved favourites from this store\n";
  try {
    const bobaRecords = await BobaRecordModel.find({ chatId });
    if (bobaRecords.length === 0) {
      ctx.reply('No boba stores added to the list!');
      return;
    }
    bobaRecords.forEach((bobaRecord: BobaRecord, index: number) => {
      response += `${index + 1}. ${formatBobaStoreForDisplay(bobaRecord, true)}\n`;
    });
    ctx.reply(response);
  } catch (err) {
    console.error(
      `Failed to retrieve boba store list for chat ${chatId} for deletion. ` + err.message,
    );
    ctx.reply('Failed to list boba stores for deletion. Family Bot is sorry!');
  }
});
