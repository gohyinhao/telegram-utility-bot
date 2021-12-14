const bot = require('../../bot');
const { DataType } = require('../../constants');
const { parseCallbackData } = require('../../utils/index');
const { handleParkingInfoCallbackQuery } = require('../car');

bot.on('callback_query', async (ctx) => {
  const { id, message, data } = ctx.update.callback_query;
  const chatId = message.chat.id;
  const [dataType, ...args] = parseCallbackData(data);

  switch (dataType) {
    case DataType.PARKING_INFO:
      await handleParkingInfoCallbackQuery(ctx, id, chatId, ...args);
      break;
  }
});
