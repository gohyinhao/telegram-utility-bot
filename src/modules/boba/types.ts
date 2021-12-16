import { ObjectId } from 'mongoose';

export interface BobaRecord {
  _id: ObjectId;
  chatId: number;
  bobaStore: string;
  favouriteOrder?: Record<number, string>;
  createdAt: Date;
  updatedAt: Date;
}
