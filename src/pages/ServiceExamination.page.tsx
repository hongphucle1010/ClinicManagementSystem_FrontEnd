import { useState, useEffect } from 'react'
import { Table, Button, Modal, TextInput, Select } from 'flowbite-react'
import { getAllServicesApi, addServiceApi, updateServiceApi } from '../api/dichvukham'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Fetch all services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      const data = await getAllServicesApi()
      setServices(data)
      setFilteredServices(data)
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
    if (selectedService) {
      await updateServiceApi(selectedService)
      const updatedServices = services.map((service) =>
        service.madichvu === selectedService.madichvu ? selectedService : service
      )
      setServices(updatedServices)
      setIsEditModalOpen(false)
    }
  }

  const handleAdd = async () => {
    await addServiceApi(newService)
    const updatedServices = await getAllServicesApi()
    setServices(updatedServices)
    setIsAddModalOpen(false)
  }

  return (
    <div>
      <div className='m-4 flex justify-between'>
        <Button onClick={() => setIsAddModalOpen(true)}>Add New Service</Button>
        <TextInput
          className='w-1/2'
          placeholder='Search by service name'
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
          <option value='asc'>Price: Low to High</option>
          <option value='desc'>Price: High to Low</option>
        </Select>
      </div>
      <div className='m-4'>
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell>Service Name</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
            {filteredServices.map((service, index) => (
              <Table.Row key={index} className='bg-white hover:bg-gray-100'>
                <Table.Cell>{service.ten}</Table.Cell>
                <Table.Cell>{service.giaca}</Table.Cell>
                <Table.Cell>{service.mota}</Table.Cell>
                <Table.Cell>
                  <Button size='xs' color='info' onClick={() => handleEdit(service)}>
                    Edit
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Edit Modal */}
      <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Modal.Header>Edit Service</Modal.Header>
        <Modal.Body>
          {selectedService && (
            <div>
              <div className='mb-4'>
                <label className='block mb-2 text-sm font-medium text-gray-700'>Service Name</label>
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
                <label className='block mb-2 text-sm font-medium text-gray-700'>Price</label>
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
                <label className='block mb-2 text-sm font-medium text-gray-700'>Description</label>
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
          <Button onClick={handleSaveEdit}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Modal */}
      <Modal show={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <Modal.Header>Add New Service</Modal.Header>
        <Modal.Body>
          <div>
            <div className='mb-4'>
              <label className='block mb-2 text-sm font-medium text-gray-700'>Service Name</label>
              <TextInput
                value={newService.ten}
                onChange={(e) => setNewService({ ...newService, ten: e.target.value })}
              />
            </div>
            <div className='mb-4'>
              <label className='block mb-2 text-sm font-medium text-gray-700'>Price</label>
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
              <label className='block mb-2 text-sm font-medium text-gray-700'>Description</label>
              <TextInput
                value={newService.mota}
                onChange={(e) => setNewService({ ...newService, mota: e.target.value })}
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

export default ServiceExamination
