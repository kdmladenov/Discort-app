/* eslint-disable no-param-reassign */
import errors from '../constants/service-errors.js';
import UsersData from '../models/UsersData.js';
import ServersData from '../models/ServersData.js';
import RolesType from '../models/RolesType.js';
import ServerType from '../models/ServerType.js';
import rolesEnum from '../constants/roles.enum.js';

const getAllServers =
  (serversData: ServersData) =>
  async (search: string, sort: string, page: number, pageSize: number) => {
    return await serversData.getAll(search, sort, page, pageSize);
  };

const getAllServersByUser =
  (serversData: ServersData, usersData: UsersData) =>
  async (userId: number, search: string, sort: string, page: number, pageSize: number) => {
    const existingUser = await usersData.getBy('user_id', userId);

    if (!existingUser) {
      return {
        error: errors.RECORD_NOT_FOUND,
        result: null
      };
    }

    // No authorisation, beacuse the user is th logged in user
    const servers = await serversData.getAllByUser(userId, search, sort, page, pageSize);

    return {
      error: null,
      result: servers
    };
  };

const getServerById =
  (serversData: ServersData) => async (serverId: number, userId: number, role: RolesType) => {
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
      +userId,
      existingServer.serverName
    );
    if (!isUserServerMemeber && role != rolesEnum.admin) {
      return {
        error: errors.OPERATION_NOT_PERMITTED,
        result: null
      };
    }

    return {
      error: null,
      result: existingServer
    };
  };

const createServer =
  (serversData: ServersData) => async (createServersData: ServerType, userId: number) => {
    const { serverName, serverImage } = createServersData;

    // checks if the user has already made a server for the same product
    const existingServer = await serversData.getServerByUser(userId, serverName);
    if (existingServer) {
      return {
        error: errors.DUPLICATE_RECORD,
        newServer: null
      };
    }

    // No authorisation, beacuse the user is th logged in user
    const newServer = await serversData.create(serverName, serverImage, userId);

    return {
      error: null,
      newServer
    };
  };

const updateServer =
  (serversData: ServersData) =>
  async (
    updateServersData: ServerType,
    serverId: number,
    userId: number,
    role: RolesType = 'basic'
  ) => {
    const { serverName, serverImage } = updateServersData;

    const existingServer = await serversData.getBy('server_id', serverId, role);
    if (!existingServer) {
      return {
        error: errors.RECORD_NOT_FOUND,
        updatedServer: null
      };
    }

    // Permissions:
    // -server members WHO are server admins
    // -admin users
    const isUserServerMemeber = await serversData.getServerByUser(
      userId,
      existingServer.serverName
    );
    
    if (!isUserServerMemeber?.isServerAdmin && role != rolesEnum.admin) {
      return {
        error: errors.OPERATION_NOT_PERMITTED,
        updatedServer: null
      };
    }

    const updatedServer = await serversData.update(serverId, serverName, serverImage);

    return {
      error: null,
      updatedServer
    };
  };

const deleteServer =
  (serversData: ServersData) => async (serverId: number, userId: number, role: RolesType) => {
    const existingServer = await serversData.getBy('server_id', serverId);

    if (!existingServer) {
      return {
        error: errors.RECORD_NOT_FOUND,
        result: null
      };
    }

    // Permissions:
    // -server members WHO are server admins
    // -admin users
    const isUserServerMemeber = await serversData.getServerByUser(
      userId,
      existingServer.serverName
    );
    if (!isUserServerMemeber?.isServerAdmin && role != rolesEnum.admin) {
      return {
        error: errors.OPERATION_NOT_PERMITTED,
        updatedServer: null
      };
    }

    await serversData.remove(serverId);

    return {
      error: null,
      result: { ...existingServer, isDeleted: true }
    };
  };

export default {
  getAllServers,
  getAllServersByUser,
  getServerById,
  createServer,
  updateServer,
  deleteServer
};
