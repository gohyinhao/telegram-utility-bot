import moment from 'moment';

export const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const DELIMITER = String.fromCharCode(31);

export const encodeCallbackData = (type, data) => {
  return `${type}${DELIMITER}${data}`;
};

export const parseCallbackData = (dataStr) => {
  return dataStr.split(DELIMITER);
};

export const formatTime = (timestamp) => {
  return moment(timestamp).format('ddd, D MMM, HH:mm');
};
