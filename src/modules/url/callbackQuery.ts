import { Context } from 'telegraf';
import UrlListModel from './models/urlListRecord';
import { UrlObject } from './types';
import { getUrlMarkupList } from './utils';

export const handleDeleteUrlPaginateCbQuery = async (
  ctx: Context,
  chatId: number,
  offset: number,
) => {
  try {
    const urlList = await UrlListModel.findOne({ chatId }).exec();
    if (!urlList) {
      throw new Error('Failed to find URL List info');
    }
    ctx.reply('Which URL do you want to delete?', {
      reply_markup: {
        inline_keyboard: getUrlMarkupList(urlList.items, offset),
      },
    });
  } catch (err) {
    console.error(
      `Failed to handle delete URL paginate cb query for chat ${chatId}. ` + err.message,
    );
    ctx.reply('Sorry! Family Bot is unable to retrieve URL List!');
  }
  ctx.answerCbQuery();
};

export const handleDeleteUrlCbQuery = async (ctx: Context, chatId: number, urlObjId: string) => {
  try {
    const urlList = await UrlListModel.findOne({ chatId }).exec();
    if (!urlList) {
      throw new Error('Failed to find URL List info');
    }
    urlList.items = urlList.items.filter((record: UrlObject) => record._id.toString() !== urlObjId);
    await urlList.save();
    ctx.reply('Successfully deleted URL!');
  } catch (err) {
    console.error(`Failed to handle delete URL cb query for chat ${chatId}. ` + err.message);
    ctx.reply('Sorry! Family Bot failed to delete specified URL!');
  }
  ctx.answerCbQuery();
};
