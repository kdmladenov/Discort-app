import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import CreateServerForm from './CreateServerForm';
import { useChatContext } from 'stream-chat-react';
import { Channel } from 'stream-chat';

const ServerList = () => {
  const { client } = useChatContext();

  const [activeServer, setActiveServer] = useState<DiscordServer>();
  const [serverList, setServerList] = useState<DiscordServer[]>([]);

  const loadServerList = useCallback(async (): Promise<void> => {
    const channels = await client.queryChannels({
      type: 'messaging',
      members: { $in: [client.userID as string] }
    });
    const serverSet: Set<DiscordServer> = new Set(
      channels
        .map((channel: Channel) => {
          return {
            id: channel.data?.data?.id,
            name: (channel.data?.data?.server as string) ?? 'Unknown',
            image: channel.data?.data?.image
          };
        })
        .filter((server: DiscordServer) => server.name !== 'Unknown')
        .filter(
          (server: DiscordServer, index, self) =>
            index === self.findIndex((serverObject) => serverObject.name == server.name)
        )
    );
    const serverArray = Array.from(serverSet.values());
    setServerList(serverArray);
    if (serverArray.length > 0) {
      setActiveServer(serverArray[0]);
    }
  }, [client]);

  const checkIfUrl = (path: string): Boolean => {
    try {
      const _ = new URL(path);
      return true;
    } catch (_) {
      return false;
    }
  };

    useEffect(() => {
      loadServerList();
    }, [loadServerList]);

  return (
    <div className="bg-dark-gray h-full flex flex-col items-center">
      {serverList.map((server) => {
        return (
          <button
            key={server.id}
            onClick={() => setActiveServer(server)}
            className={`p-4 sidebar-icon ${
              server.name === activeServer?.name ? 'selected-icon' : ''
            }`}
          >
            {server.image && checkIfUrl(server.image) ? (
              <Image
                src={server.image}
                alt={'Server Icon'}
                width={50}
                height={50}
                className="rounded-icon"
              />
            ) : (
              <span className="rounded-icon bg-gray-600 w-[50px] flex items-center justify-center text-sm">
                {server.name.charAt(0)}
              </span>
            )}
          </button>
        );
      })}
      <Link
        href={'/?createServer=true'}
        className="flex items-center justify-center rounded-icon bg-white text-green-500 hover:bg-green-500 hover:text-white hover:rounded-xl transition-all duration-200 p-2 my-2 text-2xl font-light h-12 w-12"
      >
        <span className="inline-block">+</span>
      </Link>
      <CreateServerForm />
    </div>
  );
};

export default ServerList;
