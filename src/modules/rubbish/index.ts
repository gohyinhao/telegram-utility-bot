import bot from '../../bot';
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
