import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../components/Header/Header'
// import Footer from "../../components/Footer/Footer.tsx";

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={`min-h-screen`}>
      <Header />
      {children}
      <Outlet />
      {/* <Footer /> */}
    </div>
  )
}

export default MainLayout
