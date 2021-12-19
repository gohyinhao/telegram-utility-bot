import bot from '../../bot';
import { DataType } from '../../types';
import { encodeCallbackData, getRandomInt, setItemInCache } from '../../utils';
import { MAX_FAVE_ORDER_LENGTH, MAX_FOOD_STORE_LENGTH } from './constants';
import FoodRecordModel from './models/foodRecord';
import { FavouriteFood, FoodRecord } from './types';
import {
  createNewFoodRecord,
  formatFavouriteFoodForDisplay,
  formatFoodStoreForDisplay,
  getUserFaveFood,
} from './utils';

bot.command('food', (ctx) => {
  ctx.reply(
    'What would you like to do?\n' +
      '\nGeneral\n' +
      "1. Can't decide what to eat? /whatfood\n" +
      '2. I need more detailed help with food functions /foodhelp\n' +
      '\nFood Store Management\n' +
      '1. Add new food store to list /addfoodstore\n' +
      '2. List all the food store in the list /listfoodstore\n' +
      '3. Delete food store from list /deletefoodstore\n' +
      '\nFood Favourites Management\n' +
      '1. Add new favourite food order /addfavefood\n' +
      '2. List all your added favourites! /listfavefood\n',
  );
});

/**
 * GENERAL COMMANDS
 */
bot.command('whatfood', async (ctx) => {
  const chatId = ctx.message.chat.id;
  try {
    const foodRecords = await FoodRecordModel.find({ chatId });
    if (foodRecords.length === 0) {
      ctx.reply('Add one of your favourite food stores with /addfoodstore command first!');
      return;
    }
    const randomFoodRecord = foodRecords[getRandomInt(foodRecords.length)];
    ctx.reply(`How about having some ${randomFoodRecord.foodStore} today?`);
  } catch (err) {
    console.error(`Failed to get random food store for chat ${chatId}. ` + err.message);
    ctx.reply('Something is wrong! Family bot failed to give food suggestion. Sorry!');
  }
});

bot.command('foodhelp', (ctx) => {
  ctx.reply(
    'Let Family Bot explain how the food function works! It works similarly to the boba functions!\n' +
      '\nThe first thing to do is to first add your favourite food stores to the list using /addfoodstore The food store list is shared among all users!\n' +
      '\nOnce there are food stores added to the list, there are more things we can do:\n' +
      "1. Can't decide what to eat today? /whatfood\n" +
      '2. Want to see which food stores you have added to the list? /listfoodstore\n' +
      '3. Have a food store you dislike in the list? Delete it with /deletefoodstore\n' +
      "\nFamily Bot is also capable of keeping track of everyone's favourite orders!\n" +
      '1. Add a favourite food order! /addfavefood\n' +
      '2. List all your added favourites for viewing/delete! /listfavefood\n' +
      "\nOnce everyone has started adding their favourites, you can view everyone's favourites by store with the command shown after you use /listfoodstore\n",
  );
});

/**
 * FOOD STORE RELATED COMMANDS
 */
bot.hears(/\/addfoodstore (.+)/, async (ctx) => {
  const chatId = ctx.message.chat.id;
  const foodStore = ctx.match[1].trim().toLowerCase();

  if (foodStore.length > MAX_FOOD_STORE_LENGTH) {
    ctx.reply(
      `Sorry! Food store cannot exceed text length of ${MAX_FOOD_STORE_LENGTH} characters!`,
    );
    return;
  }

  try {
    const foodRecord = await FoodRecordModel.findOne({ chatId, foodStore });
    if (foodRecord) {
      ctx.reply('Food store you are trying to add already exists in the list!');
      return;
    }

    await createNewFoodRecord({
      chatId,
      foodStore,
    });
    ctx.reply('New food store successfully added to the list!');
  } catch (err) {
    console.error(`Failed to add new food store for chat ${chatId}. ` + err.message);
    ctx.reply('Failed to add new food store to the list. Sorry!');
  }
});

bot.command('addfoodstore', (ctx) => {
  ctx.reply(
    'Add new food store by using the following format \n' +
      '/addfoodstore {food store} \n' +
      'e.g. /addfoodstore mcdonalds',
  );
});

bot.command('listfoodstore', async (ctx) => {
  const chatId = ctx.message.chat.id;
  let response = 'List of food stores\n';
  try {
    const foodRecords = await FoodRecordModel.find({ chatId });
    if (foodRecords.length === 0) {
      ctx.reply('No food stores added to the list!');
      return;
    }
    foodRecords.forEach((foodRecord: FoodRecord, index: number) => {
      response += `${index + 1}. ${formatFoodStoreForDisplay(foodRecord, true)}\n`;
    });
    ctx.reply(response);
  } catch (err) {
    console.error(`Failed to retrieve food store list for chat ${chatId}. ` + err.message);
    ctx.reply('Failed to list food stores. Family Bot is sorry!');
  }
});

bot.hears(/\/deletefoodstore(.+)$/, async (ctx) => {
  const foodRecordId = ctx.match[1];
  try {
    const foodRecord = await FoodRecordModel.findByIdAndDelete(foodRecordId);
    if (!foodRecord) {
      throw new Error('Unable to find food record');
    }
    ctx.reply('Food store record successfully deleted by family bot!');
  } catch (err) {
    console.error('Error while deleting food record. ' + err.message);
    ctx.reply('Failed to delete food store record. Sorry!');
  }
});

bot.command('deletefoodstore', async (ctx) => {
  const chatId = ctx.message.chat.id;
  let response =
    "Which food store do you want to delete? Note that this will also delete all users' saved favourites from this store\n";
  try {
    const foodRecords = await FoodRecordModel.find({ chatId });
    if (foodRecords.length === 0) {
      ctx.reply('No food stores added to the list!');
      return;
    }
    foodRecords.forEach((foodRecord: FoodRecord, index: number) => {
      response += `${index + 1}. ${formatFoodStoreForDisplay(foodRecord, false, true)}\n`;
    });
    ctx.reply(response);
  } catch (err) {
    console.error(
      `Failed to retrieve food store list for chat ${chatId} for deletion. ` + err.message,
    );
    ctx.reply('Failed to list food stores for deletion. Family Bot is sorry!');
  }
});

/**
 * FAVE FOOD RELATED COMMANDS
 */
bot.hears(/\/addfavefood(.*)/, async (ctx) => {
  const chatId = ctx.message.chat.id;
  const faveOrder = ctx.match[1].trim();

  try {
    const foodRecords = await FoodRecordModel.find({ chatId });
    if (foodRecords.length === 0) {
      ctx.reply(
        'Someone needs to add a food store to the list first before you can add a favourite!',
      );
      return;
    }

    if (!faveOrder) {
      ctx.reply(
        'Add your fave food order using the following format. you can indicate the food store later on! \n' +
          '/addfoodfave {fave food order} \n' +
          'e.g. /addfoodfave double mcspicy meal, upsized, ice lemon tea. plus oreo mcflurry',
      );
      return;
    }

    if (faveOrder.length > MAX_FAVE_ORDER_LENGTH) {
      ctx.reply(
        `Sorry! Food fave order cannot exceed text length of ${MAX_FAVE_ORDER_LENGTH} characters!`,
      );
      return;
    }

    const messageId = ctx.message.message_id;
    const CACHE_TIMEOUT_IN_SEC = 30;
    setItemInCache(chatId, messageId, faveOrder, CACHE_TIMEOUT_IN_SEC);

    ctx.reply('Which food store is this from?', {
      reply_markup: {
        inline_keyboard: foodRecords.map((record: FoodRecord) => [
          {
            text: record.foodStore,
            callback_data: encodeCallbackData(
              DataType.FOOD_STORE,
              record._id.toString(),
              messageId,
            ),
          },
        ]),
      },
    });
  } catch (err) {
    console.error(
      `Failed to fetch food records while adding fave food for chat ${chatId}. ` + err.message,
    );
    ctx.reply('Failed to check if there are existing food store records. Family Bot is sorry!');
  }
});

bot.command('listfavefood', async (ctx) => {
  const chatId = ctx.message.chat.id;
  const userId = ctx.message.from.id;
  const username = ctx.message.from.username;
  let response = `List of favourites${username ? ` for ${username}` : ''}\n`;
  try {
    const faveOrders: FavouriteFood[] = await getUserFaveFood(chatId, userId);
    if (faveOrders.length === 0) {
      ctx.reply('No favourite orders added yet so far!');
      return;
    }
    faveOrders.forEach((record: FavouriteFood, index: number) => {
      response += `${index + 1}. ${formatFavouriteFoodForDisplay(record, true)}\n`;
    });
    ctx.reply(response);
  } catch (err) {
    console.error(
      `Failed to retrieve fave food list for chat ${chatId} for user ${userId}. ` + err.message,
    );
    ctx.reply('Failed to retrieve your favourites! Sorry!');
  }
});

bot.hears(/\/deletefavefood(.*)$/, async (ctx) => {
  const foodRecordId = ctx.match[1];
  const userId = ctx.message.from.id.toString();
  try {
    const foodRecord = await FoodRecordModel.findById(foodRecordId);
    if (!foodRecord) {
      ctx.reply("Family bot can't find the food store record you are looking for!");
      return;
    }
    if (!foodRecord.favouriteOrders || !foodRecord.favouriteOrders.get(userId)) {
      ctx.reply(`No favourite order added for ${foodRecord.foodStore}!`);
      return;
    }
    foodRecord.favouriteOrders.delete(userId);
    await foodRecord.save();
    ctx.reply('Favourite order successfully deleted by family bot!');
  } catch (err) {
    console.error("Error while deleting user's fave order from food record. " + err.message);
    ctx.reply('Failed to delete your favourite order. Sorry!');
  }
});

bot.hears(/\/listfavefoodstore(.*)$/, async (ctx) => {
  const foodRecordId = ctx.match[1];
  try {
    const foodRecord = await FoodRecordModel.findById(foodRecordId);
    if (!foodRecord) {
      ctx.reply("Family bot can't find the food store record you are looking for!");
      return;
    }
    if (!foodRecord.favouriteOrders) {
      ctx.reply(`No favourites added for ${foodRecord.foodStore} yet!`);
      return;
    }
    let response = `List of favourites for ${foodRecord.foodStore}\n`;
    for (const [userId, faveOrder] of foodRecord.favouriteOrders.entries()) {
      const { user } = await ctx.getChatMember(Number(userId));
      response += `${user.username ? `@${user.username}` : 'Missing user name'} | ${faveOrder}\n`;
    }
    ctx.reply(response);
  } catch (err) {
    console.error('Error while listing fave orders from food record. ' + err.message);
    ctx.reply("Failed to retrieve everyone's favourites...Sorry!");
  }
});
