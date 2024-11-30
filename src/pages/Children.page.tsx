import React, { useState } from 'react'
import { Button, Table, Modal, TextInput, Select } from 'flowbite-react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { getChildrenInfoApi } from '../api/benhnhi'

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

const ChildrenManagement: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([])

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)
  const location = useLocation()
  const addChild = (child: Child) => {
    setChildren([...children, child])
    setShowModal(false)
  }

  const filteredChildren = children.filter(
    (child) => child.hoten.toLowerCase().includes(searchTerm.toLowerCase()) || child.cccd.includes(searchTerm)
  )

  const handleViewButton = (cccd: string) => {
    // Redirect to Parent Detail Page
    navigate(`/medicalexamination?benhnhi_id=${cccd}`)
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

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <h1 className='text-2xl font-bold mb-6'>Children Management</h1>

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
        <Button onClick={() => setShowModal(true)}>Add Child</Button>
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

      {/* Add Child Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Add Child</Modal.Header>
        <Modal.Body>
          <ChildForm onSubmit={addChild} />
        </Modal.Body>
      </Modal>
    </div>
  )
}

// Child Form Component
interface ChildFormProps {
  onSubmit: (childData: Child) => void
}

const ChildForm: React.FC<ChildFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState<Child>({
    maso: '',
    hoten: '',
    ngaysinh: '',
    gioitinh: 'Male',
    chieucao: 0,
    cannang: 0,
    bmi: 0,
    tiensubenh: '',
    masobhyt: '',
    cccd: '',
    quanhe: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const calculateBMI = (height: number, weight: number): number => {
    if (height > 0 && weight > 0) {
      return weight / (height / 100) ** 2
    }
    return 0
  }

  const handleSubmit = () => {
    const bmi = calculateBMI(form.chieucao, form.cannang)
    onSubmit({ ...form, bmi })
  }

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Full Name Field */}
        <div>
          <label htmlFor='hoten'>Full Name</label>
          <TextInput
            id='hoten'
            name='hoten'
            type='text'
            placeholder='Full Name'
            aria-label='Full Name'
            value={form.hoten}
            onChange={handleChange}
            required
          />
        </div>

        {/* Date of Birth Field */}
        <div>
          <label htmlFor='ngaysinh'>Date of Birth</label>
          <TextInput
            id='ngaysinh'
            name='ngaysinh'
            type='date'
            aria-label='Date of Birth'
            value={form.ngaysinh}
            onChange={handleChange}
            required
          />
        </div>

        {/* Gender Field */}
        <div>
          <label htmlFor='gioitinh'>Gender</label>
          <Select
            id='gioitinh'
            name='gioitinh'
            aria-label='Gender'
            value={form.gioitinh}
            onChange={handleChange}
            required
          >
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
          </Select>
        </div>

        {/* Height Field */}
        <div>
          <label htmlFor='chieucao'>Height (cm)</label>
          <TextInput
            id='chieucao'
            name='chieucao'
            type='number'
            placeholder='Height (cm)'
            aria-label='Height in centimeters'
            value={form.chieucao}
            onChange={handleChange}
            required
          />
        </div>

        {/* Weight Field */}
        <div>
          <label htmlFor='cannang'>Weight (kg)</label>
          <TextInput
            id='cannang'
            name='cannang'
            type='number'
            placeholder='Weight (kg)'
            aria-label='Weight in kilograms'
            value={form.cannang}
            onChange={handleChange}
            required
          />
        </div>

        {/* Medical History Field */}
        <div>
          <label htmlFor='tiensubenh'>Medical History</label>
          <TextInput
            id='tiensubenh'
            name='tiensubenh'
            type='text'
            placeholder='Medical History'
            aria-label='Medical History'
            value={form.tiensubenh}
            onChange={handleChange}
          />
        </div>

        {/* Insurance ID Field */}
        <div>
          <label htmlFor='masobhyt'>Insurance ID</label>
          <TextInput
            id='masobhyt'
            name='masobhyt'
            type='text'
            placeholder='Insurance ID'
            aria-label='Insurance ID'
            value={form.masobhyt}
            onChange={handleChange}
          />
        </div>

        {/* Guardian's Citizen ID Field */}
        <div>
          <label htmlFor='cccd'>Guardian's Citizen ID</label>
          <TextInput
            id='cccd'
            name='cccd'
            type='text'
            placeholder="Guardian's Citizen ID"
            aria-label="Guardian's Citizen ID"
            value={form.cccd}
            onChange={handleChange}
            required
          />
        </div>

        {/* Relationship to Guardian Field */}
        <div>
          <label htmlFor='quanhe'>Relationship to Guardian</label>
          <TextInput
            id='quanhe'
            name='quanhe'
            type='text'
            placeholder='Relationship to Guardian'
            aria-label='Relationship to Guardian'
            value={form.quanhe}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className='mt-4'>
        <Button onClick={handleSubmit}>Save Child</Button>
      </div>
    </div>
  )
}

export default ChildrenManagement
