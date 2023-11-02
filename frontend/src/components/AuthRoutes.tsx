import { Navigate, Outlet } from 'react-router-dom';
import useTypedSelector from '../hooks/useTypedSelector';

const AuthRoutes = () => {
  const { userInfo } = useTypedSelector((state) => state.userLogin);

  return userInfo?.token ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthRoutes;
