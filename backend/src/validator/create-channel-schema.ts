import { channel, server } from '../constants/constants.js';

export default {
  channelName: (value: string) =>
    typeof value === 'string' &&
    value.length >= channel.MIN_NAME_LENGTH &&
    value.length <= channel.MAX_NAME_LENGTH,
  channelType: (value: string) =>
    typeof value === 'string' && channel.CHANNEL_TYPES.includes(value),
  serverId: (value: number) => typeof value === 'number' && value > 0,
  serverName: (value: string) =>
    typeof value === 'string' &&
    value.length >= server.MIN_NAME_LENGTH &&
    value.length <= server.MAX_NAME_LENGTH
};
