import { ObjectId } from 'mongoose';

export const parkingLocations = [
  '1A',
  '1B',
  '2A',
  '2B',
  '3A',
  '3B',
  '4A',
  '4B',
  '5A',
  '5B',
] as const;
export type ParkingLocation = typeof parkingLocations[number];

export interface CarInfo {
  _id: ObjectId;
  chatId: number;
  location: ParkingLocation;
  createdAt: Date;
  updatedAt: Date;
}
