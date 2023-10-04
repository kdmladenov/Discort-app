import express, { Request, Response } from 'express';

import channelsServices from '../services/channels-services.js';

import channelsData from '../data/channels-data.js';

import validateBody from '../middleware/validate-body.js';
import loggedUserGuard from '../middleware/loggedUserGuard.js';
import errorHandler from '../middleware/errorHandler.js';

import { authMiddleware } from '../authentication/auth.middleware.js';

import { paging } from '../constants/constants.js';
import errors from '../constants/service-errors.js';
import RequestQuery from '../models/RequestQuery.js';
import usersData from '../data/users-data.js';
import serversData from '../data/servers-data.js';
import createChannelSchema from '../validator/create-channel-schema.js';
import updateChannelSchema from '../validator/update-channel-schema.js';

const channelsController = express.Router();

channelsController
  // @desc GET All Server Channels
  // @route GET/channels
  // @access Private
  .get(
    '/:serverId/server',
    authMiddleware,
    loggedUserGuard,
    errorHandler(
      async (req: Request<{ serverId: number }, {}, {}, RequestQuery>, res: Response) => {
        let {
          search = '',
          sort = 'date_created desc',
          pageSize = paging.DEFAULT_CHANNELS_PAGESIZE,
          page = paging.DEFAULT_PAGE
        } = req.query;

        const { serverId } = req.params;
        const { userId, role } = req.user;

        if (+pageSize > paging.MAX_CHANNELS_PAGESIZE) pageSize = paging.MAX_CHANNELS_PAGESIZE;
        if (+pageSize < paging.MIN_CHANNELS_PAGESIZE) pageSize = paging.MIN_CHANNELS_PAGESIZE;
        if (page < paging.DEFAULT_PAGE) page = paging.DEFAULT_PAGE;

        const { error, result } = await channelsServices.getAllServerChannels(
          channelsData,
          serversData
        )(serverId, +userId, search, sort, +page, +pageSize, role);

        if (error === errors.RECORD_NOT_FOUND) {
          res.status(404).send({
            message: 'The product is not found.'
          });
        } else {
          res.status(200).send(result);
        }
      }
    )
  )

  // @desc GET Single Channel by ID
  // @route GET/channels
  // @access Private
  .get(
    '/:channelId',
    authMiddleware,
    loggedUserGuard,
    errorHandler(async (req: Request, res: Response) => {
      const { channelId } = req.params;
      const { userId, role } = req.user;
      const { error, result } = await channelsServices.getChannelById(channelsData)(
        +channelId,
        userId,
        role
      );

      if (error === errors.RECORD_NOT_FOUND) {
        res.status(404).send({
          message: 'The channel is not found.'
        });
      } else {
        res.status(200).send(result);
      }
    })
  )
  // @desc CREATE channel
  // @route POST/channels/
  // @access Private - logged users who have purchased and received the product
  .post(
    '/',
    authMiddleware,
    loggedUserGuard,
    validateBody('channel', createChannelSchema),
    errorHandler(async (req: Request, res: Response) => {
      const createChannelsData = req.body;
      const { userId, role } = req.user;

      const { error, result } = await channelsServices.createChannel(channelsData, serversData)(
        createChannelsData,
        +userId,
        role
      );

      if (error === errors.DUPLICATE_RECORD) {
        res.status(409).send({
          message: `A channel with ${createChannelsData.channelName} name already exists.`
        });
      } else if (error === errors.OPERATION_NOT_PERMITTED) {
        res.status(403).send({
          message: `You are not authorized to create this channel`
        });
      } else {
        res.status(201).send(result);
      }
    })
  )
  // @desc EDIT channel
  // @route PUT/:channelId
  // @access Private - logged users who have created the channel or Admin
  .put(
    '/:channelId',
    authMiddleware,
    loggedUserGuard,
    validateBody('channel', updateChannelSchema),
    errorHandler(async (req: Request, res: Response) => {
      const updateChannelsData = req.body;
      const { channelId } = req.params;
      const { userId, role } = req.user;

      const { error, result } = await channelsServices.updateChannel(channelsData)(
        updateChannelsData,
        +channelId,
        +userId,
        role
      );

      if (error === errors.RECORD_NOT_FOUND) {
        res.status(404).send({
          message: 'The channel is not found.'
        });
      } else if (error === errors.OPERATION_NOT_PERMITTED) {
        res.status(403).send({
          message: `You are not authorized to edit this channel`
        });
      } else {
        res.status(200).send(result);
      }
    })
  )

  // @desc DELETE Product channel
  // @route DELETE/:channelId
  // @access Private - logged users who have created the channel or Admin
  .delete(
    '/:channelId',
    authMiddleware,
    loggedUserGuard,
    errorHandler(async (req: Request, res: Response) => {
      const { userId, role } = req.user;
      const { channelId } = req.params;

      const { error, result } = await channelsServices.deleteChannel(channelsData)(
        +channelId,
        +userId,
        role
      );

      if (error === errors.RECORD_NOT_FOUND) {
        res.status(404).send({
          message: 'The channel is not found.'
        });
      } else if (error === errors.OPERATION_NOT_PERMITTED) {
        res.status(403).send({
          message: `You are not authorized to delete this channel`
        });
      } else {
        res.status(200).send(result);
      }
    })
  );

export default channelsController;
