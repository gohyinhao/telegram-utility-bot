import mongoose from 'mongoose';
import { MAX_FAVE_ORDER_LENGTH, MAX_FOOD_STORE_LENGTH } from '../constants';
import { FoodRecord } from '../types';

const foodRecordSchema = new mongoose.Schema(
  {
    chatId: {
      type: Number,
      required: true,
    },
    foodStore: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minlength: 1,
      maxlength: MAX_FOOD_STORE_LENGTH,
    },
    favouriteOrders: {
      // key is user id, value is user's fave order for this store
      type: Map,
      of: {
        type: String,
        trim: true,
        minLength: 1,
        maxlength: MAX_FAVE_ORDER_LENGTH,
      },
    },
  },
  {
    timestamps: true,
  },
);

const FoodRecordModel = mongoose.model<FoodRecord>('FoodRecord', foodRecordSchema);

export default FoodRecordModel;
