import mongoose from 'mongoose';

export interface UrlObject {
  _id: mongoose.Types.ObjectId;
  url: string;
  description: string;
}

export interface UrlList {
  _id: mongoose.Types.ObjectId;
  chatId: number;
  items: UrlObject[];
  createdAt: Date;
  updatedAt: Date;
}
