import moment from 'moment';

export const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

export const parseCallbackData = (dataStr) => {
  return dataStr.split('_');
};

export const formatTime = (timestamp) => {
  return moment(timestamp).format('ddd, D MMM, HH:mm');
};
