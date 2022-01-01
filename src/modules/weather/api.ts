import queryString from 'query-string';
import fetch from 'node-fetch';
import sharp from 'sharp';
import { RainAreaData } from './types';
import { formatTimeToNeaFormat } from './utils';

const GOVT_ENV_DATA_DOMAIN = 'https://api.data.gov.sg/v1/environment';
const NEA_DOMAIN = 'https://www.nea.gov.sg';

export const get24HrWeatherForecast = async (timestamp?: number) => {
  const params = {
    date_time: formatTimeToNeaFormat(timestamp),
  };
  const response = await fetch(
    `${GOVT_ENV_DATA_DOMAIN}/24-hour-weather-forecast?${queryString.stringify(params)}`,
  );

  if (!response.ok) {
    throw new Error('Failed to retrieve 24hr weather forecast');
  }

  return response.json();
};

export const getRainAreaData = async (): Promise<RainAreaData | undefined> => {
  const response = await fetch(`${NEA_DOMAIN}/api/RainArea/GetRecentData/${Date.now() / 1000}`);

  if (!response.ok) {
    throw new Error('Failed to retrieve rain area data');
  }

  const data: RainAreaData[] = await response.json();
  return data.pop();
};

export const getRainAreaOverlayImage = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to retrieve rain area overlay image');
  }

  return response.buffer();
};

const RAIN_AREA_IMAGE_WIDTH = 850;
const RAIN_AREA_IMAGE_HEIGHT = 475;

export const getRainAreaImage = async () => {
  const rainAreaData: RainAreaData | undefined = await getRainAreaData();
  if (!rainAreaData) {
    throw new Error('No rain area data available');
  }
  const timestamp = new Date(rainAreaData.SortingTime).valueOf();

  const rainAreaOverlay = await getRainAreaOverlayImage(`${NEA_DOMAIN}${rainAreaData.Url}`);
  const rainAreaOverlayBuffer = await sharp(rainAreaOverlay)
    .resize(RAIN_AREA_IMAGE_WIDTH, RAIN_AREA_IMAGE_HEIGHT)
    .composite([
      {
        input: Buffer.from([255, 255, 255, 128]),
        raw: {
          width: 1,
          height: 1,
          channels: 4,
        },
        tile: true,
        blend: 'dest-in',
      },
    ])
    .toBuffer();

  const image = await sharp('src/assets/base-sg-weather-map.png')
    .resize(RAIN_AREA_IMAGE_WIDTH, RAIN_AREA_IMAGE_HEIGHT)
    .composite([{ input: rainAreaOverlayBuffer }])
    .sharpen()
    .png()
    .toBuffer();

  return { image, timestamp };
};
