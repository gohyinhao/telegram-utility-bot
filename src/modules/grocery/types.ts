import { ObjectId } from 'mongoose';

export interface GroceryList {
  _id: ObjectId;
  chatId: number;
  items: string[];
  createdAt: Date;
  updatedAt: Date;
}
