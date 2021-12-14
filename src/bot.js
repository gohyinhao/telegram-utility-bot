import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { schedule, toadScheduler } from './scheduler.js';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://telegram-utility-bot.herokuapp.com/';

const bot = new Telegraf(BOT_TOKEN);
bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
bot.startWebhook(`/bot${BOT_TOKEN}`, null, PORT);

bot.start((ctx) => ctx.reply('Hello, I am the Goh Family Bot!'));
bot.launch();

// Enable graceful stop
process.once('SIGINT', async () => {
  await schedule.gracefulShutdown();
  toadScheduler.stop();
  bot.stop('SIGINT');
});
process.once('SIGTERM', async () => {
  await schedule.gracefulShutdown();
  toadScheduler.stop();
  bot.stop('SIGTERM');
});

export default bot;
