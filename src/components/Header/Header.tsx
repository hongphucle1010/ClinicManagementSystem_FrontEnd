import styles from './Header.module.scss'
import { NavLink } from 'react-router-dom'

const Header: React.FC = () => {
  return (
    <div className='sticky w-full top-0 z-10'>
      <nav className='w-full flex h-14 p-2 items-center justify-around border-blue-500 border-b bg-white dark:bg-slate-900	dark:border-cyan-200 dark:text-slate-200'>
        <div className='flex gap-14 font-bold'>
          <NavLink to='/' className={({ isActive }) => (isActive ? `${styles['active-link']}` : '')}>
            Trang chủ
          </NavLink>
          <NavLink to='/children' className={({ isActive }) => (isActive ? `${styles['active-link']}` : '')}>
            Trẻ em
          </NavLink>
          <NavLink to='/parent' className={({ isActive }) => (isActive ? `${styles['active-link']}` : '')}>
            Phụ huynh
          </NavLink>
          <NavLink to='/medicalexamination' className={({ isActive }) => (isActive ? `${styles['active-link']}` : '')}>
            Buổi khám bệnh
          </NavLink>
          <NavLink to='/childrendrug' className={({ isActive }) => (isActive ? `${styles['active-link']}` : '')}>
            Lịch sử thuốc của trẻ
          </NavLink>
          <NavLink to='/doctor' className={({ isActive }) => (isActive ? `${styles['active-link']}` : '')}>
            Bác Sĩ
          </NavLink>
          <NavLink to='/prescription' className={({ isActive }) => (isActive ? `${styles['active-link']}` : '')}>
            Hóa đơn
          </NavLink>

          <NavLink to='/statistics' className={({ isActive }) => (isActive ? `${styles['active-link']}` : '')}>
            Thống kê
          </NavLink>
          <NavLink to='/drugs' className={({ isActive }) => (isActive ? `${styles['active-link']}` : '')}>
            Thuốc
          </NavLink>
          <NavLink to='/services' className={({ isActive }) => (isActive ? `${styles['active-link']}` : '')}>
            Dịch vụ khám
          </NavLink>
        </div>
      </nav>
    </div>
  )
}

export default Header
