'use client';

import { createContext, useContext, useState } from 'react';

type DiscordState = {};

const initialValue: DiscordState = {};

const DiscordContext = createContext<DiscordState>(initialValue);

export const DiscordContextProvider: any = ({ children }: { children: React.ReactNode }) => {
  const [myState, setMyState] = useState<DiscordState>(initialValue);

  const store: DiscordState = {};

  return <DiscordContext.Provider value={store}>{children}</DiscordContext.Provider>;
};

export const useDiscordContext = () => useContext(DiscordContext);
