import { useState, useEffect } from 'react'
import { Table, Button, Modal, TextInput, Select, Alert } from 'flowbite-react'
import { getAllServicesApi, addServiceApi, updateServiceApi } from '../api/dichvukham'

import { AiFillMedicineBox } from 'react-icons/ai'

interface Service {
  madichvu: string
  ten: string
  giaca: number
  mota: string
}

const ServiceExamination = () => {
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newService, setNewService] = useState<Service>({
    madichvu: '',
    ten: '',
    giaca: 0,
    mota: ''
  })

  // New state for alerts
  const [alert, setAlert] = useState<{
    type: 'success' | 'failure' | 'warning'
    message: string
  } | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Function to show alert
  const showAlert = (type: 'success' | 'failure' | 'warning', message: string) => {
    setAlert({ type, message })
    // Clear alert after 3 seconds
    setTimeout(() => {
      setAlert(null)
    }, 3000)
  }

  // Fetch all services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAllServicesApi()
        setServices(data)
        setFilteredServices(data)
      } catch (e) {
        console.error(e)
        showAlert('failure', 'Failed to fetch services. Please try again.')
      }
    }
    fetchServices()
  }, [])

  // Search and filter services
  useEffect(() => {
    const filtered = services.filter((service) => service.ten.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredServices(filtered)
  }, [searchTerm, services])

  // Sort services by price
  const sortServices = (order: 'asc' | 'desc') => {
    const sorted = [...filteredServices].sort((a, b) => (order === 'asc' ? a.giaca - b.giaca : b.giaca - a.giaca))
    setFilteredServices(sorted)
  }

  const handleEdit = (service: Service) => {
    setSelectedService(service)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    try {
      if (selectedService) {
        await updateServiceApi(selectedService)
        const updatedServices = services.map((service) =>
          service.madichvu === selectedService.madichvu ? selectedService : service
        )
        setServices(updatedServices)
        setIsEditModalOpen(false)
        showAlert('success', 'Service added successfully!')
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } }
        const axiosMessage = error as { response?: { data?: { message?: string } } }
        const errorType = axiosMessage.response?.data?.message || 'Error: '
        const errorMessage = axiosError.response?.data?.error || 'Failed to update service. Please try again.'
        showAlert('failure', errorType + '. ' + errorMessage)
      } else {
        showAlert('failure', 'Failed to update service. Please try again.')
      }
    }
  }

  const handleAdd = async () => {
    try {
      await addServiceApi(newService)
      const updatedServices = await getAllServicesApi()
      setServices(updatedServices)
      setIsAddModalOpen(false)
      setNewService({ madichvu: '', ten: '', giaca: 0, mota: '' })
      showAlert('success', 'Service updated successfully!')
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } }
        const axiosMessage = error as { response?: { data?: { message?: string } } }
        const errorType = axiosMessage.response?.data?.message || 'Error: '
        const errorMessage = axiosError.response?.data?.error || 'Failed to add service. Please try again.'
        showAlert('failure', errorType + '. ' + errorMessage)
      } else {
        showAlert('failure', 'Failed to add service. Please try again.')
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
        <AiFillMedicineBox className='my-auto me-6' />
        <h1 className='text-3xl text-center font-bold'>Quản Lý Dịch Vụ</h1>
        <AiFillMedicineBox className='my-auto ms-6' />
      </div>
      <div className='m-8 flex justify-between'>
        <Button onClick={() => setIsAddModalOpen(true)}>Thêm Dịch Vụ Mới</Button>
        <TextInput
          className='w-1/2'
          placeholder='Tìm kiếm theo tên dịch vụ...'
          color='info'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={sortOrder}
          onChange={(e) => {
            const order = e.target.value as 'asc' | 'desc'
            setSortOrder(order)
            sortServices(order)
          }}
        >
          <option value='asc'>Giá: Thấp đến Cao</option>
          <option value='desc'>Giá: Cao đến Thấp</option>
        </Select>
      </div>
      <div className='m-8'>
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell>Tên Dịch Vụ</Table.HeadCell>
            <Table.HeadCell>Giá</Table.HeadCell>
            <Table.HeadCell className='w-3/5'>Mô Tả</Table.HeadCell>
            <Table.HeadCell>Thao Tác</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
            {filteredServices.map((service, index) => (
              <Table.Row key={index} className='bg-white hover:bg-sky-100'>
                <Table.Cell>{service.ten}</Table.Cell>
                <Table.Cell>{service.giaca}</Table.Cell>
                <Table.Cell className='w-3/5'>{service.mota}</Table.Cell>
                <Table.Cell>
                  <Button size='xs' color='info' onClick={() => handleEdit(service)}>
                    Sửa
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Edit Modal */}
      <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Modal.Header>Sửa Dịch Vụ</Modal.Header>
        <Modal.Body>
          {selectedService && (
            <div>
              <div className='mb-4'>
                <label className='block mb-2 text-sm font-medium text-gray-700'>Tên Dịch Vụ</label>
                <TextInput
                  value={selectedService.ten}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      ten: e.target.value
                    })
                  }
                />
              </div>
              <div className='mb-4'>
                <label className='block mb-2 text-sm font-medium text-gray-700'>Giá</label>
                <TextInput
                  type='number'
                  value={selectedService.giaca}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      giaca: parseInt(e.target.value)
                    })
                  }
                />
              </div>
              <div className='mb-4'>
                <label className='block mb-2 text-sm font-medium text-gray-700'>Mô Tả</label>
                <TextInput
                  value={selectedService.mota}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      mota: e.target.value
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
        <Modal.Header>Thêm Dịch Vụ Mới</Modal.Header>
        <Modal.Body>
          <div>
            <div className='mb-4'>
              <label className='block mb-2 text-sm font-medium text-gray-700'>Tên Dịch Vụ</label>
              <TextInput
                placeholder='Nhập tên dịch vụ...'
                value={newService.ten}
                onChange={(e) => setNewService({ ...newService, ten: e.target.value })}
              />
            </div>
            <div className='mb-4'>
              <label className='block mb-2 text-sm font-medium text-gray-700'>Giá</label>
              <TextInput
                type='number'
                value={newService.giaca}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    giaca: parseInt(e.target.value)
                  })
                }
              />
            </div>
            <div className='mb-4'>
              <label className='block mb-2 text-sm font-medium text-gray-700'>Mô Tả</label>
              <TextInput
                value={newService.mota}
                placeholder='Nhập mô tả dịch vụ...'
                onChange={(e) => setNewService({ ...newService, mota: e.target.value })}
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

export default ServiceExamination
