import db from './pool.js';
import rolesEnum from '../constants/roles.enum.js';
import RolesType from '../models/RolesType.js';

const getAll = async (
  search: string,
  sort: string,
  page: number,
  pageSize: number
) => {
  const sortArr = sort.split(' ');
  const direction = ['ASC', 'asc', 'DESC', 'desc'].includes(sortArr[1]) ? sortArr[1] : 'asc';
  const sortColumn = ['createdAt', 'name'].includes(sortArr[0]) ? sortArr[0] : 'createdAt';
  const offset = (page - 1) * pageSize;

  const sql = `
    SELECT
    server_id as serverId,
    name as serverName,
    image as serverImage,
    created_at as createdAt,
    updated_at as updatedAt,
    is_deleted as isDeleted,
    COUNT(*) OVER () AS totalDBItems
    FROM servers
    WHERE is_deleted = 0 AND name Like '%${search}%'
    ORDER BY ${sortColumn} ${direction}
    LIMIT ? OFFSET ?
    `;
  return db.query(sql, [pageSize, offset]);
};

const getBy = async (key: string, value: string | number, role: RolesType = rolesEnum.basic) => {
  const sql = `
  SELECT
    server_id as serverId,
    name as serverName,
    image as serverImage,
    created_at as createdAt,
    updated_at as updatedAt,
    is_deleted as isDeleted

    FROM servers
    
  WHERE ${key} = ? ${role === rolesEnum.basic ? 'AND is_deleted = 0' : ''}
  `;
  const result = await db.query(sql, [value]);

  return result[0];
};

const getAllByUser = async (
  userId: number,
  search: string,
  sort: string,
  page: number,
  pageSize: number
) => {
  const sortArr = sort.split(' ');
  const direction = ['ASC', 'asc', 'DESC', 'desc'].includes(sortArr[1]) ? sortArr[1] : 'asc';
  const sortColumn = ['sm.server_id', 's.name'].includes(sortArr[0]) ? sortArr[0] : 'sm.server_id';
  const offset = (page - 1) * pageSize;

    const sql = `
    SELECT
      sm.server_id as serverId,
      sm.user_id as userId,
      s.name as serverName,
      s.image as serverImage,
      sm.is_server_admin as isServerAdmin,
      sm.is_deleted as isDeleted

    FROM server_members sm
    LEFT JOIN (SELECT server_id, name, image FROM servers) as s using(server_id)

    WHERE sm.is_deleted = 0 AND sm.user_id = ? AND s.name Like '%${search}%'
    ORDER BY ${sortColumn} ${direction}
    LIMIT ? OFFSET ?
  `;
  return db.query(sql, [userId, pageSize, offset]);
};

const getServerByUser = async (userId: number, serverName: string) => {
  const sql = `
    SELECT
      sm.server_id as serverId,
      s.name as serverName,
      s.image as serverImage,
      sm.user_id as userId,
      u.name as userName,
      u.avatar as userAvatar,
      sm.is_server_admin as isServerAdmin,
      sm.is_deleted as isDeleted

    FROM server_members sm
    LEFT JOIN (SELECT server_id, name, image FROM servers) as s using(server_id)
    LEFT JOIN (SELECT user_id, name, avatar FROM users) as u using(user_id)

    WHERE sm.is_deleted = 0 AND sm.user_id = ? AND s.name LIKE '%${serverName}%'
  `;
  const result = await db.query(sql, [userId]);

  return result[0];
};

const addServerMember = async (userId: number, serverId: number, isAdmin: boolean = false) => {
  const sql = `
    INSERT INTO server_members (
      user_id,
      server_id,
      is_server_admin
    )
    VALUES (?, ?, ?)
  `;
  return await db.query(sql, [userId, serverId, isAdmin]);
};

const create = async (name: string, image: string, userId: number) => {
  const sql = `
    INSERT INTO servers (
      name,
      image
    )
    VALUES (?, ?)
  `;
  const newServer = await db.query(sql, [name, image]);

  await addServerMember(+userId, +newServer.insertId, true);

  return getBy('server_id', newServer.insertId, 'basic');
};

const update = async (
  serverId: number,
  name: string,
  image: string
) => {
  const sql = `
    UPDATE servers SET
      name = ?,
      image = ?,
      updated_at = CURRENT_TIMESTAMP()
    WHERE server_id = ?
  `;
  await db.query(sql, [name, image, serverId]);

  return getBy('server_id', serverId, 'basic');
};

const remove = async (serverId: number) => {
  const sql = `
    UPDATE servers
    SET is_deleted = true
    WHERE server_id = ? 
  `;
  return db.query(sql, [serverId]);
};


export default {
  getAll,
  getAllByUser,
  getBy,
  create,
  update,
  remove,
  getServerByUser,
  addServerMember
};
