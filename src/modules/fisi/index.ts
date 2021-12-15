import bot from '../../bot';
import { getRandomInt } from '../../utils/index';

const fisiMessages = [
  'There is no real fisi. They are both fisi.',
  'Who is the real fisi?',
  'Fisi-chans work at the call centre.',
  'Fisi-chan is busy right now.',
  'Fisi-chan is currently unavailable, please try her other self.',
  'Where is fisi I wonder?',
];

bot.command('fisi', (ctx) => {
  ctx.reply(fisiMessages[getRandomInt(fisiMessages.length)]);
});
