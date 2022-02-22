import mongoose from 'mongoose';
import { BusStop } from '../types';

const busStopSchema = new mongoose.Schema(
  {
    BusStopCode: {
      type: String,
      required: true,
    },
    RoadName: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    Latitude: {
      type: Number,
      required: true,
    },
    Longitude: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const BusStopModel = mongoose.model<BusStop>('BusStop', busStopSchema);

export default BusStopModel;
