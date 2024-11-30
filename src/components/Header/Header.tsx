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
        </div>
      </nav>
    </div>
  )
}

export default Header
