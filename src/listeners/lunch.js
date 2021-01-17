const bot = require('../bot');
const { getRandomInt } = require('../utils');

const lunchOptions = [
  'Bowl & Grill',
  'I Love Taimei',
  'Encik Tan',
  'Saizeriya',
  'Wok Hey',
  'saving some money! Go Limbang.',
  'some cup noodles...',
];

bot.onText(/\/lunch/, (msg) => {
  const chatId = msg.chat.id;
  const response = `How about ${lunchOptions[getRandomInt(lunchOptions.length)]}?`;

  bot.sendMessage(chatId, response);
});
