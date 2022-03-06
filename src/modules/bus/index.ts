import { setItemInCache } from '../../utils';
import bot from '../../bot';
import {
  addNewFaveBusStopToConfig,
  BUS_STOP_CACHE_DURATION_IN_SEC,
  getBusStopMarkupList,
  replyWithBusArrivalInfo,
  searchBusStops,
} from './utils';

bot.command('bus', (ctx) => {
  ctx.reply(
    'What would you like to do?\n' +
      '\nGeneral\n' +
      '1. Check bus arrival timing /checkbus\n' +
      '\nFavourite Bus Stop Management\n' +
      '1. Add new fave bus stop /addfavebusstop\n',
  );
});

/**
 * BUS ARRIVAL RELATED COMMANDS
 */
bot.hears(/\/checkbus (\d+)(?:|\s+(\d+\w?))$/, async (ctx) => {
  ctx.replyWithChatAction('typing');
  const chatId = ctx.message.chat.id;
  const busStopCode = ctx.match[1].trim();
  const busServiceNum = ctx.match[2]?.trim();
  await replyWithBusArrivalInfo(ctx, chatId, busStopCode, busServiceNum);
});

bot.hears(/\/checkbus (.+)/, async (ctx) => {
  ctx.replyWithChatAction('typing');
  const chatId = ctx.message.chat.id;
  const messageId = ctx.message.message_id;
  const searchString = ctx.match[1].trim();
  try {
    const busStops = await searchBusStops(searchString);
    if (busStops.length === 0) {
      ctx.reply("Can't find the bus stop you are looking for! Try double checking your spelling!");
      return;
    }
    setItemInCache(chatId, messageId, JSON.stringify(busStops), BUS_STOP_CACHE_DURATION_IN_SEC);
    ctx.reply('Are you looking for any of these bus stops?', {
      reply_markup: {
        inline_keyboard: getBusStopMarkupList(busStops, 0, messageId),
      },
    });
  } catch (err) {
    console.error(
      `Failed to search bus stop and get bus arrival info for chat ${chatId}. ` + err.message,
    );
    ctx.reply('Family bot error! Sorry!');
  }
});

bot.command('checkbus', (ctx) => {
  ctx.reply(
    'Check bus arrival timing by using one of following formats \n\n' +
      '1. /checkbus {bus stop number} {bus number (optional)} \n' +
      'e.g. /checkbus 53049\n' +
      'e.g. /checkbus 53049 162\n\n' +
      '2. /checkbus {street / bus stop name}\n' +
      'e.g. /checkbus keppel road\n' +
      'e.g. /checkbus opp outram park stn\n',
  );
});

/**
 * FAVE BUS STOP RELATED COMMANDS
 */
bot.hears(/\/addfavebusstop (\d+)$/, async (ctx) => {
  ctx.replyWithChatAction('typing');
  const userId = ctx.message.from.id;
  const busStopCode = ctx.match[1].trim();
  await addNewFaveBusStopToConfig(ctx, userId, busStopCode);
});

bot.command('addfavebusstop', (ctx) => {
  ctx.reply(
    'Add a favourite bus stop by using one of following formats \n\n' +
      '1. /addfavebusstop {bus stop number}\n' +
      'e.g. /addfavebusstop 53049\n' +
      '2. /addfavebusstop {street / bus stop name}\n' +
      'e.g. /addfavebusstop keppel road\n' +
      'e.g. /addfavebusstop opp outram park stn\n',
  );
});
