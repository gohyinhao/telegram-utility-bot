import { Types, ObjectId } from 'mongoose';

export interface FoodRecord {
  _id: ObjectId;
  chatId: number;
  foodStore: string;
  favouriteOrders?: Types.Map<string>;
  createdAt: Date;
  updatedAt: Date;
}

export type FavouriteFood = [foodRecordId: string, foodStore: string, faveOrder: string];
