import mongoose from 'mongoose';
import { MAX_RUBBISH_OPTION_LENGTH } from '../constants';
import { RubbishRecord } from '../types';

const rubbishRecordSchema = new mongoose.Schema(
  {
    chatId: {
      type: Number,
      required: true,
    },
    options: {
      type: [
        {
          type: String,
          trim: true,
          minlength: 1,
          maxlength: MAX_RUBBISH_OPTION_LENGTH,
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

const RubbishRecordModel = mongoose.model<RubbishRecord>('RubbishRecord', rubbishRecordSchema);

export default RubbishRecordModel;
