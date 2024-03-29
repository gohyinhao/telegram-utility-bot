import mongoose from 'mongoose';
import { BusStop } from '../types';

const BusStopSchema = new mongoose.Schema({
  BusStopCode: {
    type: String,
    required: true,
    unique: true,
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
});

const BusStopModel = mongoose.model<BusStop>('BusStop', BusStopSchema);

export default BusStopModel;
