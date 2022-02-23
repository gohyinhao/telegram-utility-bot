import redis from '../redis';

export const encodeCacheKey = (chatId: number | string, messageId: number | string): string => {
  return `${chatId}${messageId}`;
};

export const setItemInCache = (
  chatId: number | string,
  messageId: number | string,
  value: string,
  expiryTimeInSec = 600,
) => {
  redis.set(encodeCacheKey(chatId, messageId), value, 'EX', expiryTimeInSec);
};

export const getItemFromCache = async (chatId: number | string, messageId: number | string) => {
  return await redis.get(encodeCacheKey(chatId, messageId));
};

export const deleteItemFromCache = (chatId: number | string, messageId: number | string) => {
  redis.del(encodeCacheKey(chatId, messageId));
};
