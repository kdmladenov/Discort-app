import { NextFunction, Request, Response } from 'express';
import tokenLoggedOut from '../data/tokens-data.js';

export default async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization!.replace('Bearer ', '');

  if (await tokenLoggedOut(token)) {
    return res.status(401).send({
      message: ' You are not logged in!'
    });
  }

  next();
};
