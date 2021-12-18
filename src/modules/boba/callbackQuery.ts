import { Types } from 'mongoose';
import { Context } from 'telegraf';
import { deleteItemFromCache, getItemFromCache } from '../../utils';
import BobaRecordModel from './models/bobaRecord';

export const handleAddFaveBobaDrinkCallbackQuery = async (
  ctx: Context,
  chatId: number,
  userId: number,
  recordId: string,
  messageId: string,
) => {
  try {
    const bobaRecord = await BobaRecordModel.findById(recordId);
    if (!bobaRecord) {
      throw new Error(
        'Unable to find boba record while handling add fave boba drink callback query',
      );
    }

    const faveOrder = await getItemFromCache(chatId, messageId);
    deleteItemFromCache(chatId, messageId);

    if (!faveOrder) {
      throw new Error(
        'Unable to find fave order from cache while handling add fave boba drink callback query',
      );
    }

    if (bobaRecord.favouriteOrders) {
      bobaRecord.favouriteOrders.set(userId.toString(), faveOrder);
    } else {
      bobaRecord.favouriteOrders = new Map([[userId.toString(), faveOrder]]) as Types.Map<string>;
    }
    await bobaRecord.save();
    ctx.reply(`Favourite order saved for ${bobaRecord.bobaStore}!`);
  } catch (err) {
    console.error(err.message);
    ctx.reply('Sorry! Family bot facing some difficulties saving your favourite order!');
  }
  ctx.answerCbQuery();
};
