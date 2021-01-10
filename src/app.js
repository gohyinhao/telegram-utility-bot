require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { getRandomInt } = require('./utils');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

const bobaOptions = ['Chi Cha San Chen', 'Bober', 'KOI', 'R&B', 'LiHo'];

bot.onText(/\/(boba)|(bbt)/, (msg) => {
  const chatId = msg.chat.id;
  const response = `How about having some ${bobaOptions[getRandomInt(bobaOptions.length)]} today?`;

  bot.sendMessage(chatId, response);
});

const fisiMessages = [
  'There is no real fisi. They are both fisi.',
  'Who is the real fisi?',
  'Fisi-chans work at the call centre.',
  'Fisi-chan is busy right now.',
  'Fisi-chan is currently unavailable, please try her other self.',
  'Where is fisi I wonder?',
];

bot.onText(/\/fisi/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, fisiMessages[getRandomInt(fisiMessages.length)]);
});

bot.onText(/\/car/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Where did you park the car?', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '1A', callback_data: '1A' },
          { text: '1B', callback_data: '1B' },
        ],
        [
          { text: '2A', callback_data: '2A' },
          { text: '2B', callback_data: '2B' },
        ],
        [
          { text: '3A', callback_data: '3A' },
          { text: '3B', callback_data: '3B' },
        ],
        [
          { text: '4A', callback_data: '4A' },
          { text: '4B', callback_data: '4B' },
        ],
        [
          { text: '5A', callback_data: '5A' },
          { text: '5B', callback_data: '5B' },
        ],
      ],
    },
  });
});
