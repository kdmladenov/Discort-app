import { RootState } from '../store';

const getTokenConfig = (getState: () => RootState) => {
  const { userLogin } = getState();

  return {
    headers: {
      Authorization: `Bearer ${userLogin.userInfo.token}`
    }
  };
};
export default getTokenConfig;