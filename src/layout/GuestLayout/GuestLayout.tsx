import React from 'react'
import { Outlet } from 'react-router-dom'
// import Footer from "../../components/Footer/Footer.tsx";
import GuestHeader from '../../components/Header/GuestHeader.tsx'

const GuestLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={`min-h-screen`}>
      <GuestHeader />
      {children}
      <Outlet />
      {/* <Footer /> */}
    </div>
  )
}

export default GuestLayout
