import { Types } from 'mongoose';
import { Context } from 'telegraf';
import { deleteItemFromCache, getItemFromCache } from '../../utils';
import FoodRecordModel from './models/foodRecord';

export const handleAddFaveFoodOrderCallbackQuery = async (
  ctx: Context,
  chatId: number,
  userId: number,
  recordId: string,
  messageId: string,
) => {
  try {
    const foodRecord = await FoodRecordModel.findById(recordId);
    if (!foodRecord) {
      throw new Error(
        'Unable to find food record while handling add fave food order callback query',
      );
    }

    const faveOrder = await getItemFromCache(chatId, messageId);
    deleteItemFromCache(chatId, messageId);

    if (!faveOrder) {
      throw new Error(
        'Unable to find fave order from cache while handling add fave food order callback query',
      );
    }

    if (foodRecord.favouriteOrders) {
      foodRecord.favouriteOrders.set(userId.toString(), faveOrder);
    } else {
      foodRecord.favouriteOrders = new Map([[userId.toString(), faveOrder]]) as Types.Map<string>;
    }
    await foodRecord.save();
    ctx.reply(`Favourite order saved for ${foodRecord.foodStore}!`);
  } catch (err) {
    console.error(err.message);
    ctx.reply('Sorry! Family bot facing some difficulties saving your favourite order!');
  }
  ctx.answerCbQuery();
};
