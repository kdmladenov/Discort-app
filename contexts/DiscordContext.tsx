'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { v4 as uuid } from 'uuid';

type DiscordState = {
  createServer: (
    client: StreamChat,
    name: string,
    imageUrl: string,
    userIds: string[]
  ) => void;
};

const initialValue: DiscordState = {
  createServer: () => {}
};

const DiscordContext = createContext<DiscordState>(initialValue);

export const DiscordContextProvider: any = ({ children }: { children: React.ReactNode }) => {
  const [myState, setMyState] = useState<DiscordState>(initialValue);

  const createServer = useCallback(
    async (
      client: StreamChat,
      name: string,
      imageUrl: string,
      userIds: string[]
    ) => {
      const messagingChannel = client.channel('messaging', uuid(), {
        name: 'Welcome',
        members: userIds,
        data: {
          image: imageUrl,
          server: name,
          category: 'Text Channels'
        }
      });

      try {
        const response = await messagingChannel.create();
        console.log('[DiscordContext - createServer] Response: ', response);
      } catch (err) {
        console.error(err);
      }
    },
    []
  );
  const store: DiscordState = {
    createServer: createServer
  };

  return <DiscordContext.Provider value={store}>{children}</DiscordContext.Provider>;
};

export const useDiscordContext = () => useContext(DiscordContext);
