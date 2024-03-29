import mongoose from 'mongoose';
import { CarInfo, parkingLocations } from '../types';

const CarInfoSchema = new mongoose.Schema(
  {
    chatId: {
      type: Number,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      enum: parkingLocations,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<CarInfo>('CarInfo', CarInfoSchema);
