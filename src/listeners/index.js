const bot = require('../bot');

bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    'What can I help you with?\n' +
      '1. Car-related help. /car\n' +
      '2. Fisi-related help. /fisi\n' +
      '3. What boba should we get? /boba\n' +
      "4. What's for lunch? /lunch\n",
  );
});
