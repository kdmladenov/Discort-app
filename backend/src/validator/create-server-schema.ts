import { server } from '../constants/constants.js';

export default {
  serverName: (value: string) =>
    typeof value === 'string' &&
    value.length >= server.MIN_NAME_LENGTH &&
    value.length <= server.MAX_NAME_LENGTH,
  serverImage: (value: string) =>
    typeof value === 'string' &&
    value.length >= server.MIN_IMAGE_LENGTH &&
    value.length <= server.MAX_IMAGE_LENGTH
};
