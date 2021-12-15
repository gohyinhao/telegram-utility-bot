import { Context } from 'telegraf';
import CarInfoModel from './models/carInfo';
import { ParkingLocation } from './types';

export const handleParkingInfoCallbackQuery = async (
  ctx: Context,
  chatId: number,
  parkedLocation: ParkingLocation,
) => {
  try {
    const carInfo = await CarInfoModel.findOne({ chatId });
    if (!carInfo) {
      const newCarInfo = new CarInfoModel({ chatId, location: parkedLocation });
      await newCarInfo.save();
    } else {
      carInfo.location = parkedLocation;
      await carInfo.save();
    }
    ctx.reply(`Car location of ${parkedLocation} is saved.`);
    ctx.answerCbQuery();
  } catch (err) {
    ctx.answerCbQuery('Failed to save new parked location.');
  }
};
