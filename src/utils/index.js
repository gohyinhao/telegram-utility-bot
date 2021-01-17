const moment = require('moment');

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const parseCallbackData = (dataStr) => {
  return dataStr.split('_');
};

const formatTime = (timestamp) => {
  return moment(timestamp).format('ddd, D MMM, HH:mm');
};

module.exports = { getRandomInt, parseCallbackData, formatTime };
