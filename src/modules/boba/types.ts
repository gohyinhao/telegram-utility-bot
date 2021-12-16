import { Types, ObjectId } from 'mongoose';

export interface BobaRecord {
  _id: ObjectId;
  chatId: number;
  bobaStore: string;
  favouriteOrders?: Types.Map<string>;
  createdAt: Date;
  updatedAt: Date;
}
