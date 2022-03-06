import { DataType } from 'src/types';
import { Context } from 'telegraf';
import { deleteItemFromCache, getItemFromCache } from '../../utils';
import { addNewFaveBusStopToConfig, getBusStopMarkupList, replyWithBusArrivalInfo } from './utils';

export const handleBusStopSearchPaginateCbQuery = async (
  ctx: Context,
  chatId: string,
  messageId: string,
  offset: number,
  busStopCallbackDataType: DataType,
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
        inline_keyboard: getBusStopMarkupList(busStopCallbackDataType, busStops, offset, messageId),
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
  busStopCode: string,
  messageId?: string,
) => {
  await replyWithBusArrivalInfo(ctx, chatId, busStopCode);
  if (messageId !== undefined) {
    deleteItemFromCache(chatId, messageId);
  }
};

export const handleAddFaveBusStopCbQuery = async (
  ctx: Context,
  chatId: string,
  userId: number,
  busStopCode: string,
  messageId: string,
) => {
  await addNewFaveBusStopToConfig(ctx, userId, busStopCode);
  deleteItemFromCache(chatId, messageId);
};
