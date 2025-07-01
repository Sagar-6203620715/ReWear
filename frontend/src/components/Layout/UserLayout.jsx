import React from 'react';
import Header from "../Common/Header";
import Footer from '../Common/Footer';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserLayout;