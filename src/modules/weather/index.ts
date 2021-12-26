import bot from '../../bot';
import { formatTime } from '../../utils';
import { get24HrWeatherForecast } from './api';

bot.command('weather', (ctx) => {
  ctx.reply('What would you like to do?\n' + '1. Check weather forecast /checkweather\n');
});

bot.command('checkweather', async (ctx) => {
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
