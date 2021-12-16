import { ObjectId } from 'mongoose';

export interface BobaRecord {
  _id: ObjectId;
  chatId: number;
  userId: number;
  username: string;
  bobaStore: string;
  favouriteOrder?: string;
  createdAt: Date;
  updatedAt: Date;
}
