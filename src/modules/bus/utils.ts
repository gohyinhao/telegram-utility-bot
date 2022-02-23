import { BusInfo, BusArrivalInfo, BusStop } from './types';

export const getBusArrivalInMin = (info?: BusInfo): string | undefined => {
  if (!info || !info.EstimatedArrival) {
    return undefined;
  }
  const msToArrival = new Date(info.EstimatedArrival).valueOf() - Date.now();
  const minToArrival = Math.floor(msToArrival / 1000 / 60);
  return minToArrival <= 0 ? 'Arr' : `${minToArrival}min`;
};

export const formatBusArrivalInfoForDisplay = (info: BusArrivalInfo): string => {
  const firstBusArrival = getBusArrivalInMin(info.NextBus);
  const secondBusArrival = getBusArrivalInMin(info.NextBus2);
  const thirdBusArrival = getBusArrivalInMin(info.NextBus3);
  const hasNextBusTiming =
    firstBusArrival !== undefined ||
    secondBusArrival !== undefined ||
    thirdBusArrival !== undefined;

  let result = `${info.ServiceNo}: `;
  if (!hasNextBusTiming) {
    result += 'No Bus Arrival Timing Info';
  } else {
    result += [firstBusArrival, secondBusArrival, thirdBusArrival]
      .filter((value: string | undefined) => value !== undefined)
      .join(', ');
  }
  return result;
};

export const formatBusArrivalInfosForDisplay = (
  busStopCode: string,
  infos: BusArrivalInfo[],
  busStopInfo?: BusStop,
): string => {
  let result = `Bus Stop ${busStopCode}${
    busStopInfo ? ` - ${busStopInfo.RoadName}, ${busStopInfo.Description}` : ''
  }\n`;
  infos.forEach((info: BusArrivalInfo) => {
    result += formatBusArrivalInfoForDisplay(info) + '\n';
  });
  return result;
};
