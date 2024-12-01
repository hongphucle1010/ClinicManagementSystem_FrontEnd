import React, { useState } from 'react'
import { Button, Datepicker, Table, TextInput } from 'flowbite-react'
// import { useEffect } from 'react'
// import { useLocation } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom'
import { getDrugHistoryApi } from '../api/benhnhi'
import { getBillHistoryApi } from '../api/hoadon'
// import { Bounce, toast } from 'react-toastify'

const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const DrugManagement: React.FC = () => {
  const [searchTermDrug, setSearchTermDrug] = useState<string>('')
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

  const [searchFromDay, setSearchFromDay] = useState<Date>()
  const [searchToDay, setSearchToDay] = useState<Date>()
  const [searchBill, setSearchBill] = useState(0)
  // const [billInfo, setBillInfo] = useState(0)
  const submitFormBill = () => {
    // console.log('from', formatDate(searchFromDay as Date))
    // console.log('to', formatDate(searchToDay as Date))
    const queryParams = new URLSearchParams({
      // doctor_id: searchDocterId,
      from: formatDate(searchFromDay as Date),
      to: formatDate(searchToDay as Date)
    })
    getBillHistoryApi(queryParams).then((res) => {
      console.log(res)
      setSearchBill(res.total_fee)
      // setPillsInfo(res.pills)
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
          <Button onClick={submitFormDrug}>Add Child</Button>
        </div>

        {/* Children Table */}
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell>Ten</Table.HeadCell>
            <Table.HeadCell>Dang</Table.HeadCell>
            <Table.HeadCell>Gia Ca</Table.HeadCell>
            <Table.HeadCell>So Luong </Table.HeadCell>
            <Table.HeadCell>Ma So </Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
            {pillsInfo.map((pill, index) => (
              <Table.Row key={index} className='bg-white hover:bg-gray-100'>
                <Table.Cell>{pill.ten}</Table.Cell>
                <Table.Cell>{pill.dang}</Table.Cell>
                <Table.Cell>{pill.giaca}</Table.Cell>
                <Table.Cell>{pill.soluong}</Table.Cell>
                <Table.Cell>{pill.ms}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <div>
        <div className='text-2xl font-bold mb-6'>Bills Management</div>

        {/* Search Bar */}
        {/* <div className='mb-4'>
          <TextInput
            id='search'
            type='text'
            placeholder='Search by Exam ID or Patient ID'
            value={searchDoctorId}
            onChange={}
          />
        </div> */}

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
          <Button onClick={submitFormBill}>Search Bill</Button>
        </div>

        <div className='mb-4'> {searchBill} </div>
      </div>
    </div>
  )
}

// e0be6c97-f834-4a73-8df4-bf06f782eec3
// Child Form Component

export default DrugManagement
