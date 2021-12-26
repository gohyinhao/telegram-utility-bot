import queryString from 'query-string';
import fetch from 'node-fetch';
import moment from 'moment';

const NEA_DOMAIN = 'https://api.data.gov.sg/v1/environment';

export const get24HrWeatherForecast = async (timestamp?: number) => {
  const params = {
    date_time: moment(timestamp).format('YYYY-MM-DDTHH:mm:ss'),
  };
  const response = await fetch(
    `${NEA_DOMAIN}/24-hour-weather-forecast?${queryString.stringify(params)}`,
  );

  if (!response.ok) {
    throw new Error('Failed to retrieve 24hr weather forecast');
  }

  return response.json();
};
