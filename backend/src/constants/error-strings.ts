import { user as USER, server as SERVER, channel as CHANNEL } from './constants.js';

export default {
  user: {
    userName: `Expected a string with length in the range [${USER.MIN_NAME_LENGTH}-${USER.MAX_NAME_LENGTH}]`,
    userEmail: `Expected valid e-mail a string with length in the range [${USER.MIN_EMAIL_LENGTH}-${USER.MAX_EMAIL_LENGTH}]`,
    reenteredNewEmail: `Expected valid e-mail a string with length in the range [${USER.MIN_EMAIL_LENGTH}-${USER.MAX_EMAIL_LENGTH}]`,
    userAvatar: `Expected a string path`,
    role: `Expected a "admin" or "basic" string`,
    isDeleted: `Expected a boolean`
  },

  server: {
    serverName: `Expected a string with length in the range [${SERVER.MIN_NAME_LENGTH}-${SERVER.MAX_NAME_LENGTH}]`,
    serverImage: `Expected image url with length in the range [${SERVER.MIN_IMAGE_LENGTH}-${SERVER.MAX_IMAGE_LENGTH}]`
  },
  channel: {
    channelName: `Expected a string with length in the range [${CHANNEL.MIN_NAME_LENGTH}-${CHANNEL.MAX_NAME_LENGTH}]`,
    channelType: `Expected a string of the following ${CHANNEL.CHANNEL_TYPES}`,
    serverId: `Expected a positive number`,
    serverName: `Expected a string with length in the range [${SERVER.MIN_NAME_LENGTH}-${SERVER.MAX_NAME_LENGTH}]`
  }
};
