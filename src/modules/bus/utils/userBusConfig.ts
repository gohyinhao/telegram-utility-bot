import { DataType, OmitDbFields } from '../../../types';
import { encodeCallbackData } from '../../../utils';
import { Context } from 'telegraf';
import { formatBusStopInfoForDisplay } from '.';
import BusStopModel from '../models/busStop';
import UserBusConfigModel from '../models/userBusConfig';
import { BusStop, UserBusConfig } from '../types';

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
      await createNewUserBusConfig({ userId, faveBusStopCodes: [busStopCode] });
      ctx.reply(
        `${formatBusStopInfoForDisplay(busStopInfo)} successfully added to favourites list!`,
      );
      return;
    }

    if (userBusConfig.faveBusStopCodes.includes(busStopCode)) {
      ctx.reply(
        `${formatBusStopInfoForDisplay(busStopInfo)} already exists in your favourites list!`,
      );
      return;
    } else if (userBusConfig.faveBusStopCodes.length + 1 > MAX_NUM_FAVE_BUS_STOP) {
      ctx.reply(
        `Max number of allowed favourites is ${MAX_NUM_FAVE_BUS_STOP}. Please delete one of your existing favourites first.`,
      );
      return;
    } else {
      userBusConfig.faveBusStopCodes = userBusConfig.faveBusStopCodes.concat([busStopCode]);
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

export const getFaveBusStopMarkupList = (busStops: BusStop[]) => {
  return busStops.map((info: BusStop) => [
    {
      text: `${info.RoadName}, ${info.Description} (${info.BusStopCode})`,
      callback_data: encodeCallbackData(DataType.BUS_STOP_SEARCH, info.BusStopCode),
    },
  ]);
};
