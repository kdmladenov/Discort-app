import passportJwt from 'passport-jwt';
import { PRIVATE_KEY } from '../../config.js';

const options = {
  secretOrKey: PRIVATE_KEY,
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtStrategy = new passportJwt.Strategy(options, async (payload, done) => {
  const user = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  };

  done(null, user);
});

export default jwtStrategy;
