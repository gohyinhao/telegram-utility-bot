require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
// const token = process.env.TELEGRAM_TEST_ENV_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on('polling_error', console.log);

module.exports = bot;
