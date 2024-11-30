import styles from './Header.module.scss'
import { Link } from 'react-router-dom'
import logo from '../../assets/logoHCMUT.png'

const GuestHeader: React.FC = () => {
  return (
    <div className='sticky w-full top-0 z-10'>
      <nav className='w-full flex h-14 p-2 items-center justify-around border-blue-500 border-b dark:bg-slate-900	dark:border-cyan-200 dark:text-slate-200'>
        <Link to='/' className={`${styles.header_name} flex h-4/5 myPointer items-center gap-1`}>
          <img src={logo} className='h-full' />
          <div className={`font-bold`}>HCMUT - SSPS</div>
        </Link>
        <div className='flex gap-14 w-3/4 justify-end font-bold'>
          <Link to='/login'>Đăng nhập</Link>
        </div>
      </nav>
    </div>
  )
}

export default GuestHeader
