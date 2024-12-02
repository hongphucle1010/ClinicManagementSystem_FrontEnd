import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Chatbot from '../../components/Chatbot/Chatbot.tsx'
// import Footer from "../../components/Footer/Footer.tsx";

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={`h-screen flex flex-col overflow-hidden`}>
      <Header />
      <div className='flex-1 overflow-auto p-0 m-0'>{children}</div>
      <Outlet />
      <Chatbot />
      {/* <Footer /> */}
    </div>
  )
}

export default MainLayout
