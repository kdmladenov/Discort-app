import db from './pool.js';
import rolesEnum from '../constants/roles.enum.js';
import RolesType from '../models/RolesType.js';
import ChannelType from '../models/ChannelType.js';

const getAll = async (
  serverId: number,
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
    c.channel_id as channelId,
    c.name as channelName,
    c.channel_type_id as channelTypeId,
    c.server_id as serverId, 
    s.name as serverName,
    c.created_at as createdAt,
    c.updated_at as updatedAt,
    c.is_deleted as isDeleted,
    COUNT(*) OVER () AS totalDBItems

    FROM channels c
    LEFT JOIN (SELECT server_id, name, image FROM servers) as s using(server_id)
    WHERE c.is_deleted = 0 AND server_id = ? AND s.name Like '%${search}%'
    ORDER BY ${sortColumn} ${direction}
    LIMIT ? OFFSET ?
    `;
  return db.query(sql, [+serverId, pageSize, offset]);
};

const getBy = async (key: string, value: string | number, role: RolesType = rolesEnum.basic) => {
  const sql = `
  SELECT
    c.channel_id as channelId,
    c.name as channelName,
    c.channel_type_id as channelTypeId,
    c.server_id as serverId, 
    s.name as serverName,
    c.created_at as createdAt,
    c.updated_at as updatedAt,
    c.is_deleted as isDeleted

    FROM channels c
    LEFT JOIN (SELECT server_id, name, image FROM servers) as s using(server_id)

    
  WHERE ${key} = ? ${role === rolesEnum.basic ? 'AND c.is_deleted = 0' : ''}
  `;
  const result = await db.query(sql, [value]);

  return result[0];
};

const getChannelByName = async (serverId: number, channelName: string) => {
  const sql = `
  SELECT
    c.channel_id as channelId,
    c.name as channelName,
    c.channel_type_id as channelTypeId,
    c.server_id as serverId, 
    s.name as serverName,
    c.created_at as createdAt,
    c.updated_at as updatedAt,
    c.is_deleted as isDeleted

    FROM channels c
    LEFT JOIN (SELECT server_id, name, image FROM servers) as s using(server_id)
    
    WHERE server_id = ? AND s.name Like '%${channelName}%' AND c.is_deleted = 0
  `;
  const result = await db.query(sql, [serverId]);

  return result[0];
};

const create = async (name: string, channelType: string, serverId: number) => {
  const sql = `
    INSERT INTO channels (
      name,
      channel_type_id,
      server_id
    )
    VALUES (?, (SELECT channel_type_id FROM channel_types WHERE channel_type = ?), ?)
  `;
  const newChannel = await db.query(sql, [name, channelType, serverId]);

  return getBy('channel_id', newChannel.insertId, 'basic');
};

const update = async (channelUpdate: ChannelType) => {
  const { channelName, channelType, channelId } = channelUpdate;

  const sql = `
    UPDATE channels SET
      name = ?,
      channel_type_id = (SELECT channel_type_id FROM channel_types WHERE channel_type = ?)
    WHERE channel_id = ?
  `;
  await db.query(sql, [channelName, channelType, channelId]);

  return getBy('channel_id', channelId, 'basic');
};

const remove = async (channelId: number) => {
  const sql = `
    UPDATE channels
    SET is_deleted = true
    WHERE channel_id = ? 
  `;
  await db.query(sql, [channelId]);

  return getBy('channel_id', channelId, 'admin');
};

export default {
  getAll,
  getBy,
  getChannelByName,
  create,
  update,
  remove
};
