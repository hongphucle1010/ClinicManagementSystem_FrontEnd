import { useState, useEffect } from 'react'
import { Table, Button, Modal, TextInput, Select, Alert } from 'flowbite-react'
import { getAllDrugsApi, addDrugApi, updateDrugApi, deleteDrugApi } from '../api/thuoc'

import { GiMedicines } from 'react-icons/gi'

interface Drug {
  maso: string
  ten: string
  dang: string
  giaca: number
}

const DrugPage = () => {
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [filteredDrugs, setFilteredDrugs] = useState<Drug[]>([])
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false)

  const [newDrug, setNewDrug] = useState<Drug>({ maso: '', ten: '', dang: '', giaca: 0 })
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filterType, setFilterType] = useState<string>('') // For filtering by type
  const [searchTerm, setSearchTerm] = useState<string>('') // For searching by name

  // New state for alerts
  const [alert, setAlert] = useState<{
    type: 'success' | 'failure' | 'warning'
    message: string
  } | null>(null)

  // Function to show alert
  const showAlert = (type: 'success' | 'failure' | 'warning', message: string) => {
    setAlert({ type, message })

    // Clear alert after 3 seconds
    setTimeout(() => {
      setAlert(null)
    }, 3000)
  }

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const data = await getAllDrugsApi()
        setDrugs(data)
        setFilteredDrugs(data)
      } catch (error) {
        console.error(error)
        showAlert('failure', 'Không thể lấy dữ liệu thuốc. Vui lòng thử lại.')
      }
    }
    fetchDrugs()
  }, [])

  const handleSort = (order: 'asc' | 'desc') => {
    setSortOrder(order)
    const sortedDrugs = [...filteredDrugs].sort((a, b) => (order === 'asc' ? a.giaca - b.giaca : b.giaca - a.giaca))
    setFilteredDrugs(sortedDrugs)
  }

  const handleFilter = (type: string) => {
    setFilterType(type)
    const filtered = type ? drugs.filter((drug) => drug.dang === type) : drugs
    setFilteredDrugs(filtered)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = drugs.filter((drug) => drug.ten.toLowerCase().includes(term.toLowerCase()))
    setFilteredDrugs(filtered)
  }

  const handleEdit = (drug: Drug) => {
    setSelectedDrug(drug)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    try {
      if (selectedDrug) {
        await updateDrugApi(selectedDrug)
        const updatedDrugs = drugs.map((drug) => (drug.maso === selectedDrug.maso ? selectedDrug : drug))
        setDrugs(updatedDrugs)
        setFilteredDrugs(updatedDrugs)
        setIsEditModalOpen(false)
        showAlert('success', 'Cập nhật thuốc thành công!')
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } }
        const axiosMessage = error as { response?: { data?: { message?: string } } }
        const errorType = axiosMessage.response?.data?.message || 'Lỗi: '
        const errorMessage = axiosError.response?.data?.error || 'Không thể cập nhật thuốc. Vui lòng thử lại.'
        showAlert('failure', errorType + '. ' + errorMessage)
      } else {
        showAlert('failure', 'Không thể cập nhật thuốc. Vui lòng thử lại.')
      }
    }
  }

  const handleAdd = async () => {
    try {
      await addDrugApi(newDrug)
      const updatedDrugs = await getAllDrugsApi()
      setDrugs(updatedDrugs)
      setFilteredDrugs(updatedDrugs)
      setIsAddModalOpen(false)
      setNewDrug({ maso: '', ten: '', dang: '', giaca: 0 })
      showAlert('success', 'Thêm thuốc mới thành công!')
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } }
        const axiosMessage = error as { response?: { data?: { message?: string } } }
        const errorType = axiosMessage.response?.data?.message || 'Lỗi: '
        const errorMessage = axiosError.response?.data?.error || 'Không thể thêm thuốc. Vui lòng thử lại.'
        showAlert('failure', errorType + '. ' + errorMessage)
      } else {
        showAlert('failure', 'Không thể thêm thuốc. Vui lòng thử lại.')
      }
    }
  }

  const handleDeleteConfirmation = (maso: string) => {
    const drugToDelete = drugs.find((drug) => drug.maso === maso)
    setSelectedDrug(drugToDelete || null)
    setIsDeleteConfirmModalOpen(true)
  }

  const handleDelete = async () => {
    setIsDeleteConfirmModalOpen(false)
    try {
      if (selectedDrug) {
        await deleteDrugApi(selectedDrug.maso)
        const updatedDrugs = drugs.filter((drug) => drug.maso !== selectedDrug.maso)
        setDrugs(updatedDrugs)
        setFilteredDrugs(updatedDrugs)
        showAlert('success', 'Xóa thuốc thành công!')
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } }
        const errorMessage = axiosError.response?.data?.error || 'Không thể xóa thuốc'
        showAlert('failure', errorMessage)
      } else {
        showAlert('failure', 'Đã xảy ra lỗi không xác định.')
      }
    }
  }

  return (
    <div>
      {/* Alert Component */}
      {alert && (
        <div className='fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md'>
          <Alert color={alert.type} onDismiss={() => setAlert(null)}>
            {alert.message}
          </Alert>
        </div>
      )}
      <div className='flex justify-center my-8 text-sky-900'>
        <GiMedicines className='my-auto me-6' />
        <h1 className='text-3xl text-center font-bold '> Quản lý thuốc</h1>
        <GiMedicines className='my-auto ms-6' />
      </div>
      <div className='m-8 flex justify-between'>
        <Button onClick={() => setIsAddModalOpen(true)}>Thêm thuốc mới</Button>

        {/* Search by Name */}
        <TextInput
          className='w-1/2'
          color='info'
          placeholder='Tìm kiếm theo tên thuốc...'
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className='flex flex-col md:flex-row gap-4'>
          {/* Sort by Price */}
          <Select value={sortOrder} onChange={(e) => handleSort(e.target.value as 'asc' | 'desc')}>
            <option value='asc'>Giá: Thấp đến Cao</option>
            <option value='desc'>Giá: Cao đến Thấp</option>
          </Select>

          {/* Filter by Type */}
          <Select value={filterType} onChange={(e) => handleFilter(e.target.value)}>
            <option value=''>Tất cả các loại</option>
            <option value='Viên'>Viên</option>
            <option value='Chai'>Chai</option>
            <option value='Hộp'>Hộp</option>
            <option value='Ống'>Ống</option>
            <option value='Lọ'>Lọ</option>
            <option value='Gói'>Gói</option>
            <option value='Hủ'>Hủ</option>
            <option value='Túi'>Túi</option>
            <option value='Vỉ'>Vỉ</option>
            <option value='Khác'>Khác</option>
          </Select>
        </div>
      </div>
      <div className='m-8'>
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell className='w-3/5'>Tên thuốc</Table.HeadCell>
            <Table.HeadCell>Dạng</Table.HeadCell>
            <Table.HeadCell>Giá (VNĐ)</Table.HeadCell>
            <Table.HeadCell>Hành động</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
            {filteredDrugs.map((drug, index) => (
              <Table.Row key={index} className='bg-white hover:bg-sky-100'>
                <Table.Cell className='w-3/5'>{drug.ten}</Table.Cell>
                <Table.Cell>{drug.dang}</Table.Cell>
                <Table.Cell>{drug.giaca}</Table.Cell>
                <Table.Cell>
                  <div className='flex gap-2'>
                    <Button size='xs' color='info' onClick={() => handleEdit(drug)}>
                      Chỉnh sửa
                    </Button>
                    <Button size='xs' color='failure' onClick={() => handleDeleteConfirmation(drug.maso)}>
                      Xóa
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={isDeleteConfirmModalOpen} onClose={() => setIsDeleteConfirmModalOpen(false)}>
        <Modal.Header>Xác nhận xóa</Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa thuốc: <strong>{selectedDrug?.ten}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button color='failure' onClick={handleDelete}>
            Có, Xóa
          </Button>
          <Button color='gray' onClick={() => setIsDeleteConfirmModalOpen(false)}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Modal.Header>Chỉnh sửa thuốc</Modal.Header>
        <Modal.Body>
          {selectedDrug && (
            <div>
              <div className='mb-4'>
                <label className='block mb-2 text-sm font-medium text-gray-700'>Tên thuốc</label>
                <TextInput
                  value={selectedDrug.ten}
                  onChange={(e) =>
                    setSelectedDrug({
                      ...selectedDrug,
                      ten: e.target.value
                    })
                  }
                />
              </div>
              <div className='mb-4'>
                <label className='block mb-2 text-sm font-medium text-gray-700'>Dạng</label>
                <Select
                  value={selectedDrug.dang}
                  onChange={(e) =>
                    setSelectedDrug({
                      ...selectedDrug,
                      dang: e.target.value
                    })
                  }
                >
                  <option value='Viên'>Viên</option>
                  <option value='Chai'>Chai</option>
                  <option value='Hộp'>Hộp</option>
                  <option value='Ống'>Ống</option>
                  <option value='Lọ'>Lọ</option>
                  <option value='Gói'>Gói</option>
                  <option value='Hủ'>Hủ</option>
                  <option value='Túi'>Túi</option>
                  <option value='Vỉ'>Vỉ</option>
                  <option value='Khác'>Khác</option>
                  <option value='Test'>Test</option>
                </Select>
              </div>
              <div className='mb-4'>
                <label className='block mb-2 text-sm font-medium text-gray-700'>Giá (VNĐ)</label>
                <TextInput
                  type='number'
                  value={selectedDrug.giaca}
                  onChange={(e) =>
                    setSelectedDrug({
                      ...selectedDrug,
                      giaca: parseInt(e.target.value)
                    })
                  }
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSaveEdit}>Lưu</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Modal */}
      <Modal show={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <Modal.Header>Thêm thuốc mới</Modal.Header>
        <Modal.Body>
          <div>
            <div className='mb-4'>
              <label className='block mb-2 text-sm font-medium text-gray-700'>Tên thuốc</label>
              <TextInput
                value={newDrug.ten}
                placeholder='Nhập tên thuốc...'
                onChange={(e) =>
                  setNewDrug({
                    ...newDrug,
                    ten: e.target.value
                  })
                }
              />
            </div>
            <div className='mb-4'>
              <label className='block mb-2 text-sm font-medium text-gray-700'>Dạng</label>
              <Select
                value={newDrug.dang}
                onChange={(e) =>
                  setNewDrug({
                    ...newDrug,
                    dang: e.target.value
                  })
                }
              >
                <option value=''>Chọn dạng</option>
                <option value='Viên'>Viên</option>
                <option value='Chai'>Chai</option>
                <option value='Hộp'>Hộp</option>
                <option value='Ống'>Ống</option>
                <option value='Lọ'>Lọ</option>
                <option value='Gói'>Gói</option>
                <option value='Hủ'>Hủ</option>
                <option value='Túi'>Túi</option>
                <option value='Vỉ'>Vỉ</option>
                <option value='Khác'>Khác</option>
                <option value='Test'>Test</option>
              </Select>
            </div>
            <div className='mb-4'>
              <label className='block mb-2 text-sm font-medium text-gray-700'>Giá (VNĐ)</label>
              <TextInput
                type='number'
                value={newDrug.giaca}
                onChange={(e) =>
                  setNewDrug({
                    ...newDrug,
                    giaca: parseInt(e.target.value)
                  })
                }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAdd}>Thêm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default DrugPage
