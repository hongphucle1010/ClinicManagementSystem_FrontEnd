import React, { useState, useEffect, useRef } from 'react'
import { Button, Table, Modal, TextInput, Select } from 'flowbite-react'
import ParentForm from '../components/ParentComponent/Parent.component'
import { useNavigate } from 'react-router-dom'
import { addParentApi, deleteParentApi, getAllParentsApi, updateParentApi } from '../api/phuhuynh'
import { Bounce, toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { IoFilterCircle } from 'react-icons/io5'

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

const ParentManagement: React.FC = () => {
  const [Parents, setParents] = useState<Parent[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false)
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null)
  const [error, setError] = useState<string>('')
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [parentToDelete, setParentToDelete] = useState<string | null>(null)
  const [sortField, setSortField] = useState<keyof Parent>('hoten')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [displayCount, setDisplayCount] = useState<number>(numberOfRecords)
  const navigate = useNavigate()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)

  const addParent = (parent: Parent) => {
    addParentApi(parent)
      .then((res) => {
        setParents([...Parents, res.data])
        toast.success('Thêm phụ huynh thành công!', {
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
    setShowModal(false)
  }

  const updateParent = (parent: Parent) => {
    updateParentApi(parent)
      .then(() => {
        setParents(Parents.map((p) => (p.cccd === parent.cccd ? parent : p)))
        toast.success('Cập nhật phụ huynh thành công!', {
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

  const [filters, setFilters] = useState<{
    hoten: string
    cccd: string
    sdt: string
  }>({
    hoten: '',
    cccd: '',
    sdt: ''
  })
  const [showFilter, setShowFilter] = useState<{
    hoten: boolean
    cccd: boolean
    sdt: boolean
  }>({
    hoten: false,
    cccd: false,
    sdt: false
  })

  const toggleFilter = (column: keyof typeof showFilter) => {
    setShowFilter({ ...showFilter, [column]: !showFilter[column] })
  }

  const handleFilterChange = (column: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [column]: value })
  }

  const handleClearAllFilters = () => {
    setFilters({ hoten: '', cccd: '', sdt: '' })
  }

  const filteredParents = Parents.filter(
    (Parent) =>
      (Parent.hoten.toLowerCase().includes(searchTerm.toLowerCase()) || Parent.cccd.includes(searchTerm)) &&
      (!filters.hoten || Parent.hoten.toLowerCase().includes(filters.hoten.toLowerCase())) &&
      (!filters.cccd || Parent.cccd.includes(filters.cccd)) &&
      (!filters.sdt || Parent.sdt.includes(filters.sdt))
  ).sort((a, b) => {
    const fieldA = a[sortField] as string | number
    const fieldB = b[sortField] as string | number
    if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1
    if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const handleViewButton = (cccd: string) => {
    navigate(`/children?phuhuynh_cccd=${cccd}`)
  }

  const handleUpdateButton = (parent: Parent) => {
    setSelectedParent(parent)
    setShowUpdateModal(true)
  }

  const confirmDeleteParent = (cccd: string) => {
    setParentToDelete(cccd)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = () => {
    if (parentToDelete) {
      deleteParentApi(parentToDelete)
        .then(() => {
          setParents(Parents.filter((Parent) => Parent.cccd !== parentToDelete))
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
        .catch((err) => {
          setError(err.message)
        })
      setShowDeleteModal(false)
      setParentToDelete(null)
    }
  }

  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortField(e.target.value as keyof Parent)
  }

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'asc' | 'desc')
  }

  const handleShowMore = () => {
    setDisplayCount(displayCount + numberOfRecords)
  }

  useEffect(() => {
    getAllParentsApi()
      .then((res) => {
        setParents(res)
      })
      .catch((err) => {
        setError(err.message)
      })
  }, [])

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
      <ToastContainer />
      <h1 className='text-2xl font-bold mb-6'>Quản lý phụ huynh</h1>

      {/* Search Bar */}
      <div className='mb-4 flex gap-4 w-full'>
        <TextInput
          id='search'
          type='text'
          placeholder='Tìm kiếm theo tên hoặc CCCD'
          value={searchTerm}
          onChange={handleSearch}
          className='w-1/2'
        />
        <Select id='sortField' value={sortField} onChange={handleSortFieldChange}>
          <option value='hoten'>Tên</option>
          <option value='cccd'>CCCD</option>
          <option value='sdt'>Số điện thoại</option>
        </Select>
        <Select id='sortOrder' value={sortOrder} onChange={handleSortOrderChange}>
          <option value='asc'>Tăng dần</option>
          <option value='desc'>Giảm dần</option>
        </Select>
        <Button onClick={handleClearAllFilters}>Clear All Filters</Button>
      </div>

      {/* Add Parent Button */}
      <div className='mb-6'>
        <Button onClick={() => setShowModal(true)}>Thêm phụ huynh</Button>
      </div>

      {/* Parents Table */}
      <Table hoverable={true}>
        <Table.Head>
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
                CCCD
                <IoFilterCircle className='w-4 h-4 ml-1 cursor-pointer' onClick={() => toggleFilter('cccd')} />
              </div>
              <FilterPopup show={showFilter.cccd} onClose={() => setShowFilter({ ...showFilter, cccd: false })}>
                <TextInput
                  className='mt-1'
                  placeholder='Lọc theo CCCD'
                  value={filters.cccd}
                  onChange={(e) => handleFilterChange('cccd', e.target.value)}
                />
              </FilterPopup>
            </div>
          </Table.HeadCell>
          <Table.HeadCell>
            <div className='relative'>
              <div className='flex items-center'>
                Số điện thoại
                <IoFilterCircle className='w-4 h-4 ml-1 cursor-pointer' onClick={() => toggleFilter('sdt')} />
              </div>
              <FilterPopup show={showFilter.sdt} onClose={() => setShowFilter({ ...showFilter, sdt: false })}>
                <TextInput
                  className='mt-1'
                  placeholder='Lọc theo số điện thoại'
                  value={filters.sdt}
                  onChange={(e) => handleFilterChange('sdt', e.target.value)}
                />
              </FilterPopup>
            </div>
          </Table.HeadCell>
          <Table.HeadCell>Địa chỉ</Table.HeadCell>
          <Table.HeadCell>Hành động</Table.HeadCell>
        </Table.Head>
        <Table.Body className='divide-y'>
          {filteredParents.slice(0, displayCount).map((Parent, index) => (
            <Table.Row key={index} className='bg-white hover:bg-gray-100'>
              <Table.Cell>{Parent.hoten}</Table.Cell>
              <Table.Cell>{Parent.cccd}</Table.Cell>
              <Table.Cell>{Parent.sdt}</Table.Cell>
              <Table.Cell>
                {`${Parent.sonha}, ${Parent.tenduong}, ${Parent.phuong}, ${Parent.huyen}, ${Parent.tinh}`}
              </Table.Cell>
              <Table.Cell>
                <div className='flex gap-1'>
                  <Button size='xs' color='info' onClick={() => handleViewButton(Parent.cccd)}>
                    Xem
                  </Button>
                  <Button size='xs' color='warning' onClick={() => handleUpdateButton(Parent)}>
                    Cập nhật
                  </Button>
                  <Button size='xs' color='failure' onClick={() => confirmDeleteParent(Parent.cccd)}>
                    Xóa
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {displayCount < filteredParents.length && (
        <div className='mt-4 w-full flex justify-center'>
          <Button onClick={handleShowMore}>Hiển thị thêm</Button>
        </div>
      )}

      {/* Add Parent Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Thêm phụ huynh</Modal.Header>
        <Modal.Body>
          <ParentForm onSubmit={addParent} />
        </Modal.Body>
      </Modal>

      {/* Update Parent Modal */}
      {selectedParent && (
        <Modal show={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
          <Modal.Header>Cập nhật thông tin phụ huynh</Modal.Header>
          <Modal.Body>
            <ParentForm parent={selectedParent} onSubmit={updateParent} />
          </Modal.Body>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Modal.Header>Xác nhận xóa</Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa phụ huynh này không?</p>
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
  )
}

export default ParentManagement
