import bot from '../bot.js';
import { DataType } from '../constants.js';
import { parseCallbackData } from '../utils/index.js';
import { handleParkingInfoCallbackQuery } from './car.js';

export default () => {
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
};
