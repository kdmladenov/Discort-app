import * as yup from 'yup';
import { USER } from '../constants';

const {
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
  MIN_EMAIL_LENGTH,
  MAX_EMAIL_LENGTH,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  PASSWORD_REGEX
} = USER;

export const REGISTER_VALIDATION = yup.object({
  name: yup
    .string()
    .min(
      MIN_NAME_LENGTH,
      `The name should be at least ${MIN_NAME_LENGTH} symbols long`
    )
    .max(
      MAX_NAME_LENGTH,
      `The name should be at most ${MAX_NAME_LENGTH} symbols long`
    )
    .required('Name is required'),
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
    .required('Password is required'),
  reenteredPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password')
});

export const REGISTER_INITIAL_VALUES = {
  name: '',
  email: '',
  password: '',
  consfirmPassword: ''
};

export const REGISTER_FORM_TEMPLATE = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    width: 12
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    width: 12
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    width: 6
  },
  {
    name: 'reenteredPassword',
    label: 'Confirm Password',
    type: 'password',
    width: 6
  }
];
