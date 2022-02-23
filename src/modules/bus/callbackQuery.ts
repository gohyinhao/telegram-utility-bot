import { Context } from 'telegraf';
import { deleteItemFromCache, getItemFromCache } from '../../utils';
import { getBusStopMarkupList, replyWithBusArrivalInfo } from './utils';

export const handleBusStopSearchPaginateCbQuery = async (
  ctx: Context,
  chatId: string,
  messageId: string,
  offset: number,
) => {
  try {
    const busStopsJSON = await getItemFromCache(chatId, messageId);
    if (!busStopsJSON) {
      ctx.reply('Sorry! Search results expired! Please try again!');
      return;
    }
    const busStops = JSON.parse(busStopsJSON);
    ctx.reply('Are you looking for any of these bus stops?', {
      reply_markup: {
        inline_keyboard: getBusStopMarkupList(busStops, offset, messageId),
      },
    });
  } catch (err) {
    console.error(err.message);
    ctx.reply('Sorry! Family Bot is facing some difficulties!');
  }
  ctx.answerCbQuery();
};

export const handleBusStopSearchCbQuery = async (
  ctx: Context,
  chatId: string,
  messageId: string,
  busStopCode: string,
) => {
  await replyWithBusArrivalInfo(ctx, chatId, busStopCode);
  deleteItemFromCache(chatId, messageId);
};
