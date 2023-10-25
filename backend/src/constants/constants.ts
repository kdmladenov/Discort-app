export const SITE_NAME = 'Discort app';

export const user = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_EMAIL_LENGTH: 4,
  MAX_EMAIL_LENGTH: 100,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 20,
  EMAIL_REGEX: /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/,
  PASSWORD_REGEX: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/ // letters, numbers and at least 1 uppercase
};

export const server = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_IMAGE_LENGTH: 4,
  MAX_IMAGE_LENGTH: 100
};

export const channel = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
 CHANNEL_TYPES: ['text', 'audio', 'video']
};

export const paging = {
  DEFAULT_PAGE: 1,
  MIN_USERS_PAGESIZE: 10,
  MAX_USERS_PAGESIZE: 20,
  DEFAULT_USERS_PAGESIZE: 15,
  MIN_SERVERS_PAGESIZE: 10,
  MAX_SERVERS_PAGESIZE: 20,
  DEFAULT_SERVERS_PAGESIZE: 15,
  MIN_CHANNELS_PAGESIZE: 10,
  MAX_CHANNELS_PAGESIZE: 20,
  DEFAULT_CHANNELS_PAGESIZE: 15
};
