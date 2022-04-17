import mongoose from 'mongoose';
import { MAX_NUM_OF_URL, MAX_URL_DESC_LENGTH, MAX_URL_LENGTH } from '../constants';
import { UrlList } from '../types';

const UrlSchema = new mongoose.Schema({
  url: {
    type: String,
    trim: true,
    minlength: 1,
    maxlength: MAX_URL_LENGTH,
  },
  description: {
    type: String,
    trim: true,
    minlength: 1,
    maxlength: MAX_URL_DESC_LENGTH,
  },
});

const UrlListSchema = new mongoose.Schema(
  {
    chatId: {
      type: Number,
      required: true,
    },
    items: {
      type: [UrlSchema],
      maxlength: MAX_NUM_OF_URL,
    },
  },
  {
    timestamps: true,
  },
);

const UrlListModel = mongoose.model<UrlList>('UrlList', UrlListSchema);

export default UrlListModel;
