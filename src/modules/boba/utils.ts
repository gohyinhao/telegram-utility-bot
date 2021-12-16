import { OmitDbFields } from 'src/types';
import BobaRecordModel from './models/bobaRecord';
import { BobaRecord } from './types';

export const createNewBobaRecord = async (bobaFields: OmitDbFields<BobaRecord>) => {
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
