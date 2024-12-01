import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { TextInput, Table, Button } from 'flowbite-react'

// Define types for the Children data
interface ChildrenData {
  benh_nhi: string
  hoten: string
  thuoc_total: number
  dich_vu_total: number
  total: number
}

const ChildrenCostsPage: React.FC = () => {
  // State for search query and Children data
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [ChildrenData, setChildrenData] = useState<ChildrenData[]>([])

  const handleClick = () => {
    axios
      .get('http://localhost:4000/api/statistic/getchildrentcost/' + searchQuery)
      .then((response) => {
        setChildrenData(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data', error)
      })
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Thống kê về số tiền khám của trẻ </h1>

      {/* Search Input */}
      <div className='flex gap-4 mb-4'>
        <TextInput
          type='text'
          placeholder='Tìm thống kê về số tiền khám của trẻ em theo cccd phụ huynh'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='flex-grow'
        />
        <Button onClick={handleClick}>Tìm kiếm</Button>
      </div>

      {/* Children Data Table */}
      <Table>
        <Table.Head>
          <Table.HeadCell>Mã số </Table.HeadCell>
          <Table.HeadCell>Tên</Table.HeadCell>
          <Table.HeadCell>Tổng tiền thuốc</Table.HeadCell>
          <Table.HeadCell>Tổng tiền dịch vụ khám</Table.HeadCell>
          <Table.HeadCell>Tổng cộng</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {ChildrenData.length > 0 ? (
            ChildrenData.map((Children) => (
              <Table.Row key={Children.benh_nhi}>
                <Table.Cell>{Children.benh_nhi}</Table.Cell>
                <Table.Cell>{Children.hoten}</Table.Cell>
                <Table.Cell>{Children.thuoc_total}</Table.Cell>
                <Table.Cell>{Children.dich_vu_total}</Table.Cell>
                <Table.Cell>{Children.total}</Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell className='text-center' colSpan={5}>
                No data found
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ChildrenCostsPage
