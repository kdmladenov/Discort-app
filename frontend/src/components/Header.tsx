import React from 'react';
import useTypedDispatch from '../hooks/useTypedDispatch';
import { useNavigate } from 'react-router-dom';
import { logout } from '../slices/auth';
import { Link } from 'react-router-dom';
import { Avatar, IconButton, useTheme } from '@mui/material';
import useTypedSelector from '../hooks/useTypedSelector';
import './Header.css';

const Header: React.FC<{
  colorMode: {
    toggleColorMode: () => void;
  };
}> = ({ colorMode }) => {
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const logoutHandler = () => {
    dispatch(logout());
    navigate('/');
  };

  const {
    userInfo: { name, avatar }
  } = useTypedSelector((state) => state.userLogin);

  return (
    <header>
      <p>{name ? name : 'Header'}</p>
      <button onClick={() => logoutHandler()}>Log out</button>
      <Link to="/login">Login</Link>
      <Link to="/profile">Profile</Link>
      <Avatar alt={name} src={avatar}>
        {name?.[0]}
      </Avatar>
      <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
        <i className={`fa fa-${theme.palette.mode === 'dark' ? 'sun' : 'moon'}`}></i>
      </IconButton>
    </header>
  );
};

export default Header;
