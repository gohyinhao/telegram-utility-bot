import moment from 'moment';
import { DataType } from '../types';

export const getRandomInt = (max: number, min = 0): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

const DELIMITER = String.fromCharCode(31);

export const encodeCallbackData = (type: DataType, ...data: (string | number)[]): string => {
  return type + DELIMITER + data.join(DELIMITER);
};

export const parseCallbackData = (dataStr: string): string[] => {
  return dataStr.split(DELIMITER);
};

export const formatTime = (timestamp: number): string => {
  return moment(timestamp).format('ddd, D MMM YY, HH:mm');
};
