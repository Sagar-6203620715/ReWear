import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiBars3BottomRight, HiOutlineUser } from 'react-icons/hi2';
import { IoMdClose } from 'react-icons/io';
import SearchBar from './SearchBar';
import ChatDrawer from '../Layout/ChatDrawer';

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen);

  const handleUserIconClick = (e) => {
    if (isLoggedIn) {
      e.preventDefault(); // Prevent navigation to /login
      setShowDropdown((prev) => !prev); // Toggle dropdown
    }
  };

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="ml-[-10px]">
          <Link to="/" className="text-2xl font-medium">
            Coursify
          </Link>
        </div>

        {/* Middle Nav Links */}
        <div className="hidden md:flex space-x-6 ">
          {['Competitive Exams', 'Tech', 'Skills', 'School'].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase().replace(/\s+/g, '_')}`}

              className="text-gray-700 hover:text-black text-sm font-medium uppercase"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 mr-[-10px]">
          <Link 
            to="/admin"
            className="block bg-black px-2 rounded text-sm text-white"
          >
            Admin
          </Link>
          {/* User Icon */}
          <div className="relative">
            <Link to="/login" onClick={handleUserIconClick} className="hover:text-black">
              <HiOutlineUser className="h-6 w-6 text-gray-700" />
            </Link>

            {/* Dropdown if logged in */}
            {isLoggedIn && showDropdown && (
              <div className="absolute right-[-1] mt-2 w-28 bg-white border rounded shadow-md z-50">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="overflow-hidden">
            <SearchBar />
          </div>

          {/* Hamburger Menu */}
          <button className="md:hidden" onClick={toggleNavDrawer}>
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>

      <ChatDrawer />

      {/* Mobile Nav Drawer */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            {['Competitive Exams', 'Tech', 'Skills', 'School'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase().replace(/\s+/g, '_')}`}
                onClick={toggleNavDrawer}
                className="block text-gray-600 hover:text-black"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
