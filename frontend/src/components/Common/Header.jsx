import React from 'react';
import Topbar from '../Layout/Topbar';
import Navbar from './Navbar';

const Header = () => {
  const handleLogout = () => {
    console.log("Logged out");
    // You can also clear auth tokens or reset global state here
  };

  return (
    <header className="border-b border-gray-200">
      {/* topbar */}
      <Topbar />
      {/* navbar */}
      <Navbar isLoggedIn={true} handleLogout={handleLogout} />
    </header>
  );
};

export default Header;
