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
      '2. Fisi-related help. /fisi\n' +
      '3. What boba should we get? /boba\n' +
      "4. What's for lunch? /lunch\n" +
      '5. Who to throw the rubbish?! /rubbish\n' +
      '6. Reminder-related help. /reminder\n' +
      '\nTo hear about upcoming features, /futurefeatures',
  );
});

bot.command('futurefeatures', (ctx) => {
  ctx.reply(
    'List of upcoming features planned!\n' +
      '- Delete reminder function\n' +
      '- Boba favourites to list your fave boba, so others can check and easily purchase for you\n' +
      '- Weather forecast function\n' +
      '- Map function, maybe\n' +
      '- Bus waiting time function, maybe\n' +
      '- Improvement to lunch and boba functions\n',
  );
});
