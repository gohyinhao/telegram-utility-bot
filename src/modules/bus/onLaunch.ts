import { getAllBusStopInfo } from './api';
import BusStopModel from './models/busStop';
import schedule from '../../scheduler';

const refreshBusStopInfoInDb = async () => {
  try {
    console.log('Starting to fetch bus stop info...');
    const busStopInfo = await getAllBusStopInfo();
    console.log('Finished fetching bus stop info!');
    console.log('Deleting all existing bus stop records...');
    BusStopModel.deleteMany({});
    console.log('Finished deleting all existing bus stop records!');
    console.log('Inserting new bus stop info into db...');
    BusStopModel.insertMany(busStopInfo, undefined, function (err) {
      if (err) {
        throw new Error(err.message);
      }
      console.log(`${busStopInfo.length} bus stop info successfully added to db!`);
    });
  } catch (err) {
    console.error(err.message);
  }
};

const runOnLaunch = async () => {
  await refreshBusStopInfoInDb();
  // refresh bus stop info every monday, 12 noon
  schedule.scheduleJob('0 12 * * 1', async function () {
    await refreshBusStopInfoInDb();
  });
};

runOnLaunch();
