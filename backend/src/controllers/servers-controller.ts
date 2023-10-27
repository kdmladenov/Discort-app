import express, { Request, Response } from 'express';

import serversServices from '../services/servers-services.js';

import serversData from '../data/servers-data.js';

import validateBody from '../middleware/validate-body.js';
import loggedUserGuard from '../middleware/loggedUserGuard.js';
import errorHandler from '../middleware/errorHandler.js';

import { authMiddleware } from '../authentication/auth.middleware.js';

import { paging } from '../constants/constants.js';
import errors from '../constants/service-errors.js';
import RequestQuery from '../models/RequestQuery.js';
import usersData from '../data/users-data.js';
import createServerSchema from '../validator/create-server-schema.js';
import updateServerSchema from '../validator/update-server-schema.js';

const serversController = express.Router();

serversController
  // @desc GET All Servers
  // @route GET/servers
  // @access Private
  .get(
    '/',
    authMiddleware,
    loggedUserGuard,
    errorHandler(
      async (req: Request<{ productId: number }, {}, {}, RequestQuery>, res: Response) => {
        let {
          search = '',
          sort = 'date_created desc',
          pageSize = paging.DEFAULT_SERVERS_PAGESIZE,
          page = paging.DEFAULT_PAGE
        } = req.query;

        const { userId } = req.user;

        if (+pageSize > paging.MAX_SERVERS_PAGESIZE) pageSize = paging.MAX_SERVERS_PAGESIZE;
        if (+pageSize < paging.MIN_SERVERS_PAGESIZE) pageSize = paging.MIN_SERVERS_PAGESIZE;
        if (page < paging.DEFAULT_PAGE) page = paging.DEFAULT_PAGE;

        const result = await serversServices.getAllServers(serversData)(
          search,
          sort,
          +page,
          +pageSize
        );

        res.status(200).send(result);
      }
    )
  )
  
  // @desc GET All Servers by a user
  // @route GET/servers
  // @access Private
  .get(
    '/user',
    authMiddleware,
    loggedUserGuard,
    errorHandler(
      async (req: Request<{ productId: number }, {}, {}, RequestQuery>, res: Response) => {
        let {
          search = '',
          sort = 'date_created desc',
          pageSize = paging.DEFAULT_SERVERS_PAGESIZE,
          page = paging.DEFAULT_PAGE
        } = req.query;

        const { userId } = req.user;

        if (+pageSize > paging.MAX_SERVERS_PAGESIZE) pageSize = paging.MAX_SERVERS_PAGESIZE;
        if (+pageSize < paging.MIN_SERVERS_PAGESIZE) pageSize = paging.MIN_SERVERS_PAGESIZE;
        if (page < paging.DEFAULT_PAGE) page = paging.DEFAULT_PAGE;

        const { error, result } = await serversServices.getAllServersByUser(serversData, usersData)(
          +userId,
          search,
          sort,
          +page,
          +pageSize
        );

        if (error === errors.RECORD_NOT_FOUND) {
          res.status(404).send({
            message: 'The user is not found.'
          });
        } else {
          res.status(200).send(result);
        }
      }
    )
  )

  // @desc GET Single Server by ID
  // @route GET/servers
  // @access Private
  .get(
    '/:serverId',
    authMiddleware,
    loggedUserGuard,
    errorHandler(async (req: Request, res: Response) => {
      const { serverId } = req.params;
      const { userId, role } = req.user;

      const { error, result } = await serversServices.getServerById(serversData)(
        +serverId,
        +userId,
        role
      );

      if (error === errors.RECORD_NOT_FOUND) {
        res.status(404).send({
          message: 'The server is not found.'
        });
      } else if (error === errors.OPERATION_NOT_PERMITTED) {
        res.status(403).send({
          message: `You are not authorized to this server`
        });
      } else {
        res.status(200).send(result);
      }
    })
  )

  // @desc CREATE Product server
  // @route POST/servers/:productId
  // @access Private - logged users
  .post(
    '/',
    authMiddleware,
    loggedUserGuard,
    validateBody('server', createServerSchema),
    errorHandler(async (req: Request, res: Response) => {
      const createServersData = req.body;
      const { userId } = req.user;

      const { error, newServer } = await serversServices.createServer(serversData)(
        createServersData,
        +userId
      );

      if (error === errors.DUPLICATE_RECORD) {
        res.status(409).send({
          message: `A sever with ${userId} id has already been created.`
        });
      } else {
        res.status(201).send(newServer);
      }
    })
  )

  // @desc EDIT Product server
  // @route PUT/:serverId
  // @access Private - logged users who have created the server or Admin
  .put(
    '/:serverId',
    authMiddleware,
    loggedUserGuard,
    validateBody('server', updateServerSchema),
    errorHandler(async (req: Request, res: Response) => {
      const updateServersData = req.body;
      const { serverId } = req.params;
      const { userId, role } = req.user;

      const { error, updatedServer } = await serversServices.updateServer(serversData)(
        updateServersData,
        +serverId,
        +userId,
        role
      );

      if (error === errors.RECORD_NOT_FOUND) {
        res.status(404).send({
          message: 'The server is not found.'
        });
      } else if (error === errors.OPERATION_NOT_PERMITTED) {
        res.status(403).send({
          message: `You are not authorized to edit this server`
        });
      } else {
        res.status(200).send(updatedServer);
      }
    })
  )

  // @desc DELETE server
  // @route DELETE/:serverId
  // @access Private - logged users who server members WHO are server admins or Admins
  .delete(
    '/:serverId',
    authMiddleware,
    loggedUserGuard,
    errorHandler(async (req: Request, res: Response) => {
      const { userId, role } = req.user;
      const { serverId } = req.params;

      const { error, result } = await serversServices.deleteServer(serversData)(
        +serverId,
        +userId,
        role
      );

      if (error === errors.RECORD_NOT_FOUND) {
        res.status(404).send({
          message: 'The server is not found.'
        });
      } else if (error === errors.OPERATION_NOT_PERMITTED) {
        res.status(403).send({
          message: `You are not authorized to delete this server`
        });
      } else {
        res.status(200).send(result);
      }
    })
  );

export default serversController;
