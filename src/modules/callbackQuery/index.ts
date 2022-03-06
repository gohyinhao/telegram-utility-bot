import { ParkingLocation } from 'src/modules/car/types';
import { ReminderFrequency, ReminderType } from 'src/modules/reminder/types';
import bot from '../../bot';
import { DataType } from '../../types';
import { parseCallbackData } from '../../utils/index';
import { handleAddFaveBobaDrinkCallbackQuery } from '../boba/callbackQuery';
import {
  handleAddFaveBusStopCbQuery,
  handleBusStopSearchCbQuery,
  handleBusStopSearchPaginateCbQuery,
} from '../bus/callbackQuery';
import { handleParkingInfoCallbackQuery } from '../car';
import { handleAddFaveFoodOrderCallbackQuery } from '../food/callbackQuery';
import {
  handleReminderTypeCallbackQuery,
  handleReminderFreqCallbackQuery,
} from '../reminder/callbackQuery';

bot.on('callback_query', async (ctx) => {
  // any typing used to override incorrect typing in callback_query type
  const { message, from, data } = ctx.update.callback_query as any;
  const chatId = message.chat.id;
  const userId = from.id;
  const [dataType, ...args] = parseCallbackData(data);

  switch (dataType) {
    case DataType.PARKING_INFO:
      await handleParkingInfoCallbackQuery(ctx, chatId, ...(args as [ParkingLocation]));
      break;
    case DataType.REMINDER_TYPE:
      await handleReminderTypeCallbackQuery(ctx, ...(args as [number, ReminderType]));
      break;
    case DataType.REMINDER_FREQ:
      await handleReminderFreqCallbackQuery(ctx, ...(args as [number, ReminderFrequency]));
      break;
    case DataType.BOBA_STORE:
      await handleAddFaveBobaDrinkCallbackQuery(ctx, chatId, userId, ...(args as [string, string]));
      break;
    case DataType.FOOD_STORE:
      await handleAddFaveFoodOrderCallbackQuery(ctx, chatId, userId, ...(args as [string, string]));
      break;
    case DataType.BUS_STOP_SEARCH_PAGINATE:
      await handleBusStopSearchPaginateCbQuery(
        ctx,
        chatId,
        args[0] as string,
        Number(args[1]),
        args[2] as DataType,
      );
      break;
    case DataType.BUS_STOP_SEARCH:
      await handleBusStopSearchCbQuery(ctx, chatId, ...(args as [string, string | undefined]));
      break;
    case DataType.ADD_FAVE_BUS_STOP:
      await handleAddFaveBusStopCbQuery(ctx, chatId, userId, ...(args as [string, string]));
      break;
  }

  ctx.deleteMessage(message.id);
});
