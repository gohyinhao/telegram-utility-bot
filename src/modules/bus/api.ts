import fetch, { Headers } from 'node-fetch';
import { BusStop } from './types';

const LTA_DATA_DOMAIN = 'http://datamall2.mytransport.sg/ltaodataservice';
// subject to change based on LTA
const LTA_QUERY_LIMIT = 500;

export const getBusStopInfo = async (offset = 0): Promise<BusStop[]> => {
  const response = await fetch(`${LTA_DATA_DOMAIN}/BusStops?$skip=${offset}`, {
    headers: new Headers([['AccountKey', process.env.LTA_API_KEY || '']]),
  });

  if (!response.ok) {
    throw new Error('Failed to retrieve bus stop info');
  }

  const data = await response.json();
  return data.value;
};

export const getAllBusStopInfo = async (): Promise<BusStop[]> => {
  let result: BusStop[] = [];

  let loopCount = 0;
  let busStopInfo: BusStop[] = [];
  do {
    busStopInfo = await getBusStopInfo(loopCount * LTA_QUERY_LIMIT);
    result = result.concat(busStopInfo);
    loopCount++;
  } while (busStopInfo.length !== 0);

  return result;
};
