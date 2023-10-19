import UserInfoType from './UserInfoType';
import UserType from './UserType';

interface UsersData {
  getBy: (
    column: string,
    value: string | number,
    role?: RolesType
  ) => Promise<UserType>;
  getAll: (
    search: string,
    sort: string,
    page: number,
    pageSize: number,
    role: RolesType
  ) => Promise<UserType[]>;
  getAllUsersOfServer: (
    serverId: number,
    search: string,
    sort: string,
    page: number,
    pageSize: number
  ) => Promise<UserType[]>;
  create: (user: UserType) => Promise<UserType>;
  update: (user: UserType) => Promise<UserType>;
  remove: (userId: number) => Promise<UserType>;
  loginUser: (email: string) => Promise<Payload>;
  logoutUser: (token: string) => Promise<void>;
}

export default UsersData;
