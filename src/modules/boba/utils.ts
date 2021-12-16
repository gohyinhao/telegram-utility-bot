import { OmitDbFields } from 'src/types';
import BobaRecordModel from './models/bobaRecord';
import { BobaRecord } from './types';

// have to omit favouriteOrders because mongoose allows passing of object or map for creation but their typings do not support this
export const createNewBobaRecord = async (
  bobaFields: Omit<OmitDbFields<BobaRecord>, 'favouriteOrders'> & {
    favouriteOrders?: Map<string | number, string> | Record<string | number, string>;
  },
) => {
  const newBobaRecord = new BobaRecordModel(bobaFields);
  return await newBobaRecord.save();
};

export const formatBobaStoreForDisplay = (record: BobaRecord, addDeleteCommand = false): string => {
  const { _id, bobaStore } = record;
  let result = bobaStore;
  if (addDeleteCommand) {
    result += ` /deletebobastore${_id.toString()}`;
  }
  return result;
};
