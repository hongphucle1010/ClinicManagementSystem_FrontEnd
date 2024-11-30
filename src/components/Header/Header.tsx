import { useSelector } from 'react-redux'
import styles from './Header.module.scss'
import { Dropdown } from 'flowbite-react'
import { HiOutlineAdjustments } from 'react-icons/hi'
import { MdLogout } from 'react-icons/md'
import { RootState } from '../../lib/redux/store'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/logoHCMUT.png'

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value)
  const navigate = useNavigate()

  return (
    <div className='sticky w-full top-0 z-10'>
      <nav className='w-full flex h-14 p-2 items-center justify-around border-blue-500 border-b bg-white dark:bg-slate-900	dark:border-cyan-200 dark:text-slate-200'>
        <Link to='/' className={`${styles.header_name} flex h-4/5 myPointer items-center gap-1`}>
          <img src={logo} className='h-full' />
          <div className={`font-bold`}>HCMUT - SSPS</div>
        </Link>
        <div className='flex gap-14 w-3/4 justify-end font-bold'>
          <NavLink to='/' className={({ isActive }) => (isActive ? `${styles['active-link']}` : '')}>
            Trang chủ
          </NavLink>
          <NavLink to='/print' className={({ isActive }) => (isActive ? `${styles['active-link']}` : '')}>
            In tài liệu
          </NavLink>
          <NavLink to='/history' className={({ isActive }) => (isActive ? `${styles['active-link']}` : '')}>
            Lịch sử in
          </NavLink>

          <Dropdown label={user.name} arrowIcon={false} className={`shadow-md shadow-slate-200 z-10`} inline>
            <Dropdown.Item icon={HiOutlineAdjustments} onClick={() => navigate('/settings')}>
              Settings
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item icon={MdLogout} onClick={() => navigate('/logout')}>
              Log out
            </Dropdown.Item>
          </Dropdown>
        </div>
      </nav>
    </div>
  )
}

export default Header
