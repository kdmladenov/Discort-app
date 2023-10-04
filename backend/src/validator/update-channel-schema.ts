import { channel } from '../constants/constants.js';

export default {
  channelName: (value: string) =>
    !value ||
    (typeof value === 'string' &&
      value.length >= channel.MIN_NAME_LENGTH &&
      value.length <= channel.MAX_NAME_LENGTH),
  // Channel Type is required
  channelType: (value: string) =>
    typeof value === 'string' && channel.CHANNEL_TYPES.includes(value),
  serverId: (value: number) => !value || (typeof value === 'number' && value > 0)
};
