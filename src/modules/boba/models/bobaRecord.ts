import mongoose from 'mongoose';
import { MAX_BOBA_FAVE_LENGTH, MAX_BOBA_STORE_LENGTH } from '../constants';
import { BobaRecord } from '../types';

const bobaRecordSchema = new mongoose.Schema(
  {
    chatId: {
      type: Number,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    bobaStore: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minlength: 1,
      maxlength: MAX_BOBA_STORE_LENGTH,
    },
    favouriteOrder: {
      type: String,
      trim: true,
      minLength: 1,
      maxlength: MAX_BOBA_FAVE_LENGTH,
    },
  },
  {
    timestamps: true,
  },
);

const BobaRecordModel = mongoose.model<BobaRecord>('BobaRecord', bobaRecordSchema);

export default BobaRecordModel;
