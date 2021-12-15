import bot from '../../bot';
import { getRandomInt } from '../../utils/index';

const lunchOptions = [
  'Bowl & Grill',
  'I Love Taimei',
  'Encik Tan',
  'Saizeriya',
  'Wok Hey',
  'saving some money! Go Limbang.',
  'some cup noodles...',
];

bot.command('lunch', (ctx) => {
  const response = `How about ${lunchOptions[getRandomInt(lunchOptions.length)]}?`;
  ctx.reply(response);
});