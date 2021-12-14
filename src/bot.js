import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { schedule, toadScheduler } from './scheduler.js';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(token);

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
