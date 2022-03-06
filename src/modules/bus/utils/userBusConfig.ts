import { OmitDbFields } from 'src/types';
import { Context } from 'telegraf';
import { formatBusStopInfoForDisplay } from '.';
import BusStopModel from '../models/busStop';
import UserBusConfigModel from '../models/userBusConfig';
import { UserBusConfig } from '../types';

export const MAX_NUM_FAVE_BUS_STOP = 10;

export const createNewUserBusConfig = async (configFields: OmitDbFields<UserBusConfig>) => {
  const newUserConfig = new UserBusConfigModel(configFields);
  return await newUserConfig.save();
};

// util method to add new bus stop to user's fave bus stop list
// assumes bus stop code is already validated
export const addNewFaveBusStopToConfig = async (
  ctx: Context,
  userId: number,
  busStopCode: string,
) => {
  try {
    const busStopInfo = await BusStopModel.findOne({ BusStopCode: busStopCode });
    if (!busStopInfo) {
      ctx.reply(
        'Invalid bus stop number. Please check that you input the correct bus stop number.',
      );
      return;
    }

    const userBusConfig = await UserBusConfigModel.findOne({ userId });

    if (!userBusConfig) {
      // new user config
      await createNewUserBusConfig({ userId, faveBusStopIds: [busStopCode] });
      ctx.reply(
        `${formatBusStopInfoForDisplay(busStopInfo)} successfully added to favourites list!`,
      );
      return;
    }

    if (userBusConfig.faveBusStopIds.includes(busStopCode)) {
      ctx.reply(
        `${formatBusStopInfoForDisplay(busStopInfo)} already exists in your favourites list!`,
      );
      return;
    } else if (userBusConfig.faveBusStopIds.length + 1 > MAX_NUM_FAVE_BUS_STOP) {
      ctx.reply(
        `Max number of allowed favourites is ${MAX_NUM_FAVE_BUS_STOP}. Please delete one of your existing favourites first.`,
      );
      return;
    } else {
      userBusConfig.faveBusStopIds = userBusConfig.faveBusStopIds.concat([busStopCode]);
      await userBusConfig.save();
      ctx.reply(
        `${formatBusStopInfoForDisplay(busStopInfo)} successfully added to favourites list!`,
      );
    }
  } catch (err) {
    console.error(`Failed to add new fave bus stop for user ${userId}. ` + err.message);
    ctx.reply('Failed to add new bus stop to your favourite list. Sorry!');
  }
};
