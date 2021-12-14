const moment = require('moment');

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const DELIMITER = String.fromCharCode(31);

const encodeCallbackData = (type, ...data) => {
  return type + DELIMITER + data.join(DELIMITER);
};

const parseCallbackData = (dataStr) => {
  return dataStr.split(DELIMITER);
};

const formatTime = (timestamp) => {
  return moment(timestamp).format('ddd, D MMM, HH:mm');
};

module.exports = { getRandomInt, encodeCallbackData, parseCallbackData, formatTime };
