import React from 'react'
import Header from "../Common/Header";
import Footer from '../Common/Footer';
import { FiLayout } from 'react-icons/fi';
import { Outlet } from 'react-router-dom';
const userLayout = () => {
  return (
    <>
      {/* header */}
      <Header/>
      {/* main content */}
      <main>
        <Outlet/>
      </main>
      {/* footer */}
      <Footer/>
    </>
  )
}

export default userLayout