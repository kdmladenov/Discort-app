export interface ChannelType {
  channelId: number;
  channelName: string;
  channelTypeId?: number;
  channelType: 'text' | 'audio' | 'video';
  serverId: number;
  serverName: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  isDeleted?: boolean;
}

export default ChannelType;
