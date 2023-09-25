import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import passport from 'passport';

import usersController from './controllers/users-controller.js';
import authController from './controllers/auth-controller.js';

import jwtStrategy from './authentication/strategy.js';
import { PORT } from '../config.js';
import HttpException from './models/HttpException.js';
import serversController from './controllers/servers-controller.js';
import channelsController from './controllers/channel-controller.js';


const app = express();

passport.use(jwtStrategy);

app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.use(express.json());
app.use(passport.initialize());

app.use('/auth', authController);
app.use('/users', usersController);
app.use('/servers', serversController);
app.use('/channels', channelsController);


app.all('*', (req, res) => res.status(404).send({ message: 'Resource not found!' }));

app.use((err: HttpException, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({
    message: err.message
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
