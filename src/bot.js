require('dotenv').config();
const { Telegraf } = require('telegraf');
const schedule = require('./scheduler');

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
  bot.stop('SIGINT');
});
process.once('SIGTERM', async () => {
  await schedule.gracefulShutdown();
  bot.stop('SIGTERM');
});

module.exports = bot;
