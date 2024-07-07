import { ChannelListMessengerProps } from 'stream-chat-react';

import { useDiscordContext } from '@/contexts/DiscordContext';
import ChannelListTopBar from './ServerList/TopBar/ChannelListTopBar';
// import CreateChannelForm from './CreateChannelForm/CreateChannelForm';
// import UserBar from './BottomBar/ChannelListBottomBar';
// import ChannelListTopBar from './TopBar/ChannelListTopBar';
// import CategoryItem from './CategoryItem/CategoryItem';
// import CallList from './CallList/CallList';

const CustomChannelList: React.FC<ChannelListMessengerProps> = () => {
  const { server, 
    // channelsByCategories
   } = useDiscordContext();

  return (
    <div className="w-72 bg-medium-gray h-full flex flex-col items-start">
      <ChannelListTopBar serverName={server?.name || 'Direct Messages'} />

    </div>
  );
};

export default CustomChannelList;
