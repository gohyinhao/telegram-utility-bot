import { setItemInCache } from '../../utils';
import bot from '../../bot';
import {
  addNewFaveBusStopToConfig,
  BUS_STOP_CACHE_DURATION_IN_SEC,
  formatFaveBusStopForDisplay,
  getBusStopMarkupList,
  getFaveBusStopMarkupList,
  replyWithBusArrivalInfo,
  searchBusStops,
} from './utils';
import { DataType } from '../../types';
import UserBusConfigModel from './models/userBusConfig';
import { BusStop } from './types';

bot.command('bus', (ctx) => {
  ctx.reply(
    'What would you like to do?\n' +
      '\nGeneral\n' +
      '1. Check bus arrival timing /checkbus\n' +
      '2. Check bus arrival timing at fave bus stop /checkfavebusstop\n' +
      '\nFavourite Bus Stop Management\n' +
      '1. Add new fave bus stop /addfavebusstop\n' +
      '2. List fave bus stops /listfavebusstop\n',
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
        inline_keyboard: getBusStopMarkupList(DataType.BUS_STOP_SEARCH, busStops, 0, messageId),
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

bot.command('checkfavebusstop', async (ctx) => {
  ctx.replyWithChatAction('typing');
  const chatId = ctx.message.chat.id;
  const userId = ctx.message.from.id;
  try {
    const userBusConfig = await UserBusConfigModel.findOne({ userId })
      .populate('faveBusStops')
      .exec();

    if (!userBusConfig || userBusConfig.faveBusStopCodes.length === 0) {
      ctx.reply('You have no favourite bus stops! Add one first using /addfavebusstop command!');
      return;
    } else if (userBusConfig.faveBusStopCodes.length === 1) {
      await replyWithBusArrivalInfo(ctx, chatId, userBusConfig.faveBusStopCodes[0]);
      return;
    }
    ctx.reply('Which bus stops are you looking for?', {
      reply_markup: {
        inline_keyboard: getFaveBusStopMarkupList(userBusConfig.faveBusStops ?? []),
      },
    });
  } catch (err) {
    console.error(
      `Failed to search bus stop and get bus arrival info for chat ${chatId}. ` + err.message,
    );
    ctx.reply('Family bot error! Sorry!');
  }
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

bot.hears(/\/addfavebusstop (.+)/, async (ctx) => {
  ctx.replyWithChatAction('typing');
  const chatId = ctx.message.chat.id;
  const userId = ctx.message.from.id;
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
        inline_keyboard: getBusStopMarkupList(DataType.ADD_FAVE_BUS_STOP, busStops, 0, messageId),
      },
    });
  } catch (err) {
    console.error(
      `Failed to search bus stop and add fave bus stop for user ${userId} in chat ${chatId}. ` +
        err.message,
    );
    ctx.reply('Family bot error! Sorry!');
  }
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

bot.command('listfavebusstop', async (ctx) => {
  ctx.replyWithChatAction('typing');
  const userId = ctx.message.from.id;
  let response = 'List of fave bus stops\n';
  try {
    const userBusConfig = await UserBusConfigModel.findOne({ userId })
      .populate('faveBusStops')
      .exec();

    if (!userBusConfig || !userBusConfig.faveBusStops || userBusConfig.faveBusStops.length === 0) {
      ctx.reply('You have no favourite bus stops! Add one first using /addfavebusstop command!');
      return;
    }
    userBusConfig.faveBusStops.forEach((busStop: BusStop, index: number) => {
      response += `${index + 1}. ${formatFaveBusStopForDisplay(busStop, true)}\n`;
    });
    ctx.reply(response);
  } catch (err) {
    console.error(`Failed to retrieve fave bus stop list for user ${userId}. ` + err.message);
    ctx.reply('Failed to list your favourite bus stops. Family Bot is sorry!');
  }
});

bot.hears(/\/deletefavebusstop(\d+)$/, async (ctx) => {
  ctx.replyWithChatAction('typing');
  const userId = ctx.message.from.id;
  const busStopCode = ctx.match[1];
  try {
    const userBusConfig = await UserBusConfigModel.findOne({ userId }).exec();
    if (!userBusConfig || !userBusConfig.faveBusStopCodes.includes(busStopCode)) {
      ctx.reply(
        'Invalid command! Either invalid bus stop number or you do not have that bus stop as your favourite!',
      );
      return;
    }
    userBusConfig.faveBusStopCodes = userBusConfig.faveBusStopCodes.filter(
      (code: string) => code !== busStopCode,
    );
    await userBusConfig.save();
    ctx.reply('Bus stop successfully deleted from your favourites!');
  } catch (err) {
    console.error(`Error while deleting fave bus stop for user ${userId}. ` + err.message);
    ctx.reply('Failed to delete bus stop from your favourites! Sorry!');
  }
});
