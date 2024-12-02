import React, { useState } from 'react'
import { Button, Datepicker, Table, TextInput } from 'flowbite-react'
import { getBKBHistoryApi } from '../api/bacsi'

const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const BacSiManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('123456789012')

  const [searchFromDay, setSearchFromDay] = useState<Date>(new Date('2023-01-01'))
  const [searchToDay, setSearchToDay] = useState<Date>(new Date('2025-01-31'))
  // const [billInfo, setBillInfo] = useState(0)

  const [bkbInfo, setBkbInfo] = useState([] as BKB[])
  const submitForm = () => {
    const queryParams = new URLSearchParams({
      cccd: searchTerm,
      from: formatDate(searchFromDay as Date),
      to: formatDate(searchToDay as Date)
    })
    // console.log(searchTerm, searchFromDay, searchToDay)
    getBKBHistoryApi(queryParams).then((res) => {
      console.log(res)
      setBkbInfo(res)
      // setPillsInfo(res.pills)
    })
  }

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div>
        <div className='text-2xl font-bold mb-6'>Buoi kham cua Bac Si</div>
        {/* Search Bar */}
        <div className='mb-4'>
          <TextInput
            id='search'
            type='text'
            placeholder='Search by Doctor CCCD'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
          <Button onClick={submitForm}>Get</Button>
        </div>

        {/* Children Table */}
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell>Maso</Table.HeadCell>
            <Table.HeadCell>Ten Benh Nhi</Table.HeadCell>
            <Table.HeadCell>MS Benh Nhi</Table.HeadCell>
            <Table.HeadCell>Trang thai</Table.HeadCell>
            <Table.HeadCell>Ngay kham</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
            {bkbInfo.map((bkb, index) => (
              <Table.Row key={index} className='bg-white hover:bg-gray-100'>
                <Table.Cell>{bkb.bkb_maso}</Table.Cell>
                <Table.Cell>{bkb.ten_bn}</Table.Cell>
                <Table.Cell>{bkb.benh_nhi_maso}</Table.Cell>
                <Table.Cell>{bkb.trangthai}</Table.Cell>
                <Table.Cell>{bkb.ngaykham}</Table.Cell>
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

export default BacSiManagement
