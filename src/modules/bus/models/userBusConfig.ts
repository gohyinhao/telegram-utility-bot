import mongoose from 'mongoose';
import { UserBusConfig } from '../types';
import { MAX_NUM_FAVE_BUS_STOP } from '../utils';

const userBusConfigSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  faveBusStopIds: {
    type: [String],
    default: [],
    maxLength: MAX_NUM_FAVE_BUS_STOP,
  },
});

const UserBusConfigModel = mongoose.model<UserBusConfig>('UserBusConfig', userBusConfigSchema);

export default UserBusConfigModel;
