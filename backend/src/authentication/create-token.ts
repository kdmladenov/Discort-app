import jwt from 'jsonwebtoken';

import { PRIVATE_KEY /* , TOKEN_LIFETIME */ } from '../../config.js';
import Payload from '../models/Payload.js';

const createToken = (payload: Payload) => {
  const token = jwt.sign(
    payload,
    PRIVATE_KEY
    // { expiresIn: +TOKEN_LIFETIME }, // Expiration option
  );

  return token;
};

export default createToken;
