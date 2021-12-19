import { OmitDbFields } from 'src/types';
import FoodRecordModel from './models/foodRecord';
import { FavouriteFood, FoodRecord } from './types';

// have to omit favouriteOrders because mongoose allows passing of object or map for creation but their typings do not support this
export const createNewFoodRecord = async (
  fields: Omit<OmitDbFields<FoodRecord>, 'favouriteOrders'> & {
    favouriteOrders?: Map<string | number, string> | Record<string | number, string>;
  },
) => {
  const newFoodRecord = new FoodRecordModel(fields);
  return await newFoodRecord.save();
};

export const formatFoodStoreForDisplay = (
  record: FoodRecord,
  addListFaveCommand = false,
  addDeleteCommand = false,
): string => {
  const { _id, foodStore } = record;
  let result = foodStore;
  if (addListFaveCommand) {
    result += ` /listfavefoodstore${_id.toString()}`;
  }
  if (addDeleteCommand) {
    result += ` /deletefoodstore${_id.toString()}`;
  }
  return result;
};

export const formatFavouriteFoodForDisplay = (
  record: FavouriteFood,
  addDeleteCommand = false,
): string => {
  const [foodRecordId, foodStore, faveOrder] = record;
  let result = `${foodStore} | ${faveOrder}`;
  if (addDeleteCommand) {
    result += ` /deletefavefood${foodRecordId}`;
  }
  return result;
};

export const getUserFaveFood = async (chatId: number, userId: number): Promise<FavouriteFood[]> => {
  const result: FavouriteFood[] = [];
  const foodRecords = await FoodRecordModel.find({ chatId });
  foodRecords.forEach((record: FoodRecord) => {
    const faveOrder = record.favouriteOrders?.get(userId.toString());
    if (faveOrder) {
      result.push([record._id.toString(), record.foodStore, faveOrder]);
    }
  });
  return result;
};
