import bot from '../bot.js';
import { getRandomInt } from '../utils/index.js';

const lunchOptions = [
  'Bowl & Grill',
  'I Love Taimei',
  'Encik Tan',
  'Saizeriya',
  'Wok Hey',
  'saving some money! Go Limbang.',
  'some cup noodles...',
];

export default () => {
  bot.command('lunch', (ctx) => {
    const response = `How about ${lunchOptions[getRandomInt(lunchOptions.length)]}?`;
    ctx.reply(response);
  });
};
