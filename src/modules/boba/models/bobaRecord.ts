import mongoose from 'mongoose';
import { MAX_BOBA_FAVE_LENGTH, MAX_BOBA_STORE_LENGTH } from '../constants';
import { BobaRecord } from '../types';

const bobaRecordSchema = new mongoose.Schema(
  {
    chatId: {
      type: Number,
      required: true,
      unique: true,
    },
    bobaStore: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minlength: 1,
      maxlength: MAX_BOBA_STORE_LENGTH,
    },
    favouriteOrders: {
      // key is user id, value is user's fave boba for this store
      type: Map,
      of: {
        type: String,
        trim: true,
        minLength: 1,
        maxlength: MAX_BOBA_FAVE_LENGTH,
      },
    },
  },
  {
    timestamps: true,
  },
);

const BobaRecordModel = mongoose.model<BobaRecord>('BobaRecord', bobaRecordSchema);

export default BobaRecordModel;
