import { useEffect, useState } from 'react'
import { TextInput, Dropdown } from 'flowbite-react'
import axios from 'axios'

interface ServiceSelectorProps {
  newService: Partial<Service>
  setNewService: React.Dispatch<React.SetStateAction<Partial<Service>>>
}

const ServiceSelector = ({ newService, setNewService }: ServiceSelectorProps) => {
  const [serviceData, setServiceData] = useState<Partial<Service>[]>([])

  const handleServiceSelect = (selectedDrug: Partial<Service>) => {
    setNewService({ ...newService, madichvu: selectedDrug.madichvu })
  }

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/dichvukham')
      .then((res) => {
        setServiceData(res.data)
      })
      .catch((err) => {
        console.error(err.message)
      })
  }, [])

  return (
    <div className='flex flex-col space-y-4'>
      <Dropdown label='Mã dịch vụ'>
        {serviceData.map((service) => (
          <Dropdown.Item key={service.madichvu} onClick={() => handleServiceSelect(service)}>
            {service.ten}
          </Dropdown.Item>
        ))}
      </Dropdown>
      <TextInput placeholder='Mã dịch vụ' value={newService.madichvu} readOnly />

      <TextInput
        placeholder='Chuẩn đoán'
        onChange={(e) => setNewService({ ...newService, chuandoan: e.target.value })}
      />
      <TextInput placeholder='Kết luận' onChange={(e) => setNewService({ ...newService, ketluan: e.target.value })} />
      <TextInput
        placeholder='CCCD nhân viên thực hiện'
        onChange={(e) => setNewService({ ...newService, cccd_nvyt: e.target.value })}
      />
    </div>
  )
}

export default ServiceSelector
