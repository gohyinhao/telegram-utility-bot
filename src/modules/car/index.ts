import bot from '../../bot';
import CarInfo from './models/carInfo';
import { DataType } from '../../types';
import { formatTime, encodeCallbackData } from '../../utils/index';

export * from './callbackQuery';

bot.command('car', (ctx) => {
  ctx.reply(
    'What would you like to know?\n' +
      '1. Where is the car parked at? /wherecar\n' +
      '2. I want to record where I have just parked the car. /parkcar',
  );
});

bot.command('wherecar', async (ctx) => {
  const chatId = ctx.message.chat.id;
  try {
    const carInfo = await CarInfo.findOne({ chatId });
    if (!carInfo) {
      throw new Error();
    }
    ctx.reply(
      `Car was last parked at Floor ${carInfo.location} on ${formatTime(
        carInfo.updatedAt.valueOf(),
      )}.`,
    );
  } catch (err) {
    ctx.reply('Unable to find parking info.');
  }
});

bot.command('parkcar', async (ctx) => {
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
});
