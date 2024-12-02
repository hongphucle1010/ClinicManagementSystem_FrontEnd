import React, { useState } from 'react'
import { Button, Datepicker, Table, TextInput } from 'flowbite-react'
// import { useEffect } from 'react'
// import { useLocation } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom'
import { getDrugHistoryApi, getDrugHistoryV2Api } from '../api/benhnhi'
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
  const [pillsV2, setPillsV2] = useState([] as DrugWithDate[])
  const submitFormDrug = () => {
    console.log('clicked', searchTermDrug)
    const queryParams = new URLSearchParams({ searchTermDrug })
    getDrugHistoryApi(queryParams).then((res) => {
      console.log(res.pills)
      setPillsInfo(res.pills)
    })
    getDrugHistoryV2Api(queryParams).then((res) => {
      console.log(res.pills)
      setPillsV2(res.pills)
    })
  }

  const [searchFromDay, setSearchFromDay] = useState<Date>(new Date('2023-11-23'))
  const [searchToDay, setSearchToDay] = useState<Date>(new Date('2025-11-23'))
  const [searchBill, setSearchBill] = useState(0)
  const [BillsInfo, setBillsInfo] = useState([] as Bill[])
  // const [billInfo, setBillInfo] = useState(0)
  const clearDrug = () => {
    setSearchTermDrug('')
    setPillsInfo([])
    setPillsV2([])
  }

  const clearBill = () => {
    setSearchFromDay(new Date('2023-11-23'))
    setSearchToDay(new Date('2025-11-23'))
    setSearchBill(0)
    setBillsInfo([])
  }
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
        <div className='text-4xl font-bold mb-6'>Drug Management</div>

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
        <div className='mb-6 flex justify-start'>
          <Button onClick={submitFormDrug}>Search</Button>
          <Button onClick={clearDrug} className='ml-4'>
            Clear
          </Button>
        </div>

        <div className='mb-4'>Thông tin cụ thể. Số lượng: {pillsV2.length} </div>

        <Table striped hoverable={true}>
          <Table.Head>
            <Table.HeadCell>Tên</Table.HeadCell>
            <Table.HeadCell>Dạng</Table.HeadCell>
            <Table.HeadCell>Số lượng</Table.HeadCell>
            <Table.HeadCell>Thời gian khám</Table.HeadCell>
            <Table.HeadCell>Mã số</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
            {pillsV2.map((pill, index) => (
              <Table.Row key={index} className='bg-white hover:bg-gray-100'>
                <Table.Cell>{pill.ten}</Table.Cell>
                <Table.Cell>{pill.dang}</Table.Cell>
                <Table.Cell>{pill.so_luong}</Table.Cell>
                <Table.Cell>{pill.thoi_gian_kham}</Table.Cell>
                <Table.Cell>{pill.ms}</Table.Cell>
              </Table.Row>
            ))}

            {pillsInfo.length === 0 && (
              <Table.Row>
                <Table.Cell className='text-center' colSpan={5}>
                  No data found
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>

        <div className='mb-4 mt-8'>Thông tin tổng thế. Số lượng: {pillsInfo.length} </div>

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

            {pillsInfo.length === 0 && (
              <Table.Row>
                <Table.Cell className='text-center' colSpan={5}>
                  No data found
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      <div>
        <div className='text-4xl font-bold mb-6 mt-24'>Bills Management</div>
        <div className='flex justify-start'>
          <Datepicker
            value={searchFromDay}
            onChange={(e) => {
              setSearchFromDay(e as Date)
            }}
            title='Day From'
          />
          <Datepicker
            value={searchToDay}
            onChange={(e) => {
              setSearchToDay(e as Date)
            }}
            title='Day To'
            className='ml-4'
          />
        </div>
        {/* Add Child Button */}
        <div className='mb-6 mt-4 flex justify-start'>
          <Button onClick={submitFormBill}>Search</Button>
          <Button onClick={clearBill} className='ml-4'>
            Clear
          </Button>
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
            {BillsInfo.length === 0 && (
              <Table.Row>
                <Table.Cell className='text-center' colSpan={5}>
                  No data found
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}

// e0be6c97-f834-4a73-8df4-bf06f782eec3
// Child Form Component

export default DrugManagement
