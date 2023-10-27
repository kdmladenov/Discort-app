export interface ServerType {
  serverId: number;
  serverName: string;
  serverImage: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  isDeleted?: boolean;
  isServerAdmin?: boolean;
}

export default ServerType;
