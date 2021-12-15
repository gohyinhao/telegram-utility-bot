import { ParkingLocation } from 'modules/car/types';
import { ReminderFrequency, ReminderType } from 'modules/reminder/types';
import bot from '../../bot';
import { DataType } from '../../types';
import { parseCallbackData } from '../../utils/index';
import { handleParkingInfoCallbackQuery } from '../car';
import {
  handleReminderTypeCallbackQuery,
  handleReminderFreqCallbackQuery,
} from '../reminder/callbackQuery';

bot.on('callback_query', async (ctx) => {
  // any typing used to override incorrect typing in callback_query type
  const { message, data } = ctx.update.callback_query as any;
  const chatId = message.chat.id;
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
  }

  ctx.deleteMessage(message.id);
});