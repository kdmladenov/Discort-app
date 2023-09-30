import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

const authMiddleware = passport.authenticate('jwt', { session: false });

const roleMiddleware = (roleName: string) => (req: Request, res: Response, next: NextFunction) => {
  if (req?.user.role === roleName) {
    next();
  } else {
    res.status(403).send({
      message: 'Resource is forbidden'
    });
  }
};

export { authMiddleware, roleMiddleware };
