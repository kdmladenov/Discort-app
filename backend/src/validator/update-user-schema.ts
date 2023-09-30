import { user } from '../constants/constants.js';

export default {
  userName: (value: string) =>
    !value ||
    (typeof value === 'string' &&
    value.length >= user.MIN_NAME_LENGTH &&
    value.length <= user.MAX_NAME_LENGTH),
  userEmail: (value: string) =>
    !value ||
    (typeof value === 'string' &&
    value.length >= user.MIN_EMAIL_LENGTH &&
    value.length <= user.MAX_EMAIL_LENGTH &&
    user.EMAIL_REGEX.test(value))
};
