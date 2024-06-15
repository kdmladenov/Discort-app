import Image from 'next/image';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';

const ServerList = () => {
  const servers: DiscordServer[] = [
    {
      id: uuid(),
      name: 'Server 1',
      image:
        'https://plus.unsplash.com/premium_photo-1661898424988-a5f6d40d3db2?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: uuid(),
      name: 'Server 2',
      image:
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D'
    }
  ];

    const [activeServer, setActiveServer] = useState<DiscordServer>();

    const checkIfUrl = (path: string): Boolean => {
      try {
        const _ = new URL(path);
        return true;
      } catch (_) {
        return false;
      }
    };

  return (
    <div className="bg-dark-gray h-full flex flex-col items-center">
      {servers.map((server) => {
        return (
          <button
            key={server.id}
            onClick={() => setActiveServer(server)}
            className={`p-4 sidebar-icon ${server.name === activeServer?.name ? 'selected-icon' : ''}`}
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
    </div>
  );

};

export default ServerList;
