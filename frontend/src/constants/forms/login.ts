import * as yup from 'yup';
import { USER } from '../constants';

const {
  MIN_EMAIL_LENGTH,
  MAX_EMAIL_LENGTH,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  PASSWORD_REGEX
} = USER;

export const LOGIN_VALIDATION = yup.object({
  email: yup
    .string()
    .min(MIN_EMAIL_LENGTH, `The email should be at least ${MIN_EMAIL_LENGTH} symbols long`)
    .max(MAX_EMAIL_LENGTH, `The email should be at most ${MAX_EMAIL_LENGTH} symbols long`)
    .email('Invalid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(MIN_PASSWORD_LENGTH, `The password should be at least ${MIN_PASSWORD_LENGTH} symbols long`)
    .max(MAX_PASSWORD_LENGTH, `The password should be at most ${MAX_PASSWORD_LENGTH} symbols long`)
    .matches(PASSWORD_REGEX, 'letters, numbers and at least 1 uppercase')
    .required('Password is required')
});

export const LOGIN_INITIAL_VALUES = {
  email: '',
  password: ''
};

export const LOGIN_FORM_TEMPLATE = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
  }
];
