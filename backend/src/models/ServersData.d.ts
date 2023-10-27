import ServerType from './ServerType';


interface ServersData {
  getAll: (
    search: string,
    sort: string,
    page: number,
    pageSize: number
  ) => Promise<ServerType[]>;
  getAllByUser: (
    userId: number,
    search: string,
    sort: string,
    page: number,
    pageSize: number
  ) => Promise<ServerType[]>;
  getBy: (key: string, value: string | number, role?: RolesType) => Promise<ServerType>;
  create: (name: string, image: string, userId: number) => Promise<ServerType>;
  update: (serverId: number, name: string, image: string) => Promise<any>;
  remove: (serverId: number) => Promise<any>;
  getServerByUser: (userId: number, serverName: string) => Promise<ServerType>;
  addServerMember: (
    userId: number,
    serverId: number,
    isAdmin: boolean = false
  ) => Promise<ServerType>;
}

export default ServersData;
