const bot = require('../bot');

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
