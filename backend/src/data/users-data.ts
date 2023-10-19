import db from './pool.js';
import rolesEnum from '../constants/roles.enum.js';
import UserType from '../models/UserType.js';
import RolesType from '../models/RolesType.js';

const getBy = async (
  key: string,
  value: string | number,
  role: RolesType = rolesEnum.basic
) => {
  const sql = `
    SELECT 
      user_id as userId, 
      name as userName,
      email as userEmail,
      avatar as userAvatar, 
      is_deleted as isDeleted,   
      created_at as createdAt,
      updated_at as updatedAt,
      role
    FROM users
    WHERE ${role === 'admin' ? `` : `is_deleted = 0 AND`} ${key} = ?
  `;

  const result = await db.query(sql, value);

  return result[0];
};

const getAll = async (
  search: string,
  sort: string,
  page: number,
  pageSize: number,
  role: RolesType
) => {
  const sortArr = sort.split(' ');
  const direction = ['ASC', 'asc', 'DESC', 'desc'].includes(sortArr[1]) ? sortArr[1] : 'asc';
  const sortColumn = ['user_id', 'name', 'email'].includes(sortArr[0]) ? sortArr[0] : 'user_id';

  const offset = page ? (page - 1) * pageSize : 0;

  const sql = `
    SELECT
      user_id as userId, 
      name as userName,
      email as userEmail,
      avatar as userAvatar, 
      is_deleted as isDeleted,   
      created_at as createdAt,
      updated_at as updatedAt,
      role,  
      COUNT(*) OVER () AS totalDBItems
    FROM users
    WHERE ${role === rolesEnum.basic ? ' is_deleted = 0 AND ' : ''} ${
    search.length > 0
      ? `CONCAT_WS(',', user_id, name ${role === rolesEnum.admin && `, email`}
      )`
      : ' name '
  } Like '%${search}%'
    ORDER BY ${sortColumn} ${direction} 
    LIMIT ? OFFSET ?
    `;

  return db.query(sql, [+pageSize, +offset]);
};

const getAllUsersOfServer = async (
  serverId: number,
  search: string,
  sort: string,
  page: number,
  pageSize: number
) => {
  const sortArr = sort.split(' ');
  const direction = ['ASC', 'asc', 'DESC', 'desc'].includes(sortArr[1]) ? sortArr[1] : 'asc';
  const sortColumn = ['user_id', 'name', 'email'].includes(sortArr[0]) ? sortArr[0] : 'user_id';

  const offset = page ? (page - 1) * pageSize : 0;

  const sql = `
    SELECT
      sm.user_id as userId,
      u.name as userName,
      u.avatar as userAvatar,
      u.email as userEmail,
      sm.is_server_admin as isServerAdmin,
      sm.is_deleted as isDeleted,
      COUNT(*) OVER () AS totalDBItems

    FROM server_members sm
    LEFT JOIN (SELECT user_id, name, avatar, email FROM users) as u using(user_id)

    WHERE sm.is_deleted = 0 AND sm.server_id = ? AND ${
      search.length > 0
        ? `CONCAT_WS(',', user_id, name, email}
      )`
        : ' name '
    } Like '%${search}%'
    ORDER BY ${sortColumn} ${direction} 
    LIMIT ? OFFSET ?
  `;

  return db.query(sql, [+serverId, +pageSize, +offset]);
};

const create = async (user: UserType) => {
  const sql = `
    INSERT INTO users (
      password, 
      email,
      name,
      avatar,
      role
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  const result = await db.query(sql, [
    user.password,
    user.userEmail,
    user.userName,
    user?.userAvatar || null,
    user?.role || rolesEnum.basic
  ]);

  return getBy('user_id', result.insertId);
};

const update = async (user: UserType) => {
  const { userName, userEmail, createdAt, role, userId } = user;

  const sql = `
    UPDATE users SET
      name = ?,
      email = ?,
      avatar = ?,
      updated_at = ?,
      created_at = ?,
      role = ?
    WHERE user_id = ?
  `;

  await db.query(sql, [
    userName,
    userEmail,
    user.userAvatar || null,
    new Date().toLocaleDateString('en-US'),
    createdAt,
    role,
    userId
  ]);

  return getBy('user_id', userId);
};

const remove = async (userId: number) => {
  const sql = `
    UPDATE users SET
      is_deleted = 1
    WHERE user_id = ?
  `;

  await db.query(sql, [userId]);
  
  return getBy('user_id', userId, "admin");
};

const loginUser = async (email: string) => {
  const sql = `
    SELECT 
      user_id as userId,
      email, 
      name,
      password,
      role
    FROM users
    WHERE is_deleted = 0 AND email = ?
  `;

  const result = await db.query(sql, [email]);
  return result[0];
};

const logoutUser = async (token: string) => {
  const sql = `
    INSERT INTO tokens (
      token
    )
    VALUES( ? )
  `;
  return db.query(sql, [token]);
};

export default {
  getBy,
  getAll,
  getAllUsersOfServer,
  create,
  update,
  remove,
  loginUser,
  logoutUser
};
