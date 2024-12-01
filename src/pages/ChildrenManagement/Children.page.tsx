import React, { useState } from 'react'
import { Button, Table, Modal, TextInput, Select } from 'flowbite-react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { addChildrenApi, deleteChildrenApi, getChildrenInfoApi, updateChildrenApi } from '../../api/benhnhi'
import { Bounce, toast } from 'react-toastify'

const ChildrenManagement: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)
  const location = useLocation()
  const addChild = (child: AddChildrenParams) => {
    addChildrenApi(child)
      .then((res) => {
        const newChild: Child = {
          maso: res.data.maso_bn,
          hoten: child.hoten,
          ngaysinh: child.ngaysinh,
          gioitinh: child.gioitinh,
          chieucao: child.chieucao,
          cannang: child.cannang,
          bmi: child.bmi,
          tiensubenh: child.tiensubenh,
          masobhyt: child.masobhyt
        }
        setChildren([...children, newChild])
      })
      .catch((err) => {
        setError(err.message)
      })
    setShowAddModal(false)
  }

  const updateChild = (child: UpdateChildrenParams) => {
    updateChildrenApi(child)
      .then(() => {
        setChildren(children.map((c) => (c.maso === child.maso ? { ...c, ...child } : c)))
        toast.success('Cập nhật thành công!', {
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
      .catch((err) => {
        setError(err.message)
      })
    setShowUpdateModal(false)
  }

  const filteredChildren = children.filter(
    (child) => child.hoten.toLowerCase().includes(searchTerm.toLowerCase()) || child.masobhyt.includes(searchTerm)
  )

  const handleViewButton = (cccd: string) => {
    // Redirect to Parent Detail Page
    navigate(`/medicalexamination?benhnhi_id=${cccd}`)
  }

  const handleUpdateButton = (child: Child) => {
    setSelectedChild(child)
    setShowUpdateModal(true)
  }

  const handleDeleteButton = (maso: string) => {
    deleteChildrenApi(maso)
      .then((res) => {
        console.log(res)
        setChildren(children.filter((child) => child.maso !== maso))
      })
      .catch((err) => {
        setError(err.message)
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
    <div className='p-6 bg-gray-50 min-h-screen'>
      <h1 className='text-2xl font-bold mb-6'>Quản lý trẻ em</h1>

      {/* Search Bar */}
      <div className='mb-4'>
        <TextInput
          id='search'
          type='text'
          placeholder='Tìm kiếm theo tên hoặc mã số BHYT'
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Add Child Button */}
      <div className='mb-6'>
        <Button onClick={() => setShowAddModal(true)}>Thêm trẻ</Button>
      </div>

      {/* Children Table */}
      <Table hoverable={true}>
        <Table.Head>
          <Table.HeadCell>Tên</Table.HeadCell>
          <Table.HeadCell>Ngày sinh</Table.HeadCell>
          <Table.HeadCell>Giới tính</Table.HeadCell>
          <Table.HeadCell>Chiều cao (cm)</Table.HeadCell>
          <Table.HeadCell>Cân nặng (kg)</Table.HeadCell>
          <Table.HeadCell>BMI</Table.HeadCell>
          <Table.HeadCell>Hành động</Table.HeadCell>
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
                <div className='flex gap-1'>
                  <Button
                    size='xs'
                    color='info'
                    onClick={() => {
                      handleViewButton(child.maso)
                    }}
                  >
                    Xem
                  </Button>
                  <Button
                    size='xs'
                    color='warning'
                    onClick={() => {
                      handleUpdateButton(child)
                    }}
                  >
                    Cập nhật
                  </Button>
                  <Button
                    size='xs'
                    color='failure'
                    onClick={() => {
                      handleDeleteButton(child.maso)
                    }}
                  >
                    Xóa
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Add Child Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <Modal.Header>Thêm trẻ</Modal.Header>
        <Modal.Body>
          <ChildForm onSubmit={addChild} />
        </Modal.Body>
      </Modal>

      {/* Update Child Modal */}
      {selectedChild && (
        <Modal show={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
          <Modal.Header>Cập nhật thông tin trẻ</Modal.Header>
          <Modal.Body>
            <UpdateChildForm child={selectedChild} onSubmit={updateChild} />
          </Modal.Body>
        </Modal>
      )}
    </div>
  )
}

// Child Form Component
interface ChildFormProps {
  onSubmit: (childData: AddChildrenParams) => void
}

const ChildForm: React.FC<ChildFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState<AddChildrenParams>({
    hoten: '',
    ngaysinh: '',
    gioitinh: 'Nam',
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
          <label htmlFor='hoten'>Họ và tên</label>
          <TextInput
            id='hoten'
            name='hoten'
            type='text'
            placeholder='Họ và tên'
            aria-label='Họ và tên'
            value={form.hoten}
            onChange={handleChange}
            required
          />
        </div>

        {/* Date of Birth Field */}
        <div>
          <label htmlFor='ngaysinh'>Ngày sinh</label>
          <TextInput
            id='ngaysinh'
            name='ngaysinh'
            type='date'
            aria-label='Ngày sinh'
            value={form.ngaysinh}
            onChange={handleChange}
            required
          />
        </div>

        {/* Gender Field */}
        <div>
          <label htmlFor='gioitinh'>Giới tính</label>
          <Select
            id='gioitinh'
            name='gioitinh'
            aria-label='Giới tính'
            value={form.gioitinh}
            onChange={handleChange}
            required
          >
            <option value='Nam'>Nam</option>
            <option value='Nữ'>Nữ</option>
          </Select>
        </div>

        {/* Height Field */}
        <div>
          <label htmlFor='chieucao'>Chiều cao (cm)</label>
          <TextInput
            id='chieucao'
            name='chieucao'
            type='number'
            placeholder='Chiều cao (cm)'
            aria-label='Chiều cao (cm)'
            value={form.chieucao}
            onChange={handleChange}
            required
          />
        </div>

        {/* Weight Field */}
        <div>
          <label htmlFor='cannang'>Cân nặng (kg)</label>
          <TextInput
            id='cannang'
            name='cannang'
            type='number'
            placeholder='Cân nặng (kg)'
            aria-label='Cân nặng (kg)'
            value={form.cannang}
            onChange={handleChange}
            required
          />
        </div>

        {/* Medical History Field */}
        <div>
          <label htmlFor='tiensubenh'>Tiền sử bệnh</label>
          <TextInput
            id='tiensubenh'
            name='tiensubenh'
            type='text'
            placeholder='Tiền sử bệnh'
            aria-label='Tiền sử bệnh'
            value={form.tiensubenh}
            onChange={handleChange}
          />
        </div>

        {/* Insurance ID Field */}
        <div>
          <label htmlFor='masobhyt'>Mã số BHYT</label>
          <TextInput
            id='masobhyt'
            name='masobhyt'
            type='text'
            placeholder='Mã số BHYT'
            aria-label='Mã số BHYT'
            value={form.masobhyt}
            onChange={handleChange}
          />
        </div>

        {/* Guardian's Citizen ID Field */}
        <div>
          <label htmlFor='cccd'>CCCD của người giám hộ</label>
          <TextInput
            id='cccd'
            name='cccd'
            type='text'
            placeholder='CCCD của người giám hộ'
            aria-label='CCCD của người giám hộ'
            value={form.cccd}
            onChange={handleChange}
            required
          />
        </div>

        {/* Relationship to Guardian Field */}
        <div>
          <label htmlFor='quanhe'>Quan hệ với người giám hộ</label>
          <TextInput
            id='quanhe'
            name='quanhe'
            type='text'
            placeholder='Quan hệ với người giám hộ'
            aria-label='Quan hệ với người giám hộ'
            value={form.quanhe}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className='mt-4'>
        <Button onClick={handleSubmit}>Lưu trẻ</Button>
      </div>
    </div>
  )
}

// Update Child Form Component
interface UpdateChildFormProps {
  child: Child
  onSubmit: (childData: UpdateChildrenParams) => void
}

const UpdateChildForm: React.FC<UpdateChildFormProps> = ({ child, onSubmit }) => {
  const [form, setForm] = useState<UpdateChildrenParams>({
    maso: child.maso,
    hoten: child.hoten,
    ngaysinh: child.ngaysinh,
    gioitinh: child.gioitinh,
    chieucao: child.chieucao,
    cannang: child.cannang,
    tiensubenh: child.tiensubenh,
    masobhyt: child.masobhyt
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = () => {
    onSubmit(form)
  }

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Full Name Field */}
        <div>
          <label htmlFor='hoten'>Họ và tên</label>
          <TextInput
            id='hoten'
            name='hoten'
            type='text'
            placeholder='Họ và tên'
            aria-label='Họ và tên'
            value={form.hoten}
            onChange={handleChange}
            required
          />
        </div>

        {/* Date of Birth Field */}
        <div>
          <label htmlFor='ngaysinh'>Ngày sinh</label>
          <TextInput
            id='ngaysinh'
            name='ngaysinh'
            type='date'
            aria-label='Ngày sinh'
            value={form.ngaysinh}
            onChange={handleChange}
            required
          />
        </div>

        {/* Gender Field */}
        <div>
          <label htmlFor='gioitinh'>Giới tính</label>
          <Select
            id='gioitinh'
            name='gioitinh'
            aria-label='Giới tính'
            value={form.gioitinh}
            onChange={handleChange}
            required
          >
            <option value='Nam'>Nam</option>
            <option value='Nữ'>Nữ</option>
          </Select>
        </div>

        {/* Height Field */}
        <div>
          <label htmlFor='chieucao'>Chiều cao (cm)</label>
          <TextInput
            id='chieucao'
            name='chieucao'
            type='number'
            placeholder='Chiều cao (cm)'
            aria-label='Chiều cao (cm)'
            value={form.chieucao}
            onChange={handleChange}
            required
          />
        </div>

        {/* Weight Field */}
        <div>
          <label htmlFor='cannang'>Cân nặng (kg)</label>
          <TextInput
            id='cannang'
            name='cannang'
            type='number'
            placeholder='Cân nặng (kg)'
            aria-label='Cân nặng (kg)'
            value={form.cannang}
            onChange={handleChange}
            required
          />
        </div>

        {/* Medical History Field */}
        <div>
          <label htmlFor='tiensubenh'>Tiền sử bệnh</label>
          <TextInput
            id='tiensubenh'
            name='tiensubenh'
            type='text'
            placeholder='Tiền sử bệnh'
            aria-label='Tiền sử bệnh'
            value={form.tiensubenh}
            onChange={handleChange}
          />
        </div>

        {/* Insurance ID Field */}
        <div>
          <label htmlFor='masobhyt'>Mã số BHYT</label>
          <TextInput
            id='masobhyt'
            name='masobhyt'
            type='text'
            placeholder='Mã số BHYT'
            aria-label='Mã số BHYT'
            value={form.masobhyt}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className='mt-4'>
        <Button onClick={handleSubmit}>Cập nhật</Button>
      </div>
    </div>
  )
}

export default ChildrenManagement
