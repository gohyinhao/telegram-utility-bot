import mongoose from 'mongoose';
import bot from '../../bot';
import { MAX_NUM_OF_URL, MAX_URL_DESC_LENGTH, MAX_URL_LENGTH } from './constants';
import UrlListModel from './models/urlListRecord';
import { UrlObject } from './types';
import { checkUrlExistInList, formatUrlObjectForDisplay, getUrlMarkupList } from './utils';

bot.command('url', (ctx) => {
  ctx.reply(
    'What would you like to do?\n' +
      '1. Add url to store /addurl\n' +
      '2. List url list /listurl\n' +
      '3. Delete specific stored url /deleteurl\n',
  );
});

bot.hears(/\/addurl (\S+) (.+)/, async (ctx) => {
  const chatId = ctx.message.chat.id;
  const url = ctx.match[1].trim();
  const description = ctx.match[2].trim();

  if (url.length > MAX_URL_LENGTH) {
    ctx.reply(`Sorry! URL length is capped at ${MAX_URL_LENGTH}!`);
    return;
  } else if (description.length > MAX_URL_DESC_LENGTH) {
    ctx.reply(`Sorry! URL description length is capped at ${MAX_URL_DESC_LENGTH}!`);
    return;
  }

  try {
    const newUrlObj: UrlObject = { _id: new mongoose.Types.ObjectId(), url, description };
    const urlList = await UrlListModel.findOne({ chatId }).exec();
    if (urlList) {
      if (checkUrlExistInList(url, urlList)) {
        ctx.reply('URL already exists in your list!');
        return;
      } else if (urlList.items.length > MAX_NUM_OF_URL) {
        ctx.reply(`Sorry! Number of stored URLs is capped at ${MAX_NUM_OF_URL}!`);
      }
      urlList.items = urlList.items.concat([newUrlObj]);
      await urlList.save();
    } else {
      const newUrlList = new UrlListModel({ chatId, items: [newUrlObj] });
      await newUrlList.save();
    }
    ctx.reply('New URL added to your list!');
  } catch (err) {
    console.error(`Failed to add URL for chat ${chatId}. ` + err.message);
    ctx.reply('Failed to add URL...Sorry!');
  }
});

bot.command('addurl', (ctx) => {
  ctx.reply(
    'Add url for Family Bot to store by using the following command \n' +
      '/addurl {url} {description} \n' +
      'e.g. /addurl www.myfavesite.com my favourite website',
  );
});

bot.command('listurl', async (ctx) => {
  const chatId = ctx.message.chat.id;
  try {
    const urlList = await UrlListModel.findOne({ chatId }).exec();
    if (!urlList || urlList.items.length === 0) {
      ctx.reply('Add a URL to your list with /addurl command first!');
      return;
    }

    let response = 'Current Stored URLs\n';
    urlList.items.forEach((item: UrlObject, index: number) => {
      response += `${index + 1}. ${formatUrlObjectForDisplay(item)}\n`;
    });
    ctx.reply(response);
  } catch (err) {
    console.error(`Failed to display URL list for chat ${chatId}. ` + err.message);
    ctx.reply('Sorry! Family bot failed to retrieve your URL list!');
  }
});

bot.command('deleteurl', async (ctx) => {
  const chatId = ctx.message.chat.id;
  try {
    const urlList = await UrlListModel.findOne({ chatId }).exec();
    if (!urlList || urlList.items.length === 0) {
      ctx.reply('No stored URLs! Nothing to delete!');
      return;
    }
    ctx.reply('Which URL do you want to delete?', {
      reply_markup: {
        inline_keyboard: getUrlMarkupList(urlList.items),
      },
    });
  } catch (err) {
    console.error(`Failed to show URL delete markup list for chat ${chatId}. ` + err.message);
    ctx.reply('Family Bot error! Sorry!');
  }
});
