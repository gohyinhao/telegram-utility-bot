import bot from '../../bot';
import { formatTime } from '../../utils';
import { get24HrWeatherForecast, getRainAreaImage, get240kmRainAreaImage } from './api';

bot.command('weather', (ctx) => {
  ctx.reply(
    'What would you like to do?\n' +
      '1. Check weather forecast /checkweather\n' +
      '2. Check rain area forecast /checkrain\n' +
      '3. Check 240km range rain area forecast /checkrain240\n',
  );
});

bot.command('checkweather', async (ctx) => {
  ctx.replyWithChatAction('typing');
  try {
    const result = await get24HrWeatherForecast();

    let response = 'Weather forecast\n';

    const { low: minTemp, high: maxTemp } = result.items[0].general.temperature;
    response += `Temperature: ${minTemp}-${maxTemp}\xB0C\n`;

    result.items[0].periods.forEach((period: any) => {
      const { start, end } = period.time;
      const periodStartTime = formatTime(new Date(start).valueOf());
      const periodEndTime = formatTime(new Date(end).valueOf());
      response += `\n${periodStartTime} - ${periodEndTime}\n`;
      Object.keys(period.regions).forEach((key: string) => {
        response += `${key}: ${period.regions[key]}\n`;
      });
    });
    ctx.reply(response);
  } catch (err) {
    console.error('Failed to retrieve 24hr weather forecast. ' + err.message);
    ctx.reply('Failed to get weather forecast...');
  }
});

bot.command('checkrain', async (ctx) => {
  ctx.replyWithChatAction('upload_photo');
  try {
    const { image, timestamp } = await getRainAreaImage();
    ctx.replyWithPhoto(
      { source: image },
      { caption: `Latest rain areas as at ${formatTime(timestamp)}` },
    );
  } catch (err) {
    console.error('Failed to retrieve rain area forecast. ' + err.message);
    ctx.reply('Failed to get rain area forecast...');
  }
});

bot.command('checkrain240', async (ctx) => {
  ctx.replyWithChatAction('upload_photo');
  try {
    const { image, timestamp } = await get240kmRainAreaImage();
    ctx.replyWithPhoto(
      { source: image },
      { caption: `Latest 240km range rain areas as at ${formatTime(timestamp)}` },
    );
  } catch (err) {
    console.error('Failed to retrieve 240km rain area forecast. ' + err.message);
    ctx.reply('Failed to get 240km range rain area forecast...');
  }
});
