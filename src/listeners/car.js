import bot from '../bot.js';
import CarInfo from '../models/carInfo.js';
import { DataType } from '../constants.js';
import { parseCallbackData, formatTime } from '../utils/index.js';

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
              { text: '1A', callback_data: `${DataType.PARKING_INFO}_1A` },
              { text: '1B', callback_data: `${DataType.PARKING_INFO}_1B` },
            ],
            [
              { text: '2A', callback_data: `${DataType.PARKING_INFO}_2A` },
              { text: '2B', callback_data: `${DataType.PARKING_INFO}_2B` },
            ],
            [
              { text: '3A', callback_data: `${DataType.PARKING_INFO}_3A` },
              { text: '3B', callback_data: `${DataType.PARKING_INFO}_3B` },
            ],
            [
              { text: '4A', callback_data: `${DataType.PARKING_INFO}_4A` },
              { text: '4B', callback_data: `${DataType.PARKING_INFO}_4B` },
            ],
            [
              { text: '5A', callback_data: `${DataType.PARKING_INFO}_5A` },
              { text: '5B', callback_data: `${DataType.PARKING_INFO}_5B` },
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

  bot.on('callback_query', async (ctx) => {
    const { id, message, data } = ctx.update.callback_query;
    const chatId = message.chat.id;
    const [dataType, parkedLocation] = parseCallbackData(data);
    if (dataType !== DataType.PARKING_INFO) {
      return;
    }

    try {
      const carInfo = await CarInfo.findOne({ chatId });
      if (!carInfo) {
        const newCarInfo = new CarInfo({ chatId, location: parkedLocation });
        await newCarInfo.save();
        ctx.answerCbQuery(id, { text: `Car location of ${parkedLocation} is saved.` });
      } else {
        carInfo.location = parkedLocation;
        await carInfo.save();
        ctx.answerCbQuery(id, { text: `Car location of ${parkedLocation} is saved.` });
      }
    } catch (err) {
      ctx.answerCbQuery(id, { text: 'Failed to save new parked location.' });
    }
  });
};
