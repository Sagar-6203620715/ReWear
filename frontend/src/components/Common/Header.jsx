import React from 'react';
import Topbar from '../Layout/Topbar';
import Navbar from './Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const isLoggedIn = !!user;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="border-b border-gray-200">
      {/* topbar */}
      <Topbar />
      {/* navbar */}
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} user={user} />
    </header>
  );
};

export default Header;
