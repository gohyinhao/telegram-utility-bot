import { Context } from 'telegraf';
import { DataType } from '../../types';
import { encodeCallbackData } from '../../utils';
import { getBusArrivalInfo } from './api';
import BusStopModel from './models/busStop';
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

export const BUS_STOP_SEARCH_PAGE_LIMIT = 10;
export const BUS_STOP_CACHE_DURATION_IN_SEC = 300;

// map common words to short forms used in bus stop data from LTA
// key is normal word used, value is mapped value
const commonWordsToShortFormMap = {
  after: 'aft',
  avenue: 'ave',
  before: 'bef',
  between: 'bet',
  block: 'blk',
  boulevard: 'blvd',
  building: 'bldg',
  cathedral: 'cath',
  center: 'ctr',
  church: 'ch',
  complex: 'cplx',
  court: 'ct',
  drive: 'dr',
  'food court': 'fc',
  garden: 'gdn',
  gardens: 'gdns',
  house: 'hse',
  jalan: 'jln',
  library: 'lib',
  mosque: 'mque',
  national: 'natl',
  north: 'nth',
  opposite: 'opp',
  park: 'pk',
  place: 'pl',
  primary: 'pr',
  road: 'rd',
  school: 'sch',
  singapore: "s'pore",
  south: 'sth',
  square: 'sq',
  station: 'stn',
  street: 'st',
  tanjong: 'tg',
  temple: 'tp',
  terminal: 'ter',
  terrace: 'terr',
  tower: 'twr',
  towers: 'twrs',
  upper: 'upp',
};

export const replaceSearchStringWithShortForm = (str: string): string => {
  let result = str;
  for (const [commonWord, shortForm] of Object.entries(commonWordsToShortFormMap)) {
    result = result.replace(new RegExp(commonWord, 'i'), shortForm);
  }
  return result;
};

export const searchBusStops = async (str: string): Promise<BusStop[]> => {
  const strWithShortForms = replaceSearchStringWithShortForm(str);
  const regexArray = strWithShortForms.split(' ').map((word: string) => new RegExp(word, 'i'));
  const busStops = await BusStopModel.find({
    $or: [{ RoadName: { $all: regexArray } }, { Description: { $all: regexArray } }],
  }).exec();
  return busStops;
};

export const getBusStopMarkupList = (
  busStops: BusStop[],
  offset: number,
  messageId: string | number,
) => {
  return busStops
    .slice(offset, offset + BUS_STOP_SEARCH_PAGE_LIMIT)
    .map((info: BusStop) => [
      {
        text: `${info.RoadName}, ${info.Description} (${info.BusStopCode})`,
        callback_data: encodeCallbackData(DataType.BUS_STOP_SEARCH, messageId, info.BusStopCode),
      },
    ])
    .concat(
      busStops.length > BUS_STOP_SEARCH_PAGE_LIMIT
        ? [
            [
              ...(offset >= BUS_STOP_SEARCH_PAGE_LIMIT
                ? [
                    {
                      text: '<',
                      callback_data: encodeCallbackData(
                        DataType.BUS_STOP_SEARCH_PAGINATE,
                        messageId,
                        offset - BUS_STOP_SEARCH_PAGE_LIMIT,
                      ),
                    },
                  ]
                : []),
              ...(busStops.length > offset + BUS_STOP_SEARCH_PAGE_LIMIT
                ? [
                    {
                      text: '>',
                      callback_data: encodeCallbackData(
                        DataType.BUS_STOP_SEARCH_PAGINATE,
                        messageId,
                        offset + BUS_STOP_SEARCH_PAGE_LIMIT,
                      ),
                    },
                  ]
                : []),
            ],
          ]
        : [],
    );
};

export const replyWithBusArrivalInfo = async (
  ctx: Context,
  chatId: number | string,
  busStopCode: string,
  busServiceNum?: string,
) => {
  try {
    const busStopInfo = await BusStopModel.findOne({ BusStopCode: busStopCode });
    if (!busStopInfo) {
      ctx.reply('Invalid bus stop code!');
      return;
    }
    const busArrivalInfo = await getBusArrivalInfo(busStopCode, busServiceNum);
    if (busArrivalInfo.length === 0) {
      ctx.reply('No bus info available!');
      return;
    }
    ctx.reply(formatBusArrivalInfosForDisplay(busStopCode, busArrivalInfo, busStopInfo));
  } catch (err) {
    console.error(`Failed to get bus arrival info for chat ${chatId}. ` + err.message);
    ctx.reply('Family bot error! Sorry!');
  }
};
