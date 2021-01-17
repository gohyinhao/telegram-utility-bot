const bot = require('../bot');
const { getRandomInt } = require('../utils');

const bobaOptions = ['Bober', 'KOI', 'R&B', 'LiHo'];

bot.onText(/\/(boba)|(bbt)/, (msg) => {
  const chatId = msg.chat.id;
  const response = `How about having some ${bobaOptions[getRandomInt(bobaOptions.length)]} today?`;

  bot.sendMessage(chatId, response);
});
