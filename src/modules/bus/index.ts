import bot from '../../bot';
import { getBusArrivalInfo } from './api';
import BusStopModel from './models/busStop';
import { formatBusArrivalInfosForDisplay } from './utils';

bot.command('bus', (ctx) => {
  ctx.reply(
    'What would you like to do?\n' + '\nGeneral\n' + '1. Check bus arrival timing /checkbus\n',
  );
});

/**
 * BUS ARRIVAL RELATED COMMANDS
 */
bot.hears(/\/checkbus (\d+)/, async (ctx) => {
  const chatId = ctx.message.chat.id;
  const busStopCode = ctx.match[1].trim();

  try {
    const busStopInfo = await BusStopModel.findOne({ BusStopCode: busStopCode });
    if (!busStopInfo) {
      ctx.reply('Invalid bus stop code!!!');
      return;
    }
    const busArrivalInfo = await getBusArrivalInfo(busStopCode);
    if (busArrivalInfo.length === 0) {
      ctx.reply('Damn...you missed the last bus, better luck next time!');
      return;
    }
    ctx.reply(formatBusArrivalInfosForDisplay(busStopCode, busArrivalInfo, busStopInfo));
  } catch (err) {
    console.error(`Failed to get bus arrival info for chat ${chatId}. ` + err.message);
    ctx.reply('Family bot error! Sorry!');
  }
});

bot.command('checkbus', (ctx) => {
  ctx.reply(
    'Check bus arrival timing by using the following format \n' +
      '/checkbus {bus stop number} {bus number (optional)} \n' +
      'e.g. /checkbus 53049\n' +
      'e.g. /checkbus 53049 162',
  );
});
