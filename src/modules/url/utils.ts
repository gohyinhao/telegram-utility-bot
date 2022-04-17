import { UrlList, UrlObject } from './types';

export const checkUrlExistInList = (url: string, list: UrlList): boolean => {
  return list.items.some((record: UrlObject) => record.url === url);
};
