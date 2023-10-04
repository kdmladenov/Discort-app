import ChannelType from './ChannelType';

interface ChannelsData {
  getAll: (
    serverId: number,
    search: string,
    sort: string,
    page: number,
    pageSize: number
  ) => Promise<ChannelType[]>;
  getBy: (key: string, value: string | number, role?: RolesType) => Promise<ChannelType>;
  getChannelByName: (serverId: number, channelName: string) => Promise<ChannelType>;
  create: (name: string, channelType: string, serverId: number) => Promise<ChannelType>;
  update: (updateChannelsData: ChannelType) => Promise<ChannelType>;
  remove: (channelId: number) => Promise<ChannelType>;
}

export default ChannelsData;
