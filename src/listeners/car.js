import bot from '../bot.js';
import CarInfo from '../models/carInfo.js';
import { DataType } from '../constants.js';
import { formatTime, encodeCallbackData } from '../utils/index.js';

export const handleParkingInfoCallbackQuery = async (
  ctx,
  callbackQueryId,
  chatId,
  parkedLocation,
) => {
  try {
    const carInfo = await CarInfo.findOne({ chatId });
    if (!carInfo) {
      const newCarInfo = new CarInfo({ chatId, location: parkedLocation });
      await newCarInfo.save();
      ctx.answerCbQuery(callbackQueryId, { text: `Car location of ${parkedLocation} is saved.` });
    } else {
      carInfo.location = parkedLocation;
      await carInfo.save();
      ctx.answerCbQuery(callbackQueryId, { text: `Car location of ${parkedLocation} is saved.` });
    }
  } catch (err) {
    ctx.answerCbQuery(callbackQueryId, { text: 'Failed to save new parked location.' });
  }
};

export default () => {
  bot.hears(/\/.*car.*/, async (ctx) => {
    const chatId = ctx.message.chat.id;

    if (ctx.match.input.includes('where')) {
      try {
        const carInfo = await CarInfo.findOne({ chatId });
        if (!carInfo) {
          throw new Error();
        }
        ctx.reply(
          `Car was last parked at Floor ${carInfo.location} on ${formatTime(carInfo.updatedAt)}.`,
        );
      } catch (err) {
        ctx.reply('Unable to find parking info.');
      }
    } else if (ctx.match.input.includes('park')) {
      ctx.reply('Where did you park the car?', {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '1A', callback_data: encodeCallbackData(DataType.PARKING_INFO, '1A') },
              { text: '1B', callback_data: encodeCallbackData(DataType.PARKING_INFO, '1B') },
            ],
            [
              { text: '2A', callback_data: encodeCallbackData(DataType.PARKING_INFO, '2A') },
              { text: '2B', callback_data: encodeCallbackData(DataType.PARKING_INFO, '2B') },
            ],
            [
              { text: '3A', callback_data: encodeCallbackData(DataType.PARKING_INFO, '3A') },
              { text: '3B', callback_data: encodeCallbackData(DataType.PARKING_INFO, '3B') },
            ],
            [
              { text: '4A', callback_data: encodeCallbackData(DataType.PARKING_INFO, '4A') },
              { text: '4B', callback_data: encodeCallbackData(DataType.PARKING_INFO, '4B') },
            ],
            [
              { text: '5A', callback_data: encodeCallbackData(DataType.PARKING_INFO, '5A') },
              { text: '5B', callback_data: encodeCallbackData(DataType.PARKING_INFO, '5B') },
            ],
          ],
        },
      });
    } else {
      ctx.reply(
        'What would you like to know?\n' +
          '1. Where is the car parked at? /wherecar\n' +
          '2. I want to record where I have just parked the car. /parkcar',
      );
    }
  });
};
