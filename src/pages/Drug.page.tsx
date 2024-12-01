import React, { useState } from 'react'
import { Button, Table, TextInput } from 'flowbite-react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { getChildrenInfoApi, getDrugHistoryApi } from '../api/benhnhi'
import { Bounce, toast } from 'react-toastify'

type Child = {
  maso: string
  hoten: string
  ngaysinh: string
  gioitinh: 'Male' | 'Female'
  chieucao: number
  cannang: number
  bmi: number
  tiensubenh: string
  masobhyt: string
  cccd: string
  quanhe: string
}

const DrugManagement: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([])

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)
  const location = useLocation()

  const filteredChildren = children.filter(
    (child) => child.hoten.toLowerCase().includes(searchTerm.toLowerCase()) || child.cccd.includes(searchTerm)
  )

  const handleViewButton = (cccd: string) => {
    // Redirect to Parent Detail Page
    navigate(`/medicalexamination?benhnhi_id=${cccd}`)
  }

  const submitForm = () => {
    console.log('clicked', searchTerm)
    const queryParams = new URLSearchParams(searchTerm)
    getDrugHistoryApi(queryParams).then((res) => {
      console.log(res)
    })
  }

  useEffect(() => {
    // Parse the query string using URLSearchParams
    const queryParams = new URLSearchParams(location.search)

    getChildrenInfoApi(queryParams)
      .then((res) => {
        console.log(res)
        setChildren(res)
      })
      .catch((err) => {
        setError(err.message)
      })
  }, [location.search])

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: 'top-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce
      })
    }
  }, [error])

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <h1 className='text-2xl font-bold mb-6'>Drug Management</h1>

      {/* Search Bar */}
      <div className='mb-4'>
        <TextInput
          id='search'
          type='text'
          placeholder='Search by name or Citizen ID'
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Add Child Button */}
      <div className='mb-6'>
        <Button onClick={submitForm}>Add Child</Button>
      </div>

      {/* Children Table */}
      <Table hoverable={true}>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Birth Date</Table.HeadCell>
          <Table.HeadCell>Gender</Table.HeadCell>
          <Table.HeadCell>Height (cm)</Table.HeadCell>
          <Table.HeadCell>Weight (kg)</Table.HeadCell>
          <Table.HeadCell>BMI</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className='divide-y'>
          {filteredChildren.map((child, index) => (
            <Table.Row key={index} className='bg-white hover:bg-gray-100'>
              <Table.Cell>{child.hoten}</Table.Cell>
              <Table.Cell>{child.ngaysinh}</Table.Cell>
              <Table.Cell>{child.gioitinh}</Table.Cell>
              <Table.Cell>{child.chieucao}</Table.Cell>
              <Table.Cell>{child.cannang}</Table.Cell>
              <Table.Cell>{child.bmi}</Table.Cell>
              <Table.Cell>
                <Button
                  size='xs'
                  color='info'
                  onClick={() => {
                    handleViewButton(child.maso)
                  }}
                >
                  View
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

// Child Form Component

export default DrugManagement
