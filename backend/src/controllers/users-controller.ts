import express, { Request, Response } from 'express';

import usersServices from '../services/users-services.js';

import usersData from '../data/users-data.js';

import validateBody from '../middleware/validate-body.js';
import loggedUserGuard from '../middleware/loggedUserGuard.js';
import errorHandler from '../middleware/errorHandler.js';

import { authMiddleware, roleMiddleware } from '../authentication/auth.middleware.js';

import createUserSchema from '../validator/create-user-schema.js';
import updateUserSchema from '../validator/update-user-schema.js';

import rolesEnum from '../constants/roles.enum.js';
import { paging } from '../constants/constants.js';
import errors from '../constants/service-errors.js';
import RequestQuery from '../models/RequestQuery';
import serversData from '../data/servers-data.js';

const usersController = express.Router();
usersController

  // // @desc Get all users
  // // @route GET /users
  // // @access Private - Admin only
  // .get(
  //   '/',
  //   authMiddleware,
  //   loggedUserGuard,
  //   roleMiddleware(rolesEnum.admin),
  //   errorHandler(async (req: Request<{}, {}, {}, RequestQuery>, res: Response) => {
  //     const { search = '', sort = 'sort=user_id asc' } = req.query;
  //     let { pageSize = paging.DEFAULT_USERS_PAGESIZE, page = paging.DEFAULT_PAGE } = req.query;

  //     if (+pageSize > paging.MAX_USERS_PAGESIZE) pageSize = paging.MAX_USERS_PAGESIZE;
  //     if (+pageSize < paging.MIN_USERS_PAGESIZE) pageSize = paging.MIN_USERS_PAGESIZE;
  //     if (page < paging.DEFAULT_PAGE) page = paging.DEFAULT_PAGE;

  //     const users = await usersServices.getAllUsers(usersData)(search, sort, +page, +pageSize);

  //     res.status(200).send(users);
  //   })
  // )

  // @desc Get user by ID
  // @route GET /users/:userId
  // @access Private - Admin or Profile Owner - full info

  .get(
    '/:userId',
    authMiddleware,
    loggedUserGuard,
    errorHandler(async (req: Request, res: Response) => {
      const { userId } = req.params;
      const { role } = req.user;
      const isProfileOwner = +userId === req.user.userId;
      const { error, result } = await usersServices.getUserById(usersData)(
        +userId,
        isProfileOwner,
        role
      );

      if (error === errors.RECORD_NOT_FOUND) {
        res.status(404).send({
          message: `User with id ${userId} is not found.`
        });
      } else if (error === errors.OPERATION_NOT_PERMITTED) {
        res.status(403).send({
          message: `You are not authorized`
        });
      } else {
        res.status(200).send(result);
      }
    })
  )

  // @desc Get all users of a SERVER
  // @route GET /users/:serverId/server
  // @access Private - Admin only
  .get(
    '/:serverId/server',
    authMiddleware,
    loggedUserGuard,
    errorHandler(
      async (req: Request<{ serverId: number }, {}, {}, RequestQuery>, res: Response) => {
        const { search = '', sort = 'sort=user_id asc' } = req.query;
        let { pageSize = paging.DEFAULT_USERS_PAGESIZE, page = paging.DEFAULT_PAGE } = req.query;

        if (+pageSize > paging.MAX_USERS_PAGESIZE) pageSize = paging.MAX_USERS_PAGESIZE;
        if (+pageSize < paging.MIN_USERS_PAGESIZE) pageSize = paging.MIN_USERS_PAGESIZE;
        if (page < paging.DEFAULT_PAGE) page = paging.DEFAULT_PAGE;

        const { serverId } = req.params;
        const { role, userId } = req.user;

        const { users, error } = await usersServices.getAllUsersOfServer(usersData, serversData)(
          serverId,
          userId,
          search,
          sort,
          +page,
          +pageSize,
          role
        );

        if (error === errors.RECORD_NOT_FOUND) {
          res.status(404).send({
            message: `Server with id ${serverId} is not found.`
          });
        } else if (error === errors.OPERATION_NOT_PERMITTED) {
          res.status(403).send({
            message: `You are not authorized`
          });
        } else {
          res.status(200).send(users);
        }
      }
    )
  )

  // @desc Register new user
  // @route POST /users
  // @access Public - guest
  .post(
    '/',
    validateBody('user', createUserSchema),
    errorHandler(async (req: Request, res: Response) => {
      const user = req.body;

      const { error, createdUser } = await usersServices.createUser(usersData)(user);
      if (error === errors.BAD_REQUEST) {
        res.status(400).send({
          message: 'The request was invalid. Emails are required or do not match.'
        });
      } else if (error === errors.DUPLICATE_RECORD) {
        res.status(409).send({
          message: 'User with same email already exists.'
        });
      } else {
        res.status(201).send(createdUser);
      }
    })
  )

  // @desc EDIT user data
  // @route PUT /users/:id
  // @access Private - Admin(edit any user) or User Owner(edit itself irrelevant of the userId entered)
  .put(
    '/:userId',
    authMiddleware,
    loggedUserGuard,
    validateBody('user', updateUserSchema),
    errorHandler(async (req: Request, res: Response) => {
      const { role, userId } = req.user;
      const id = role === rolesEnum.admin ? req.params.userId : userId;
      const isProfileOwner = +id === userId;
      const userUpdate = req.body;

      const { error, updatedUser } = await usersServices.update(usersData)(
        userUpdate,
        +id,
        isProfileOwner,
        role
      );

      if (error === errors.RECORD_NOT_FOUND) {
        res.status(404).send({
          message: `User ${id} is not found.`
        });
      } else if (error === errors.OPERATION_NOT_PERMITTED) {
        res.status(403).send({
          message: `You are not authorized to edit this user.`
        });
      } else {
        res.status(200).send(updatedUser);
      }
    })
  )

  // @desc DELETE user
  // @route DELETE /users/:id
  // @access Private - Admin(delete any user) or User Owner(delete itself irrelevant of the userId entered)
  .delete(
    '/:userId',
    authMiddleware,
    loggedUserGuard,
    errorHandler(async (req: Request, res: Response) => {
      const { role, userId } = req.user;
      const id = role === rolesEnum.admin ? req.params.userId : userId;
      const isProfileOwner = +id === userId;

      const { error, deletedUser } = await usersServices.deleteUser(usersData)(
        +id,
        isProfileOwner,
        role
      );

      if (error === errors.RECORD_NOT_FOUND) {
        res.status(404).send({
          message: `User with id ${+id} is not found.`
        });
      } else if (error === errors.OPERATION_NOT_PERMITTED) {
        res.status(403).send({
          message: `You are not authorized to delete this user.`
        });
      } else {
        res.status(200).send(deletedUser);
      }
    })
  );

export default usersController;
