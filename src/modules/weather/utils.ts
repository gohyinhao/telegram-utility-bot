import moment from 'moment';

export const formatTimeToNeaFormat = (timestamp?: number): string => {
  return moment(timestamp).format('YYYY-MM-DDTHH:mm:ss');
};
