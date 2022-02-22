export enum BusOperator {
  SBS = 'SBST',
  SMRT = 'SMRT',
  TTS = 'TTS', // tower transit
  GAS = 'GAS', // go ahead singapore
}

export enum BusLoad {
  SEATS_AVAILABLE = 'SEA',
  STAND_AVAILABLE = 'SDA',
  LIMITED_STANDING = 'LSD',
}

export enum BusType {
  SINGLE_DECK = 'SD',
  DOUBLE_DECK = 'DD',
  BENDY = 'BD',
}

export interface BusStop {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
}

export interface BusInfo {
  OriginCode: string; // origin bus stop code
  DestinationCode: string; // final dest bus stop code
  EstimatedArrival: string; // date string
  Latitude: string;
  Longitude: string;
  VisitNumber: string; // ordinal value of nth visit of this vehicle at this bus stop, e.g. 1 = 1st visit and so on
  Load: BusLoad;
  Feature?: 'WAB' | null; // WAB means wheelchair accessible
  Type: BusType;
}

export interface BusArrivalInfo {
  ServiceNo: string;
  Operator: BusOperator;
  NextBus?: BusInfo;
  NextBus2?: BusInfo;
  NextBus3?: BusInfo;
}
