import React, { useState } from 'react'
import { Button, Table, Modal, TextInput, Select } from 'flowbite-react'
import { useEffect } from 'react'
import axios from 'axios'

type MedicalExamination = {
  maso: string
  ngaykham: string
  taikham: boolean
  trangthai: string
  huyetap: string
  nhietdo: number
  chandoan: string
  ketluan: string
  maso_bn: string
  cccd_bs: string
}

const MedicalExaminationManagement: React.FC = () => {
  const [examinations, setExaminations] = useState<MedicalExamination[]>([
    {
      maso: '123e4567-e89b-12d3-a456-426614174000',
      ngaykham: '2024-11-26',
      taikham: true,
      trangthai: 'Completed',
      huyetap: '120/80',
      nhietdo: 36.7,
      chandoan: 'Flu',
      ketluan: 'Prescribed medication, follow up in 2 weeks.',
      maso_bn: '456e1234-e89b-12d3-a456-426614174111',
      cccd_bs: '987654321'
    }
  ])

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)

  const addExamination = (examination: MedicalExamination) => {
    setExaminations([...examinations, examination])
    setShowModal(false)
  }

  const filteredExaminations = examinations.filter(
    (exam) => exam.maso.includes(searchTerm) || exam.maso_bn.includes(searchTerm)
  )

  useEffect(() => {
    // Parse the query string using URLSearchParams
    const queryParams = new URLSearchParams(location.search)

    // Get the 'phuhuynh_cccd' query parameter
    const benhnhiId = queryParams.get('benhnhi_id')
    const endpoint = benhnhiId
      ? 'http://localhost:4000/api/buoikhambenh/benhnhi/' + benhnhiId
      : 'http://localhost:4000/api/buoikhambenh'
    axios
      .get(endpoint)
      .then((res) => {
        console.log(res.data)
        setExaminations(res.data)
      })
      .catch((err: Error) => {
        console.error(err.message)
      })
  }, [])

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <h1 className='text-2xl font-bold mb-6'>Medical Examination Management</h1>

      {/* Search Bar */}
      <div className='mb-4'>
        <TextInput
          id='search'
          type='text'
          placeholder='Search by Exam ID or Patient ID'
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Add Examination Button */}
      <div className='mb-6'>
        <Button onClick={() => setShowModal(true)}>Add Examination</Button>
      </div>

      {/* Examinations Table */}
      <Table hoverable={true}>
        <Table.Head>
          <Table.HeadCell>Exam ID</Table.HeadCell>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Follow-Up</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Blood Pressure</Table.HeadCell>
          <Table.HeadCell>Temperature</Table.HeadCell>
          <Table.HeadCell>Diagnosis</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className='divide-y'>
          {filteredExaminations.map((exam, index) => (
            <Table.Row key={index} className='bg-white hover:bg-gray-100'>
              <Table.Cell>{exam.maso}</Table.Cell>
              <Table.Cell>{exam.ngaykham}</Table.Cell>
              <Table.Cell>{exam.taikham ? 'Yes' : 'No'}</Table.Cell>
              <Table.Cell>{exam.trangthai}</Table.Cell>
              <Table.Cell>{exam.huyetap}</Table.Cell>
              <Table.Cell>{exam.nhietdo}°C</Table.Cell>
              <Table.Cell>{exam.chandoan}</Table.Cell>
              <Table.Cell>
                <Button size='xs' color='info'>
                  View
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Add Examination Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Add Medical Examination</Modal.Header>
        <Modal.Body>
          <ExaminationForm onSubmit={addExamination} />
        </Modal.Body>
      </Modal>
    </div>
  )
}

// Examination Form Component
interface ExaminationFormProps {
  onSubmit: (examData: MedicalExamination) => void
}

const ExaminationForm: React.FC<ExaminationFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState<Omit<MedicalExamination, 'maso'>>({
    ngaykham: '',
    taikham: false,
    trangthai: 'Pending',
    huyetap: '',
    nhietdo: 36.0,
    chandoan: '',
    ketluan: '',
    maso_bn: '',
    cccd_bs: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? !form.taikham : form.taikham
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = () => {
    const maso = crypto.randomUUID() // Generate a unique ID for the examination
    onSubmit({ ...form, maso })
  }

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <TextInput id='ngaykham' name='ngaykham' type='date' value={form.ngaykham} onChange={handleChange} required />
        <Select
          id='taikham'
          name='taikham'
          value={form.taikham ? 'Yes' : 'No'}
          onChange={(e) => setForm({ ...form, taikham: e.target.value === 'Yes' })}
          required
        >
          <option value='No'>No</option>
          <option value='Yes'>Yes</option>
        </Select>
        <TextInput
          id='trangthai'
          name='trangthai'
          type='text'
          placeholder='Status'
          value={form.trangthai}
          onChange={handleChange}
          required
        />
        <TextInput
          id='huyetap'
          name='huyetap'
          type='text'
          placeholder='Blood Pressure'
          value={form.huyetap}
          onChange={handleChange}
          required
        />
        <TextInput
          id='nhietdo'
          name='nhietdo'
          type='number'
          placeholder='Temperature (°C)'
          value={form.nhietdo}
          onChange={handleChange}
          required
        />
        <TextInput
          id='chandoan'
          name='chandoan'
          type='text'
          placeholder='Diagnosis'
          value={form.chandoan}
          onChange={handleChange}
          required
        />
        <TextInput
          id='ketluan'
          name='ketluan'
          type='text'
          placeholder='Conclusion'
          value={form.ketluan}
          onChange={handleChange}
          required
        />
        <TextInput
          id='maso_bn'
          name='maso_bn'
          type='text'
          placeholder='Patient ID'
          value={form.maso_bn}
          onChange={handleChange}
          required
        />
        <TextInput
          id='cccd_bs'
          name='cccd_bs'
          type='text'
          placeholder="Doctor's Citizen ID"
          value={form.cccd_bs}
          onChange={handleChange}
          required
        />
      </div>
      <div className='mt-4'>
        <Button onClick={handleSubmit}>Save Examination</Button>
      </div>
    </div>
  )
}

export default MedicalExaminationManagement
