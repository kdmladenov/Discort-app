/* eslint-disable no-param-reassign */
import rolesEnum from '../constants/roles.enum.js';
import errors from '../constants/service-errors.js';
import UsersData from '../models/UsersData.js';
import ChannelsData from '../models/ChannelsData.js';
import RolesType from '../models/RolesType.js';
import serversData from '../data/servers-data.js';
import ChannelType from '../models/ChannelType.js';
import ServersData from '../models/ServersData.js';

const getAllServerChannels =
  (channelsData: ChannelsData, serversData: ServersData) =>
  async (
    serverId: number,
    userId: number,
    search: string,
    sort: string,
    page: number,
    pageSize: number,
    role: RolesType
  ) => {
    // No such server
    const existingServer = await serversData.getBy('server_id', serverId);
    if (!existingServer) {
      return {
        error: errors.RECORD_NOT_FOUND,
        result: null
      };
    }

    // Permissions:
    // -server members
    // -admin users
    const isUserServerMemeber = await serversData.getServerByUser(
      userId,
      existingServer.serverName
    );
    if (!isUserServerMemeber && role != rolesEnum.admin) {
      return {
        error: errors.OPERATION_NOT_PERMITTED,
        result: null
      };
    }

    const channels = await channelsData.getAll(userId, search, sort, page, pageSize);

    return {
      error: null,
      result: channels
    };
  };

const getChannelById =
  (channelsData: ChannelsData) => async (channelId: number, userId: number, role: RolesType) => {
    const existingChannel = await channelsData.getBy('channel_id', channelId);

    if (!existingChannel) {
      return {
        error: errors.RECORD_NOT_FOUND,
        result: null
      };
    }

    // Permissions:
    // -server members
    // -admin users
    const isUserServerMemeber = await serversData.getServerByUser(
      userId,
      existingChannel.serverName
    );

    if (!isUserServerMemeber && role != rolesEnum.admin) {
      return {
        error: errors.OPERATION_NOT_PERMITTED,
        result: null
      };
    }

    return {
      error: null,
      result: existingChannel
    };
  };

const createChannel =
  (channelsData: ChannelsData, serversData: ServersData) =>
  async (createChannelsData: ChannelType, userId: number, role: RolesType) => {
    const { channelName, channelType, serverId, serverName } = createChannelsData;

    // checks if the user has already made a channel for the same product
    const existingChannel = await channelsData.getChannelByName(serverId, channelName);
    if (existingChannel) {
      return {
        error: errors.DUPLICATE_RECORD,
        result: null
      };
    }

    // Permissions:
    // -server members
    // -admin users
    const isUserServerMemeber = await serversData.getServerByUser(userId, serverName);

    if (!isUserServerMemeber && role != rolesEnum.admin) {
      return {
        error: errors.OPERATION_NOT_PERMITTED,
        result: null
      };
    }

    const newChannel = await channelsData.create(channelName, channelType, serverId);

    return {
      error: null,
      result: newChannel
    };
  };

const updateChannel =
  (channelsData: ChannelsData) =>
  async (
    updateChannelsData: ChannelType,
    channelId: number,
    userId: number,
    role: RolesType = 'basic'
  ) => {
    const existingChannel = await channelsData.getBy('channel_id', channelId);
    if (!existingChannel) {
      return {
        error: errors.RECORD_NOT_FOUND,
        result: null
      };
    }

    // Permissions:
    // -server members
    // -admin users
    const isUserServerMemeber = await serversData.getServerByUser(
      userId,
      existingChannel.serverName
    );

    if (!isUserServerMemeber && role != rolesEnum.admin) {
      return {
        error: errors.OPERATION_NOT_PERMITTED,
        result: null
      };
    }

    const updatedChannel = await channelsData.update({ ...existingChannel, ...updateChannelsData });

    return {
      error: null,
      result: updatedChannel
    };
  };

const deleteChannel =
  (channelsData: ChannelsData) => async (channelId: number, userId: number, role: RolesType) => {
    const existingChannel = await channelsData.getBy('channel_id', channelId);
    if (!existingChannel) {
      return {
        error: errors.RECORD_NOT_FOUND,
        result: null
      };
    }

    // Permissions:
    // -server members
    // -admin users
    const isUserServerMemeber = await serversData.getServerByUser(
      userId,
      existingChannel.serverName
    );

    if (!isUserServerMemeber && role != rolesEnum.admin) {
      return {
        error: errors.OPERATION_NOT_PERMITTED,
        result: null
      };
    }

    const deletedChannel = await channelsData.remove(channelId);

    return {
      error: null,
      result: { ...deletedChannel, isDeleted: true }
    };
  };

export default {
  getAllServerChannels,
  createChannel,
  updateChannel,
  deleteChannel,
  getChannelById
};
