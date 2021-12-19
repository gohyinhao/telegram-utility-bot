import { ObjectId } from 'mongoose';

export interface RubbishRecord {
  _id: ObjectId;
  chatId: number;
  options: string[];
  createdAt: Date;
  updatedAt: Date;
}
