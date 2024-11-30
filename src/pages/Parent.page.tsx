import React, { useState } from 'react'
import { Button, Table, Modal, TextInput } from 'flowbite-react'
import ParentForm from '../components/ParentComponent/Parent.component'
import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom' // Import useNavigate hook

type Parent = {
  cccd: string
  hoten: string
  sdt: string
  sonha: string
  tenduong: string
  phuong: string
  huyen: string
  tinh: string
}

const ParentManagement: React.FC = () => {
  const [Parents, setParents] = useState<Parent[]>([])

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)

  const addParent = (Parent: Parent) => {
    setParents([...Parents, Parent])
    setShowModal(false)
    axios.post('http://localhost:4000/api/phuhuynh/add', Parent)
  }

  const filteredParents = Parents.filter(
    (Parent) => Parent.hoten.toLowerCase().includes(searchTerm.toLowerCase()) || Parent.cccd.includes(searchTerm)
  )

  const handleViewButton = (cccd: string) => {
    // Redirect to Parent Detail Page
    navigate(`/children?phuhuynh_cccd=${cccd}`)
  }

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/phuhuynh')
      .then((res) => {
        console.log(res.data)
        setParents(res.data)
      })
      .catch((err: any) => {
        setError(err.message)
      })
  }, [])

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <h1 className='text-2xl font-bold mb-6'>Parent Management</h1>

      {/* Search Bar */}
      <div className='mb-4 flex gap-4'>
        <TextInput
          id='search'
          type='text'
          placeholder='Search by name or Citizen ID'
          value={searchTerm}
          onChange={handleSearch}
          className='flex-grow'
        />
        <Button onClick={() => setShowModal(true)}>Add Parent</Button>
      </div>

      {/* Add Parent Button */}

      {/* Parent Table */}
      <Table hoverable={true}>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Citizen ID</Table.HeadCell>
          <Table.HeadCell>Phone Number</Table.HeadCell>
          <Table.HeadCell>Address</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className='divide-y'>
          {filteredParents.map((Parent, index) => (
            <Table.Row key={index} className='bg-white hover:bg-gray-100'>
              <Table.Cell>{Parent.hoten}</Table.Cell>
              <Table.Cell>{Parent.cccd}</Table.Cell>
              <Table.Cell>{Parent.sdt}</Table.Cell>
              <Table.Cell>
                {`${Parent.sonha}, ${Parent.tenduong}, ${Parent.phuong}, ${Parent.huyen}, ${Parent.tinh}`}
              </Table.Cell>
              <Table.Cell>
                <Button size='xs' color='info' onClick={() => handleViewButton(Parent.cccd)}>
                  View
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Add Parent Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Add Parent</Modal.Header>
        <Modal.Body>
          <ParentForm onSubmit={addParent} />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ParentManagement
