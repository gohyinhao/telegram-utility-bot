const bot = require('../../bot');
const { getRandomInt } = require('../../utils/index');

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

bot.command('rubbish', (ctx) => {
  const response = `The person who should throw rubbish is ${
    rubbishThrowerOptions[getRandomInt(rubbishThrowerOptions.length)]
  }`;
  ctx.reply(response);
});
