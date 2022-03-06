import mongoose from 'mongoose';
import { UserBusConfig } from '../types';
import { MAX_NUM_FAVE_BUS_STOP } from '../utils';

const UserBusConfigSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    faveBusStopCodes: {
      type: [String],
      default: [],
      maxLength: MAX_NUM_FAVE_BUS_STOP,
    },
  },
  { timestamps: true, toObject: { virtuals: true } },
);

UserBusConfigSchema.virtual('faveBusStops', {
  ref: 'BusStop',
  localField: 'faveBusStopCodes',
  foreignField: 'BusStopCode',
});

const UserBusConfigModel = mongoose.model<UserBusConfig>('UserBusConfig', UserBusConfigSchema);

export default UserBusConfigModel;
