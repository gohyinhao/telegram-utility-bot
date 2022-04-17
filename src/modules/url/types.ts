import { ObjectId } from 'mongoose';

export interface UrlObject {
  url: string;
  description: string;
}

export interface UrlList {
  _id: ObjectId;
  chatId: number;
  items: UrlObject[];
  createdAt: Date;
  updatedAt: Date;
}
