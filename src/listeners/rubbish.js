const bot = require('../bot');
const { getRandomInt } = require('../utils');

const rubbishThrowerOptions = [
  'JJB',
  'JJB',
  'JJB',
  'JJB',
  'meh...just throw tomorrow...',
  'meh...mother go throw please',
  'Fisi but wait...which fisi...?',
  'Fisi-chan other self',
];

bot.onText(/\/rubbish/, (msg) => {
  const chatId = msg.chat.id;
  const response = `The person who should throw rubbish is ${
    rubbishThrowerOptions[getRandomInt(rubbishThrowerOptions.length)]
  }`;

  bot.sendMessage(chatId, response);
});
