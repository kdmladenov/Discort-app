import bcrypt from 'bcrypt';
import errors from '../constants/service-errors.js';
import UsersData from '../models/UsersData.js';
import UserType from '../models/UserType.js';
import RolesType from '../models/RolesType.js';
import rolesEnum from '../constants/roles.enum.js';
import ServersData from '../models/ServersData.js';

const getUserById =
  (usersData: UsersData) => async (userId: number, isProfileOwner: boolean, role: RolesType) => {
    const user = await usersData.getBy('user_id', userId, role);
    if (!user) {
      return {
        error: errors.RECORD_NOT_FOUND,
        result: null
      };
    }
    // Permissions:
    // -The profile owner
    // -Admin user
    if (!isProfileOwner && role !== rolesEnum.admin) {
      return {
        error: errors.OPERATION_NOT_PERMITTED,
        result: null
      };
    }

    return {
      error: null,
      result: user
    };
  };

// const getAllUsers =
//   (usersData: UsersData) =>
//   async (search: string, sort: string, page: number, pageSize: number) => {
//     const users = await usersData.getAll(search, sort, page, pageSize, rolesEnum.admin);

//     return users;
//   };

const getAllUsersOfServer =
  (usersData: UsersData, serversData: ServersData) =>
  async (
    serverId: number,
    userId: number,
    search: string,
    sort: string,
    page: number,
    pageSize: number,
    role: RolesType
  ) => {
    const existingServer = await serversData.getBy('server_id', serverId);

    if (!existingServer) {
      return {
        error: errors.RECORD_NOT_FOUND,
        users: null
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
        users: null
      };
    }

    const users = await usersData.getAllUsersOfServer(serverId, search, sort, page, pageSize);

    return {
      error: null,
      users
    };
  };

// register
const createUser = (usersData: UsersData) => async (user: UserType) => {
  if (user.password !== user.reenteredPassword) {
    return {
      error: errors.BAD_REQUEST,
      createdUser: null
    };
  }

  const existingUser = await usersData.getBy('email', user.userEmail, true);

  if (existingUser) {
    return {
      error: errors.DUPLICATE_RECORD,
      createdUser: null
    };
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);

  return {
    error: null,
    createdUser: await usersData.create({ ...user, password: hashedPassword })
  };
};

// update profile
const update =
  (usersData: UsersData) =>
  async (userUpdate: UserType, userId: number, isProfileOwner: boolean, role: RolesType) => {
    const existingUser = await usersData.getBy('user_id', userId, true);
    if (!existingUser) {
      return {
        error: errors.RECORD_NOT_FOUND,
        updatedUser: null
      };
    }

    // Permissions:
    // -The profile owner
    // -Admin user
    if (!isProfileOwner && role !== rolesEnum.admin) {
      return {
        error: errors.OPERATION_NOT_PERMITTED,
        updatedUser: null
      };
    }

    const updatedUser = await usersData.update({ ...existingUser, ...userUpdate });

    return {
      error: null,
      updatedUser
    };
  };

// delete user
const deleteUser =
  (usersData: UsersData) => async (userId: number, isProfileOwner: boolean, role: RolesType) => {
    const existingUser = await usersData.getBy('user_id', userId, true);
    if (!existingUser) {
      return {
        error: errors.RECORD_NOT_FOUND,
        deletedUser: null
      };
    }

    // Permissions:
    // -The profile owner
    // -Admin user
    if (!isProfileOwner && role !== rolesEnum.admin) {
      return {
        error: errors.OPERATION_NOT_PERMITTED,
        deletedUser: null
      };
    }

    const deletedUser = await usersData.remove(userId);

    return {
      error: null,
      deletedUser
    };
  };

// login
const login = (usersData: UsersData) => async (email: string, password: string) => {
  const user = await usersData.loginUser(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return {
      error: errors.INVALID_LOGIN,
      result: null
    };
  }

  return {
    error: null,
    result: user
  };
};

const logout = (usersData: UsersData) => async (token: string) => {
  await usersData.logoutUser(token);
};

export default {
  getUserById,
  // getAllUsers,
  getAllUsersOfServer,
  createUser,
  update,
  deleteUser,
  login,
  logout
};
