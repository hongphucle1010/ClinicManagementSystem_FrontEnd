import { Button } from 'flowbite-react'
import image from '../assets/image.png'
import { FaAngleDoubleRight } from 'react-icons/fa'

const LandingPage: React.FC = () => {
  return (
    <div className='flex w-full h-full m-0'>
      <div className='w-1/2 h-full flex justify-center flex-col pl-20'>
        <div className='flex flex-col gap-2'>
          <div>
            <p className='text-3xl font-bold'>"Chăm sóc bé yêu, an tâm mỗi ngày"</p>
            <p className='italic'>Đặt lịch khám chỉ với vài cú click</p>
          </div>
          <div>
            <Button gradientMonochrome='info'>
              <p className='flex justify-center items-center gap-2'>
                <span>Đăng kí khám ngay</span>
                <FaAngleDoubleRight />
              </p>
            </Button>
          </div>
        </div>
      </div>
      <div className='w-1/2 flex items-center pl-8 h-full'>
        <img
          src={image}
          alt='doctor'
          className='rounded-xl'
          style={{
            height: '95%'
          }}
        />
      </div>
    </div>
  )
}

export default LandingPage
