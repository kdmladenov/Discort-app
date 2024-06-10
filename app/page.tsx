import { useClerk } from '@clerk/nextjs';
import { useCallback, useState } from 'react';
import { User } from 'stream-chat';
import { LoadingIndicator } from 'stream-chat-react';

export type Homestate = {
  apiKey: string;
  user: User;
  token: string;
};

export default function Home() {
  const [myState, setMyState] = useState<Homestate | undefined>(undefined);

  const { user: myUser } = useClerk();

  const registerUser = useCallback(
    async function registerUser() {
      // register user on Stream backend
      const userId = myUser?.id;
      const mail = myUser?.primaryEmailAddress?.emailAddress;
      if (userId && mail) {
        const streamResponse = await fetch('/api/register-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            email: mail
          })
        });
        const responseBody = await streamResponse.json();
        return responseBody;
      }
    },
    [myUser]
  );

  async function getUserToken(userId: string, userName: string) {
    const response = await fetch('/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId
      })
    });
    const responseBody = await response.json();
    const token = responseBody.token;

    if (!token) {
      console.error("Couldn't retrieve token.");
      return;
    }

    const user: User = {
      id: userId,
      name: userName,
      image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`
    };

    const apiKey = process.env.STREAM_API_KEY || '';

    if (apiKey) {
      setMyState({
        apiKey: apiKey,
        user: user,
        token: token
      });
    }
  }

  if (!myState) {
    return <LoadingIndicator />;
  }

  return <div>Welcome to discord</div>;
}
