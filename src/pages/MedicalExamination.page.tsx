import React, { useState, useEffect } from 'react'
import { Button, Table, Modal, TextInput, Select } from 'flowbite-react'
import { getMedicalExaminationApi, addMedicalExaminationApi } from '../api/buoikhambenh'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Bounce, toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AxiosError } from 'axios'

const MedicalExaminationManagement: React.FC = () => {
  const [examinations, setExaminations] = useState<MedicalExamination[]>([])

  const location = useLocation()
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)

  const addExamination = (examination: MedicalExamination) => {
    console.log('Adding: ', examination)
    addMedicalExaminationApi(examination)
      .then((res) => {
        setExaminations([...examinations, res.data]) // Access the data property
        setShowModal(false)
        toast.success('Thêm khám bệnh thành công!', {
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
      })
      .catch((err: AxiosError<ApiError>) => {
        setError(err.response?.data?.error || err.response?.data.message || err.message)
      })
  }

  const filteredExaminations = examinations.filter(
    (exam) => exam.maso.includes(searchTerm) || exam.maso_bn.includes(searchTerm)
  )

  const handleOnClick = (maso: string) => {
    navigate(`/medicalexamination/detail?maso_bkb=${maso}`)
  }

  useEffect(() => {
    // Parse the query string using URLSearchParams
    const queryParams = new URLSearchParams(location.search)

    getMedicalExaminationApi(queryParams)
      .then((res) => {
        console.log(res)
        setExaminations(res)
      })
      .catch((err) => {
        console.error(err.message)
      })
  }, [location.search])

  useEffect(() => {
    if (error) {
      console.error(error)
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
    <>
      <ToastContainer />
      <div className='p-6 bg-gray-50 min-h-screen'>
        <h1 className='text-2xl font-bold mb-6'>Quản Lý Khám Bệnh</h1>

        {/* Search Bar */}
        <div className='mb-4'>
          <TextInput
            id='search'
            type='text'
            placeholder='Tìm kiếm theo Mã Số Khám hoặc Mã Số Bệnh Nhân'
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Add Examination Button */}
        <div className='mb-6'>
          <Button onClick={() => setShowModal(true)}>Thêm Khám Bệnh</Button>
        </div>

        {/* Examinations Table */}
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell>Mã Số Khám</Table.HeadCell>
            <Table.HeadCell>Ngày Khám</Table.HeadCell>
            <Table.HeadCell>Tái Khám</Table.HeadCell>
            <Table.HeadCell>Trạng Thái</Table.HeadCell>
            <Table.HeadCell>Huyết Áp</Table.HeadCell>
            <Table.HeadCell>Nhiệt Độ</Table.HeadCell>
            <Table.HeadCell>Chẩn Đoán</Table.HeadCell>
            <Table.HeadCell style={{ width: '10%' }}>Hành Động</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
            {filteredExaminations.map((exam, index) => (
              <Table.Row key={index} className='bg-white hover:bg-gray-100'>
                <Table.Cell>{exam.maso}</Table.Cell>
                <Table.Cell>
                  {new Date(exam.ngaykham).toLocaleTimeString() + ' ' + new Date(exam.ngaykham).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>{exam.taikham ? 'Có' : 'Không'}</Table.Cell>
                <Table.Cell>{exam.trangthai}</Table.Cell>
                <Table.Cell>{exam.huyetap}</Table.Cell>
                <Table.Cell>{exam.nhietdo}°C</Table.Cell>
                <Table.Cell>{exam.chandoan}</Table.Cell>
                <Table.Cell>
                  <Button size='xs' color='info' onClick={() => handleOnClick(exam.maso)}>
                    Xem
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {/* Add Examination Modal */}
        <Modal show={showModal} onClose={() => setShowModal(false)} className='z-10'>
          <Modal.Header>Thêm Khám Bệnh</Modal.Header>
          <Modal.Body>
            <ExaminationForm onSubmit={addExamination} />
          </Modal.Body>
        </Modal>
      </div>
    </>
  )
}

// Examination Form Component
interface ExaminationFormProps {
  onSubmit: (examData: MedicalExamination) => void
}

const ExaminationForm: React.FC<ExaminationFormProps> = ({ onSubmit }) => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const masobenhnhi = queryParams.get('benhnhi_id') || ''

  const [form, setForm] = useState<MedicalExamination>({
    maso: '', // Default empty string or appropriate value
    ngaykham: '',
    taikham: false,
    trangthai: 'Pending',
    huyetap: '',
    nhietdo: 36.0,
    chandoan: '',
    ketluan: '',
    maso_bn: masobenhnhi,
    cccd_bs: '',
    chuyenkhoa: '', // Default value
    bangcap: '', // Default value
    cc_hanhnghe: '' // Default value
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
          value={form.taikham ? 'Có' : 'Không'}
          onChange={(e) => setForm({ ...form, taikham: e.target.value === 'Có' })}
          required
        >
          <option value='Không'>Không</option>
          <option value='Có'>Có</option>
        </Select>
        <TextInput
          id='trangthai'
          name='trangthai'
          type='text'
          placeholder='Trạng Thái'
          value={form.trangthai}
          onChange={handleChange}
          required
        />
        <TextInput
          id='huyetap'
          name='huyetap'
          type='text'
          placeholder='Huyết Áp'
          value={form.huyetap}
          onChange={handleChange}
          required
        />
        <TextInput
          id='nhietdo'
          name='nhietdo'
          type='number'
          placeholder='Nhiệt Độ (°C)'
          value={form.nhietdo}
          onChange={handleChange}
          required
        />
        <TextInput
          id='chandoan'
          name='chandoan'
          type='text'
          placeholder='Chẩn Đoán'
          value={form.chandoan}
          onChange={handleChange}
          required
        />
        <TextInput
          id='ketluan'
          name='ketluan'
          type='text'
          placeholder='Kết Luận'
          value={form.ketluan}
          onChange={handleChange}
          required
        />
        <TextInput
          id='cccd_bs'
          name='cccd_bs'
          type='text'
          placeholder='CCCD Bác Sĩ'
          value={form.cccd_bs}
          onChange={handleChange}
          required
        />
      </div>
      <div className='mt-4'>
        <Button onClick={handleSubmit}>Lưu Khám Bệnh</Button>
      </div>
    </div>
  )
}

export default MedicalExaminationManagement
