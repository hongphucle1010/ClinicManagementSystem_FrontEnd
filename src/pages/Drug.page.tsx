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
        showAlert('failure', 'Failed to fetch drugs. Please try again.')
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
        showAlert('success', 'Drug updated successfully!')
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } }
        const axiosMessage = error as { response?: { data?: { message?: string } } }
        const errorType = axiosMessage.response?.data?.message || 'Error: '
        const errorMessage = axiosError.response?.data?.error || 'Failed to update drug. Please try again.'
        showAlert('failure', errorType + '. ' + errorMessage)
      } else {
        showAlert('failure', 'Failed to update drug. Please try again.')
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
      showAlert('success', 'New drug added successfully!')
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } }
        const axiosMessage = error as { response?: { data?: { message?: string } } }
        const errorType = axiosMessage.response?.data?.message || 'Error: '
        const errorMessage = axiosError.response?.data?.error || 'Failed to add drug. Please try again.'
        showAlert('failure', errorType + '. ' + errorMessage)
      } else {
        showAlert('failure', 'Failed to add drug. Please try again.')
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
        showAlert('success', 'Drug deleted successfully!')
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } }
        const errorMessage = axiosError.response?.data?.error || 'Failed to delete drug'
        showAlert('failure', errorMessage)
      } else {
        showAlert('failure', 'An unknown error occurred.')
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
        <h1 className='text-3xl text-center font-bold '> Drug Management</h1>
        <GiMedicines className='my-auto ms-6' />
      </div>
      <div className='m-8 flex justify-between'>
        <Button onClick={() => setIsAddModalOpen(true)}>Add New Drug</Button>

        {/* Search by Name */}
        <TextInput
          className='w-1/2'
          color='info'
          placeholder='Search by drug name...'
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className='flex flex-col md:flex-row gap-4'>
          {/* Sort by Price */}
          <Select value={sortOrder} onChange={(e) => handleSort(e.target.value as 'asc' | 'desc')}>
            <option value='asc'>Price: Low to High</option>
            <option value='desc'>Price: High to Low</option>
          </Select>

          {/* Filter by Type */}
          <Select value={filterType} onChange={(e) => handleFilter(e.target.value)}>
            <option value=''>All Types</option>
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
            <Table.HeadCell className='w-3/5'>Drug Name</Table.HeadCell>
            <Table.HeadCell>Form</Table.HeadCell>
            <Table.HeadCell>Price (VNĐ)</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
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
                      Edit
                    </Button>
                    <Button size='xs' color='failure' onClick={() => handleDeleteConfirmation(drug.maso)}>
                      Delete
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
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the drug: <strong>{selectedDrug?.ten}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button color='failure' onClick={handleDelete}>
            Yes, Delete
          </Button>
          <Button color='gray' onClick={() => setIsDeleteConfirmModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Modal.Header>Edit Drug</Modal.Header>
        <Modal.Body>
          {selectedDrug && (
            <div>
              <div className='mb-4'>
                <label className='block mb-2 text-sm font-medium text-gray-700'>Drug Name</label>
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
                <label className='block mb-2 text-sm font-medium text-gray-700'>Form</label>
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
                <label className='block mb-2 text-sm font-medium text-gray-700'>Price (VNĐ)</label>
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
          <Button onClick={handleSaveEdit}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Modal */}
      <Modal show={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <Modal.Header>Add New Drug</Modal.Header>
        <Modal.Body>
          <div>
            <div className='mb-4'>
              <label className='block mb-2 text-sm font-medium text-gray-700'>Drug Name</label>
              <TextInput
                value={newDrug.ten}
                placeholder='Enter drug name...'
                onChange={(e) =>
                  setNewDrug({
                    ...newDrug,
                    ten: e.target.value
                  })
                }
              />
            </div>
            <div className='mb-4'>
              <label className='block mb-2 text-sm font-medium text-gray-700'>Form</label>
              <Select
                value={newDrug.dang}
                onChange={(e) =>
                  setNewDrug({
                    ...newDrug,
                    dang: e.target.value
                  })
                }
              >
                <option value=''>Select a form</option>
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
              <label className='block mb-2 text-sm font-medium text-gray-700'>Price (VNĐ)</label>
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
          <Button onClick={handleAdd}>Add</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default DrugPage
