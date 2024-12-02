import React, { useState, useEffect, useRef } from 'react'
import { Button, Table, Modal, TextInput, Select } from 'flowbite-react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { addChildrenApi, deleteChildrenApi, getChildrenInfoApi, updateChildrenApi } from '../../api/benhnhi'
import { Bounce, toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AxiosError } from 'axios'
import { IoFilterCircle } from 'react-icons/io5' // Import the filter icon from react-icons

const numberOfRecords = 5

const FilterPopup: React.FC<{
  show: boolean
  onClose: () => void
  children: React.ReactNode
}> = ({ show, onClose, children }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose()
      }
    }
    if (show) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [show, onClose])

  if (!show) return null
  return (
    <div ref={ref} className='absolute top-6 z-10 bg-slate-500 bg-opacity-50 p-2 shadow-lg rounded-xl'>
      <div className='flex gap-2'>{children}</div>
    </div>
  )
}

const ChildrenManagement: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [childToDelete, setChildToDelete] = useState<string | null>(null)
  const [sortField, setSortField] = useState<keyof Child>('hoten')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [displayCount, setDisplayCount] = useState<number>(numberOfRecords)
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
        toast.success('Thêm trẻ thành công!', {
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
      .catch((err: AxiosError<ApiError>) => {
        setError(err.response?.data?.error || err.response?.data.message || err.message)
      })
    setShowUpdateModal(false)
  }

  const confirmDeleteChild = (maso: string) => {
    setChildToDelete(maso)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = () => {
    if (childToDelete) {
      deleteChildrenApi(childToDelete)
        .then((res) => {
          console.log(res)
          setChildren(children.filter((child) => child.maso !== childToDelete))
          toast.success('Xóa thành công!', {
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
      setShowDeleteModal(false)
      setChildToDelete(null)
    }
  }

  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortField(e.target.value as keyof Child)
  }

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'asc' | 'desc')
  }

  const [filters, setFilters] = useState<{
    hoten: string
    ngaysinh: string
    gioitinh: string
    chieucao: string
    cannang: string
    bmi: string
    chieucaoCriteria: '>' | '<' | '='
    cannangCriteria: '>' | '<' | '='
    bmiCriteria: '>' | '<' | '='
  }>({
    hoten: '',
    ngaysinh: '',
    gioitinh: '',
    chieucao: '',
    cannang: '',
    bmi: '',
    chieucaoCriteria: '=',
    cannangCriteria: '=',
    bmiCriteria: '='
  })
  const [showFilter, setShowFilter] = useState<{
    hoten: boolean
    ngaysinh: boolean
    gioitinh: boolean
    chieucao: boolean
    cannang: boolean
    bmi: boolean
  }>({
    hoten: false,
    ngaysinh: false,
    gioitinh: false,
    chieucao: false,
    cannang: false,
    bmi: false
  })

  const toggleFilter = (column: keyof typeof showFilter) => {
    setShowFilter({ ...showFilter, [column]: !showFilter[column] })
  }

  const handleFilterChange = (column: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [column]: value })
  }

  const handleCriteriaChange = (
    column: 'chieucaoCriteria' | 'cannangCriteria' | 'bmiCriteria',
    value: '>' | '<' | '='
  ) => {
    setFilters({ ...filters, [column]: value })
  }

  const handleClearAllFilters = () => {
    setFilters({
      hoten: '',
      ngaysinh: '',
      gioitinh: '',
      chieucao: '',
      cannang: '',
      bmi: '',
      chieucaoCriteria: '=',
      cannangCriteria: '=',
      bmiCriteria: '='
    })
  }

  const filteredChildren = children
    .filter((child) => {
      const compare = (a: number, b: number, criteria: '>' | '<' | '=') => {
        if (criteria === '>') return a > b
        if (criteria === '<') return a < b
        return a === b
      }
      return (
        (!filters.hoten || child.hoten.toLowerCase().includes(filters.hoten.toLowerCase())) &&
        (!filters.ngaysinh || child.ngaysinh.includes(filters.ngaysinh)) &&
        (!filters.gioitinh || child.gioitinh.trim() === filters.gioitinh) &&
        (!filters.chieucao || compare(child.chieucao, parseFloat(filters.chieucao), filters.chieucaoCriteria)) &&
        (!filters.cannang || compare(child.cannang, parseFloat(filters.cannang), filters.cannangCriteria)) &&
        (!filters.bmi || compare(child.bmi, parseFloat(filters.bmi), filters.bmiCriteria)) &&
        (child.hoten.toLowerCase().includes(searchTerm.toLowerCase()) || child.masobhyt?.includes(searchTerm))
      )
    })
    .sort((a, b) => {
      const fieldA = a[sortField] as string | number
      const fieldB = b[sortField] as string | number
      if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1
      if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

  const handleViewButton = (cccd: string) => {
    // Redirect to Parent Detail Page
    navigate(`/medicalexamination?benhnhi_id=${cccd}`)
  }

  const handleUpdateButton = (child: Child) => {
    setSelectedChild(child)
    setShowUpdateModal(true)
  }

  const handleShowMore = () => {
    setDisplayCount(displayCount + numberOfRecords)
  }

  useEffect(() => {
    // Parse the query string using URLSearchParams
    const queryParams = new URLSearchParams(location.search)

    getChildrenInfoApi(queryParams)
      .then((res) => {
        console.log(res)
        setChildren(res)
      })
      .catch((err: AxiosError<ApiError>) => {
        setError(err.response?.data?.error || err.response?.data.message || err.message)
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
        <h1 className='text-2xl font-bold mb-6'>Quản lý trẻ em</h1>

        {/* Search Bar */}
        <div className='mb-4 flex gap-4 w-full'>
          <TextInput
            id='search'
            type='text'
            placeholder='Tìm kiếm theo tên hoặc mã số BHYT'
            value={searchTerm}
            onChange={handleSearch}
            className='w-1/2'
          />
          <Select
            id='genderFilter'
            value={filters.gioitinh}
            onChange={(e) => handleFilterChange('gioitinh', e.target.value)}
          >
            <option value=''>Tất cả giới tính</option>
            <option value='Nam'>Nam</option>
            <option value='Nữ'>Nữ</option>
          </Select>
          <Select id='sortField' value={sortField} onChange={handleSortFieldChange}>
            <option value='hoten'>Tên</option>
            <option value='ngaysinh'>Ngày sinh</option>
            <option value='chieucao'>Chiều cao</option>
            <option value='cannang'>Cân nặng</option>
            <option value='bmi'>BMI</option>
          </Select>
          <Select id='sortOrder' value={sortOrder} onChange={handleSortOrderChange}>
            <option value='asc'>Tăng dần</option>
            <option value='desc'>Giảm dần</option>
          </Select>
          <Button onClick={handleClearAllFilters}>Clear All Filters</Button>
        </div>

        {/* Add Child Button */}
        <div className='mb-6'>
          <Button onClick={() => setShowAddModal(true)}>Thêm trẻ</Button>
        </div>

        {/* Children Table */}
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>
              <div className='relative'>
                <div className='flex items-center'>
                  Tên
                  <IoFilterCircle className='w-4 h-4 ml-1 cursor-pointer' onClick={() => toggleFilter('hoten')} />
                </div>
                <FilterPopup show={showFilter.hoten} onClose={() => setShowFilter({ ...showFilter, hoten: false })}>
                  <TextInput
                    className='mt-1'
                    placeholder='Lọc theo tên'
                    value={filters.hoten}
                    onChange={(e) => handleFilterChange('hoten', e.target.value)}
                  />
                </FilterPopup>
              </div>
            </Table.HeadCell>
            <Table.HeadCell>
              <div className='relative'>
                <div className='flex items-center'>
                  Ngày sinh
                  <IoFilterCircle className='w-4 h-4 ml-1 cursor-pointer' onClick={() => toggleFilter('ngaysinh')} />
                </div>
                <FilterPopup
                  show={showFilter.ngaysinh}
                  onClose={() => setShowFilter({ ...showFilter, ngaysinh: false })}
                >
                  <TextInput
                    className='mt-1'
                    type='date'
                    value={filters.ngaysinh}
                    onChange={(e) => handleFilterChange('ngaysinh', e.target.value)}
                  />
                </FilterPopup>
              </div>
            </Table.HeadCell>
            <Table.HeadCell>
              <div className='relative'>
                <div className='flex items-center'>
                  Giới tính
                  <IoFilterCircle className='w-4 h-4 ml-1 cursor-pointer' onClick={() => toggleFilter('gioitinh')} />
                </div>
                <FilterPopup
                  show={showFilter.gioitinh}
                  onClose={() => setShowFilter({ ...showFilter, gioitinh: false })}
                >
                  <Select
                    className='mt-1'
                    value={filters.gioitinh}
                    onChange={(e) => handleFilterChange('gioitinh', e.target.value)}
                  >
                    <option value=''>Tất cả</option>
                    <option value='Nam'>Nam</option>
                    <option value='Nữ'>Nữ</option>
                  </Select>
                </FilterPopup>
              </div>
            </Table.HeadCell>
            <Table.HeadCell>
              <div className='relative'>
                <div className='flex items-center'>
                  Chiều cao (cm)
                  <IoFilterCircle className='w-4 h-4 ml-1 cursor-pointer' onClick={() => toggleFilter('chieucao')} />
                </div>
                <FilterPopup
                  show={showFilter.chieucao}
                  onClose={() => setShowFilter({ ...showFilter, chieucao: false })}
                >
                  <Select
                    className='mt-1 w-16 flex-shrink-0'
                    value={filters.chieucaoCriteria}
                    onChange={(e) => handleCriteriaChange('chieucaoCriteria', e.target.value as '>' | '<' | '=')}
                  >
                    <option value='='>=</option>
                    <option value='>'>&gt;</option>
                    <option value='<'>&lt;</option>
                  </Select>
                  <TextInput
                    className='mt-1 w-36'
                    placeholder='Lọc theo chiều cao'
                    value={filters.chieucao}
                    onChange={(e) => handleFilterChange('chieucao', e.target.value)}
                  />
                </FilterPopup>
              </div>
            </Table.HeadCell>
            <Table.HeadCell>
              <div className='relative'>
                <div className='flex items-center'>
                  Cân nặng (kg)
                  <IoFilterCircle className='w-4 h-4 ml-1 cursor-pointer' onClick={() => toggleFilter('cannang')} />
                </div>
                <FilterPopup show={showFilter.cannang} onClose={() => setShowFilter({ ...showFilter, cannang: false })}>
                  <Select
                    className='mt-1 w-16 flex-shrink-0'
                    value={filters.cannangCriteria}
                    onChange={(e) => handleCriteriaChange('cannangCriteria', e.target.value as '>' | '<' | '=')}
                  >
                    <option value='='>=</option>
                    <option value='>'>&gt;</option>
                    <option value='<'>&lt;</option>
                  </Select>
                  <TextInput
                    className='mt-1 w-36'
                    placeholder='Lọc theo cân nặng'
                    value={filters.cannang}
                    onChange={(e) => handleFilterChange('cannang', e.target.value)}
                  />
                </FilterPopup>
              </div>
            </Table.HeadCell>
            <Table.HeadCell>
              <div className='relative'>
                <div className='flex items-center'>
                  BMI
                  <IoFilterCircle className='w-4 h-4 ml-1 cursor-pointer' onClick={() => toggleFilter('bmi')} />
                </div>
                <FilterPopup show={showFilter.bmi} onClose={() => setShowFilter({ ...showFilter, bmi: false })}>
                  <Select
                    className='mt-1 w-16 flex-shrink-0'
                    value={filters.bmiCriteria}
                    onChange={(e) => handleCriteriaChange('bmiCriteria', e.target.value as '>' | '<' | '=')}
                  >
                    <option value='='>=</option>
                    <option value='>'>&gt;</option>
                    <option value='<'>&lt;</option>
                  </Select>
                  <TextInput
                    className='mt-1 w-36'
                    placeholder='Lọc theo BMI'
                    value={filters.bmi}
                    onChange={(e) => handleFilterChange('bmi', e.target.value)}
                  />
                </FilterPopup>
              </div>
            </Table.HeadCell>
            <Table.HeadCell>Hành động</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
            {filteredChildren.slice(0, displayCount).map((child, index) => (
              <Table.Row key={index} className='bg-white hover:bg-gray-100'>
                <Table.Cell>{child.maso}</Table.Cell>
                <Table.Cell>{child.hoten}</Table.Cell>
                <Table.Cell>{new Date(child.ngaysinh).toLocaleDateString()}</Table.Cell>
                <Table.Cell>{child.gioitinh}</Table.Cell>
                <Table.Cell>{child.chieucao}</Table.Cell>
                <Table.Cell>{child.cannang}</Table.Cell>
                <Table.Cell>{Number(child.bmi).toFixed(2)}</Table.Cell>
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
                        confirmDeleteChild(child.maso)
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
        {displayCount < filteredChildren.length && (
          <div className='mt-4 w-full flex justify-center'>
            <Button onClick={handleShowMore}>Hiển thị thêm</Button>
          </div>
        )}

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

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <Modal.Header>Xác nhận xóa</Modal.Header>
          <Modal.Body>
            <p>Bạn có chắc chắn muốn xóa trẻ này không?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button color='failure' onClick={handleDeleteConfirm}>
              Xóa
            </Button>
            <Button color='gray' onClick={() => setShowDeleteModal(false)}>
              Hủy
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
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
    quanhe: 'Cha'
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
          <Select
            id='quanhe'
            name='quanhe'
            aria-label='Quan hệ với người giám hộ'
            value={form.quanhe}
            onChange={handleChange}
            required
          >
            <option value='Cha'>Cha</option>
            <option value='Mẹ'>Mẹ</option>
            <option value='Anh'>Anh</option>
            <option value='Chị'>Chị</option>
            <option value='Em'>Em</option>
            <option value='Bác'>Bác</option>
            <option value='Dì'>Dì</option>
            <option value='Chú'>Chú</option>
            <option value='Cô'>Cô</option>
            <option value='Ông'>Ông</option>
            <option value='Bà'>Bà</option>
          </Select>
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
  const ngaysinh = new Date(child.ngaysinh)
    .toLocaleDateString('en-CA')
    .split('/')
    .map((s) => s.padStart(2, '0'))
    .reverse()
    .join('-')
  const [form, setForm] = useState<UpdateChildrenParams>({
    maso: child.maso,
    hoten: child.hoten,
    ngaysinh,
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
