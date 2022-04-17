import { encodeCallbackData } from '../../utils';
import { DataType } from '../../types';
import { URL_PAGE_LIMIT } from './constants';
import { UrlList, UrlObject } from './types';

export const checkUrlExistInList = (url: string, list: UrlList): boolean => {
  return list.items.some((record: UrlObject) => record.url === url);
};

export const formatUrlObjectForDisplay = (obj: UrlObject): string => {
  return `${obj.description} ${obj.url}`;
};

export const getUrlMarkupList = (urlObjects: UrlObject[], offset = 0) => {
  return urlObjects
    .slice(offset, offset + URL_PAGE_LIMIT)
    .map((obj: UrlObject) => [
      {
        text: obj.description,
        callback_data: encodeCallbackData(DataType.DELETE_URL, obj._id.toString()),
      },
    ])
    .concat(
      urlObjects.length > URL_PAGE_LIMIT
        ? [
            [
              ...(offset >= URL_PAGE_LIMIT
                ? [
                    {
                      text: '<',
                      callback_data: encodeCallbackData(
                        DataType.DELETE_URL_PAGINATE,
                        offset - URL_PAGE_LIMIT,
                      ),
                    },
                  ]
                : []),
              ...(urlObjects.length > offset + URL_PAGE_LIMIT
                ? [
                    {
                      text: '>',
                      callback_data: encodeCallbackData(
                        DataType.DELETE_URL_PAGINATE,
                        offset + URL_PAGE_LIMIT,
                      ),
                    },
                  ]
                : []),
            ],
          ]
        : [],
    );
};
