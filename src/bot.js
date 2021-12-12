require('dotenv').config();
const { Telegraf } = require('telegraf');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(token);

bot.start((ctx) => ctx.reply('Hello, I am the Goh Family Bot!'));
bot.hears('hi', (ctx) => ctx.reply('hey baby'));
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;
