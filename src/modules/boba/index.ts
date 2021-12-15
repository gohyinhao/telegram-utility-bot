import bot from '../../bot';
import { getRandomInt } from '../../utils/index';

const bobaOptions = ['Bober', 'KOI', 'R&B', 'LiHo'];

bot.hears(/\/(boba)|(bbt)/, (ctx) => {
  const response = `How about having some ${bobaOptions[getRandomInt(bobaOptions.length)]} today?`;
  ctx.reply(response);
});
