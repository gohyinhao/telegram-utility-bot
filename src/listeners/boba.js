import bot from '../bot.js';
import { getRandomInt } from '../utils/index.js';

const bobaOptions = ['Bober', 'KOI', 'R&B', 'LiHo'];

export default () => {
  bot.hears(/\/(boba)|(bbt)/, (ctx) => {
    const response = `How about having some ${
      bobaOptions[getRandomInt(bobaOptions.length)]
    } today?`;
    ctx.reply(response);
  });
};
