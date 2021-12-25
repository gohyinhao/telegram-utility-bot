import bot from '../../bot';
import { MAX_GROCERY_ITEM_LENGTH } from './constants';
import GroceryListModel from './models/groceryRecord';

bot.command('grocery', (ctx) => {
  ctx.reply(
    'What would you like to do?\n' +
      '1. Add grocery item /addgrocery\n' +
      '2. List grocery list /listgrocery\n' +
      '3. Clear grocery list /cleargrocery\n',
  );
});

bot.hears(/\/addgrocery (.+)/, async (ctx) => {
  const chatId = ctx.message.chat.id;
  const groceryItem = ctx.match[1].trim();

  if (groceryItem.length > MAX_GROCERY_ITEM_LENGTH) {
    ctx.reply(`Sorry! Please limit grocery item text length to ${groceryItem}!`);
    return;
  }

  try {
    const groceryList = await GroceryListModel.findOne({ chatId });
    if (groceryList) {
      if (groceryList.items.includes(groceryItem)) {
        ctx.reply('Item already exists in your grocery list!');
        return;
      }
      groceryList.items = groceryList.items.concat([groceryItem]);
      await groceryList.save();
    } else {
      const newGroceryList = new GroceryListModel({ chatId, items: [groceryItem] });
      await newGroceryList.save();
    }
    ctx.reply('Item added to grocery list!');
  } catch (err) {
    console.error(`Failed to add grocery item for chat ${chatId}. ` + err.message);
    ctx.reply('Failed to add item to grocery list...Sorry!');
  }
});

bot.command('addgrocery', (ctx) => {
  ctx.reply(
    'Add an item to your grocery list by using the following command \n' +
      '/addgrocery {item} \n' +
      'e.g. /addgrocery milk',
  );
});

bot.command('listgrocery', async (ctx) => {
  const chatId = ctx.message.chat.id;
  try {
    const groceryRecord = await GroceryListModel.findOne({ chatId });
    if (!groceryRecord || groceryRecord.items.length === 0) {
      ctx.reply('Add an item to your grocery list with /addgrocery command first!');
      return;
    }

    let response = 'Current Grocery List\n';
    groceryRecord.items.forEach((item: string, index: number) => {
      response += `${index + 1}. ${item}\n`;
    });
    ctx.reply(response);
  } catch (err) {
    console.error(`Failed to display grocery list for chat ${chatId}. ` + err.message);
    ctx.reply('Sorry! Family bot failed to retrieve your grocery list!');
  }
});

bot.command('cleargrocery', async (ctx) => {
  const chatId = ctx.message.chat.id;
  try {
    const groceryRecord = await GroceryListModel.findOne({ chatId });
    if (!groceryRecord || groceryRecord.items.length === 0) {
      ctx.reply('No items in your grocery list! Nothing to clear!');
      return;
    }
    groceryRecord.items = [];
    await groceryRecord.save();
    ctx.reply('Grocery list cleared!');
  } catch (err) {
    console.error(`Failed to clear grocery list for chat ${chatId}. ` + err.message);
    ctx.reply('Something went wrong! Failed to clear your grocery list :(');
  }
});
