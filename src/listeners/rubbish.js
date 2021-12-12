import bot from '../bot.js';
import { getRandomInt } from '../utils/index.js';

const rubbishThrowerOptions = [
  'JJB',
  'JJB',
  'JJB',
  'JJB',
  'meh...just throw tomorrow...',
  'meh...mother go throw please',
  'Fisi but wait...which fisi...?',
  'Fisi-chan other self',
];

export default () => {
  bot.command('rubbish', (ctx) => {
    const response = `The person who should throw rubbish is ${
      rubbishThrowerOptions[getRandomInt(rubbishThrowerOptions.length)]
    }`;
    ctx.reply(response);
  });
};
