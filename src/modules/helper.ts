import bot from '../bot';

bot.hears(/\/echo (.+)/, (ctx) => {
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  ctx.reply(ctx.match[1]);
});

bot.help((ctx) => {
  ctx.reply(
    'What can Family Bot help you with?\n' +
      '1. Car-related help. /car\n' +
      '2. Reminder-related help. /reminder\n' +
      '3. Boba-related help. /boba\n' +
      '4. Food-related help /food\n' +
      '5. Who to throw the rubbish?! /rubbish\n' +
      '\nTo hear about upcoming features, /futurefeatures',
  );
});

bot.command('futurefeatures', (ctx) => {
  ctx.reply(
    'List of upcoming features planned!\n' +
      '- Weather forecast function\n' +
      '- Map function, maybe\n' +
      '- Bus waiting time function, maybe\n' +
      '- Improvement to rubbish function\n' +
      '- Grocery list function\n',
  );
});
