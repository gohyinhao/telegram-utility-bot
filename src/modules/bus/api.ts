import fetch, { Headers, RequestInfo, RequestInit } from 'node-fetch';
import { BusArrivalInfo, BusStop } from './types';
import queryString from 'query-string';

const LTA_DATA_DOMAIN = 'http://datamall2.mytransport.sg/ltaodataservice';
// subject to change based on LTA
const LTA_QUERY_LIMIT = 500;

// append neccessary api token for LTA DataMall API
export const ltaQueryFetchWrapper = (url: RequestInfo, init?: RequestInit) => {
  return fetch(url, {
    headers: new Headers([['AccountKey', process.env.LTA_API_KEY || '']]),
    ...init,
  });
};

export const getBusStopInfo = async (offset = 0): Promise<BusStop[]> => {
  const response = await ltaQueryFetchWrapper(`${LTA_DATA_DOMAIN}/BusStops?$skip=${offset}`);

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

export const getBusArrivalInfo = async (
  busStopCode: string,
  serviceNum?: string,
): Promise<BusArrivalInfo[]> => {
  const params = {
    BusStopCode: busStopCode,
    ServiceNo: serviceNum,
  };
  const response = await ltaQueryFetchWrapper(
    `${LTA_DATA_DOMAIN}/BusArrivalv2?${queryString.stringify(params)}`,
  );

  if (!response.ok) {
    console.log(response);
    throw new Error('Failed to retrieve bus arrival info');
  }

  const data = await response.json();
  return data.Services;
};
