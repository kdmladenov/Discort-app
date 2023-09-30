import express, { Request, Response } from 'express';

import usersServices from '../services/users-services.js';

import usersData from '../data/users-data.js';

import validateBody from '../middleware/validate-body.js';
import errorHandler from '../middleware/errorHandler.js';

import createToken from '../authentication/create-token.js';
import { authMiddleware } from '../authentication/auth.middleware.js';

import loginUserSchema from '../validator/login-user-schema.js';

import errors from '../constants/service-errors.js';

const authController = express.Router();

authController
  .post(
    '/login',
    validateBody('user', loginUserSchema),
    errorHandler(async (req: Request, res: Response) => {
      const { email, password } = req.body;
      const { error, result } = await usersServices.login(usersData)(email, password);

      const { userId, name, role } = result;

      if (error === errors.INVALID_LOGIN) {
        res.status(401).send({
          message: 'Wrong email or password.'
        });
      } else {
        const payload = {
          userId,
          name,
          email,
          role
        };

        const token = createToken(payload);

        res.status(200).send({ token, userId, name, email, role });
      }
    })
  )
  .delete(
    '/logout',
    authMiddleware,
    errorHandler(async (req: Request, res: Response) => {
      const token = req.headers.authorization!.replace('Bearer ', '');
      await usersServices.logout(usersData)(token);

      res.status(200).send({
        message: 'You have logged out successfully!'
      });
    })
  );

export default authController;
