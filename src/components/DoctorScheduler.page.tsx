import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { TextInput, Button, Table } from 'flowbite-react'

interface DoctorSchedule {
  cccd: string
  hoten: string
  sdt: string
  chuyenkhoa: string
  so_luong_kham: number
}

const DoctorScheduleComponent: React.FC = () => {
  const [ngay, setNgay] = useState<string>('2024-12-01')
  const [soluong, setSoluong] = useState<number>(1)
  const [data, setData] = useState<DoctorSchedule[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const fetchDoctorSchedules = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get(`http://localhost:4000/api/statistic/getbuoikhambenhbacsi`, {
        params: { ngay, soluong }
      })
      if (response.data.message === 'Danh sách bác sĩ buổi khám') {
        setData(response.data.data)
      } else {
        setData([])
      }
    } catch (err: any) {
      setError(err.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctorSchedules()
  }, [ngay, soluong])

  return (
    <div className='p-6'>
      <div className='mb-4 flex gap-3'>
        <div className='flex-grow'>
          <label htmlFor='ngay' className='block text-sm font-medium text-gray-700'>
            Ngày khám
          </label>
          <TextInput id='ngay' type='date' value={ngay} onChange={(e) => setNgay(e.target.value)} className='w-full' />
        </div>
        <div className='flex-grow'>
          <label htmlFor='soluong' className='block text-sm font-medium text-gray-700'>
            Số lượng buổi khám
          </label>
          <TextInput
            id='soluong'
            type='number'
            value={soluong}
            onChange={(e) => setSoluong(Number(e.target.value))}
            className='w-full'
          />
        </div>
        <Button onClick={fetchDoctorSchedules} className='mt-4'>
          Tìm kiếm
        </Button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className='text-red-500'>{error}</div>
      ) : (
        <Table>
          <Table.Head>
            <Table.HeadCell>CCCD</Table.HeadCell>
            <Table.HeadCell>Họ tên</Table.HeadCell>
            <Table.HeadCell>Số điện thoại</Table.HeadCell>
            <Table.HeadCell>Chuyên khoa</Table.HeadCell>
            <Table.HeadCell>Số lượng khám</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {data.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell>{item.cccd.replace(/(\d{4})(?=\d)/g, '$1 ')}</Table.Cell>
                <Table.Cell>{item.hoten}</Table.Cell>
                <Table.Cell>{item.sdt.replace(/(\d{3})(\d{4})(\d{3})/, '$1 $2 $3')}</Table.Cell>
                <Table.Cell>{item.chuyenkhoa}</Table.Cell>
                <Table.Cell>{item.so_luong_kham}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  )
}

export default DoctorScheduleComponent
