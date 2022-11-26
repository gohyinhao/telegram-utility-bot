import { Telegraf } from 'telegraf';
import schedule from './scheduler';

import dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://telegram-utility-bot.herokuapp.com';

const bot = new Telegraf(BOT_TOKEN || '');
bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
// @ts-expect-error incorrect typing by Telegraf causing startWebhook method to be private
bot.startWebhook(`/bot${BOT_TOKEN}`, null, PORT);

bot.start((ctx) =>
  ctx.reply('Hello, I am the Goh Family Bot!\n' + 'Type /help for list of options!'),
);

// Enable graceful stop
process.once('SIGINT', async () => {
  // @ts-expect-error gracefulShutdown typing not added into node-schedule types library yet
  await schedule.gracefulShutdown();
  bot.stop('SIGINT');
});
process.once('SIGTERM', async () => {
  // @ts-expect-error gracefulShutdown typing not added into node-schedule types library yet
  await schedule.gracefulShutdown();
  bot.stop('SIGTERM');
});

export default bot;
