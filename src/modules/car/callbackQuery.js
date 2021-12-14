const CarInfo = require('./carInfo');

const handleParkingInfoCallbackQuery = async (ctx, callbackQueryId, chatId, parkedLocation) => {
  try {
    const carInfo = await CarInfo.findOne({ chatId });
    if (!carInfo) {
      const newCarInfo = new CarInfo({ chatId, location: parkedLocation });
      await newCarInfo.save();
      ctx.answerCbQuery(callbackQueryId, { text: `Car location of ${parkedLocation} is saved.` });
    } else {
      carInfo.location = parkedLocation;
      await carInfo.save();
      ctx.answerCbQuery(callbackQueryId, { text: `Car location of ${parkedLocation} is saved.` });
    }
  } catch (err) {
    ctx.answerCbQuery(callbackQueryId, { text: 'Failed to save new parked location.' });
  }
};

module.exports = { handleParkingInfoCallbackQuery };
