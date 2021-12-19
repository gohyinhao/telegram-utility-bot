import bot from '../../bot';
import { getRandomInt } from '../../utils';
import { MAX_RUBBISH_OPTION_LENGTH } from './constants';
import RubbishRecordModel from './models/rubbishRecord';

bot.command('rubbish', (ctx) => {
  ctx.reply(
    'What would you like to do?\n' +
      '1. Whose turn is it to throw the rubbish?! /whorubbish\n' +
      '2. Add potential rubbish thrower /addrubbish\n' +
      '3. List current rubbish throwers /listrubbish\n' +
      '4. Clear rubbish thrower list /clearrubbish\n',
  );
});

bot.command('whorubbish', async (ctx) => {
  const chatId = ctx.message.chat.id;
  try {
    const rubbishRecord = await RubbishRecordModel.findOne({ chatId });
    if (!rubbishRecord || rubbishRecord.options.length === 0) {
      ctx.reply('Add a rubbish thrower with /addrubbish command first!');
      return;
    }
    const randomRubbishThrower = rubbishRecord.options[getRandomInt(rubbishRecord.options.length)];
    ctx.reply(`${randomRubbishThrower}, please go throw the rubbish!`);
  } catch (err) {
    console.error(`Failed to get random rubbish thrower for chat ${chatId}. ` + err.message);
    ctx.reply('Something went wrong! Guess the rubbish can be left untouched for awhile longer...');
  }
});

bot.hears(/\/addrubbish (.+)/, async (ctx) => {
  const chatId = ctx.message.chat.id;
  const rubbishThrower = ctx.match[1].trim();

  if (rubbishThrower.length > MAX_RUBBISH_OPTION_LENGTH) {
    ctx.reply(`Sorry! Please limit rubbish thrower text length to ${rubbishThrower}!`);
    return;
  }

  try {
    const rubbishRecord = await RubbishRecordModel.findOne({ chatId });
    if (rubbishRecord) {
      if (rubbishRecord.options.includes(rubbishThrower)) {
        ctx.reply(
          "Family bot caught you trying to add the same rubbish thrower again! Don't be cheeky!",
        );
        return;
      }
      rubbishRecord.options = rubbishRecord.options.concat([rubbishThrower]);
      await rubbishRecord.save();
    } else {
      const newRubbishRecord = new RubbishRecordModel({ chatId, options: [rubbishThrower] });
      await newRubbishRecord.save();
    }
    ctx.reply('Rubbish thrower added!');
  } catch (err) {
    console.error(`Failed to add rubbish thrower for chat ${chatId}. ` + err.message);
    ctx.reply('Failed to add rubbish thrower...Sorry!');
  }
});

bot.command('addrubbish', (ctx) => {
  ctx.reply(
    'Add a rubbish thrower by using the following command \n' +
      '/addrubbish {rubbish thrower} \n' +
      'e.g. /addrubbish doggo man',
  );
});

bot.command('clearrubbish', async (ctx) => {
  const chatId = ctx.message.chat.id;
  try {
    const rubbishRecord = await RubbishRecordModel.findOne({ chatId });
    if (!rubbishRecord || rubbishRecord.options.length === 0) {
      ctx.reply('No assigned rubbish thrower! Nothing to clear!');
      return;
    }
    rubbishRecord.options = [];
    await rubbishRecord.save();
    ctx.reply("Rubbish thrower list cleared! Who's going to throw your rubbish now?!");
  } catch (err) {
    console.error(`Failed to clear rubbish thrower list for chat ${chatId}. ` + err.message);
    ctx.reply('Something went wrong! No break for the current rubbish throwers!');
  }
});
