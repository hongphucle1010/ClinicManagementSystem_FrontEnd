import React, { useState } from 'react'
import { Button, Datepicker, Table, TextInput } from 'flowbite-react'
// import { useEffect } from 'react'
// import { useLocation } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom'
import { getDrugHistoryApi } from '../api/benhnhi'
import { getBillHistoryApi, getSumBillHistoryApi } from '../api/hoadon'
// import { Bounce, toast } from 'react-toastify'

const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const DrugManagement: React.FC = () => {
  const [searchTermDrug, setSearchTermDrug] = useState<string>('e0be6c97-f834-4a73-8df4-bf06f782eec3')
  const handleSearchDrug = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e)
    setSearchTermDrug(e.target.value)
  }
  const [pillsInfo, setPillsInfo] = useState([] as Drug[])
  const submitFormDrug = () => {
    console.log('clicked', searchTermDrug)
    const queryParams = new URLSearchParams({ searchTermDrug })
    getDrugHistoryApi(queryParams).then((res) => {
      console.log(res.pills)
      setPillsInfo(res.pills)
    })
  }

  const [searchFromDay, setSearchFromDay] = useState<Date>(new Date('2023-11-23'))
  const [searchToDay, setSearchToDay] = useState<Date>(new Date('2025-11-23'))
  const [searchBill, setSearchBill] = useState(0)
  const [BillsInfo, setBillsInfo] = useState([] as Bill[])
  // const [billInfo, setBillInfo] = useState(0)
  const submitFormBill = () => {
    const queryParams = new URLSearchParams({
      from: formatDate(searchFromDay as Date),
      to: formatDate(searchToDay as Date)
    })
    getSumBillHistoryApi(queryParams).then((res) => {
      console.log(res)
      setSearchBill(res.total_fee)
      // setPillsInfo(res.pills)
    })

    getBillHistoryApi(queryParams).then((res) => {
      console.log(res)
      setBillsInfo(res.rows)
    })
  }

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div>
        <div className='text-2xl font-bold mb-6'>Drug Management</div>

        {/* Search Bar */}
        <div className='mb-4'>
          <TextInput
            id='search'
            type='text'
            placeholder='Search by Exam ID or Patient ID'
            value={searchTermDrug}
            onChange={handleSearchDrug}
          />
        </div>

        {/* Add Child Button */}
        <div className='mb-6'>
          <Button onClick={submitFormDrug}>Search</Button>
        </div>
        <div className='mb-4'>Số lượng: {pillsInfo.length} </div>

        {/* Children Table */}
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell>Tên</Table.HeadCell>
            <Table.HeadCell>Dạng</Table.HeadCell>
            <Table.HeadCell>Giá tiền </Table.HeadCell>
            <Table.HeadCell>Tổng số lượng</Table.HeadCell>
            <Table.HeadCell>Tổng giá tiền</Table.HeadCell>
            <Table.HeadCell>Mã số</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
            {pillsInfo.map((pill, index) => (
              <Table.Row key={index} className='bg-white hover:bg-gray-100'>
                <Table.Cell>{pill.ten}</Table.Cell>
                <Table.Cell>{pill.dang}</Table.Cell>
                <Table.Cell>{pill.tong_gia_tien / pill.tong_so_luong}</Table.Cell>
                <Table.Cell>{pill.tong_so_luong}</Table.Cell>
                <Table.Cell>{pill.tong_gia_tien}</Table.Cell>
                <Table.Cell>{pill.ms}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <div>
        <div className='text-2xl font-bold mb-6'>Bills Management</div>

        <Datepicker
          value={searchFromDay}
          onChange={(e) => {
            setSearchFromDay(e as Date)
          }}
        />
        <Datepicker
          value={searchToDay}
          onChange={(e) => {
            setSearchToDay(e as Date)
          }}
        />
        {/* Add Child Button */}
        <div className='mb-6'>
          <Button onClick={submitFormBill}>Search</Button>
        </div>

        <div className='mb-4'>Tổng hóa đơn: {searchBill} </div>
        <div className='mb-4'>Số lượng hóa đơn: {BillsInfo.length} </div>

        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell>Mã số</Table.HeadCell>
            <Table.HeadCell>Ngày tạo</Table.HeadCell>
            <Table.HeadCell>Tổng tiền</Table.HeadCell>
            <Table.HeadCell>Họ tên bệnh nhi</Table.HeadCell>
            <Table.HeadCell>Họ tên phụ huynh</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
            {BillsInfo.map((bill, index) => (
              <Table.Row key={index} className='bg-white hover:bg-gray-100'>
                <Table.Cell>{bill.maso}</Table.Cell>
                <Table.Cell>{bill.ngaytao}</Table.Cell>
                <Table.Cell>{bill.tongtien}</Table.Cell>
                <Table.Cell>{bill.hoten_bn}</Table.Cell>
                <Table.Cell>{bill.hoten_ph}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}

// e0be6c97-f834-4a73-8df4-bf06f782eec3
// Child Form Component

export default DrugManagement
