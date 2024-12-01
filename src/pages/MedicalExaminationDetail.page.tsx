import { useEffect, useState } from 'react'
import { Table, Button, TextInput, Modal } from 'flowbite-react'
import axios from 'axios'

const MedicalRecord = () => {
  const [drugs, setDrugs] = useState<SoluongDrug[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [isDrugModalOpen, setDrugModalOpen] = useState(false)
  const [isServiceModalOpen, setServiceModalOpen] = useState(false)
  const [newDrug, setNewDrug] = useState<Partial<SoluongDrug>>({})
  const [newService, setNewService] = useState<Partial<Service>>({})

  const [drugAvailable, setDrugAvailable] = useState<SoluongDrug[]>([])
  const queryParams = new URLSearchParams(location.search)
  const msbkb = queryParams.get('maso_bkb')

  const addDrug = () => {
    setDrugModalOpen(false)

    const data = {
      MASO_BKB: msbkb,
      MASO_TH: newDrug.maso_th,
      SOLUONG: newDrug.soluong,
      CACHSD: newDrug.cachsd
    }
    console.log(data)
    axios.post(`http://localhost:4000/api/soluongthuoc/add`, data)
    axios
      .get(`http://localhost:4000/api/buoikhambenh/${msbkb}`)
      .then((res) => {
        //setDrugs(res.data)
        console.log(res.data)
        setDrugs(res.data.donthuoc)
        setServices(res.data.lanthuchiendichvu)
      })
      .catch((err) => {
        console.error(err.message)
      })
  }

  const addService = () => {
    setServiceModalOpen(false)
    const data = { ...newService, maso_bkb: msbkb }
    console.log(data)
    axios.post(`http://localhost:4000/api/lanthuchiendichvu/add`, data).catch((err) => {
      console.error(err.message)
    })
    axios
      .get(`http://localhost:4000/api/buoikhambenh/${msbkb}`)
      .then((res) => {
        //setDrugs(res.data)
        console.log(res.data)
        setDrugs(res.data.donthuoc)
        setServices(res.data.lanthuchiendichvu)
      })
      .catch((err) => {
        console.error(err.message)
      })
  }

  const deleteDrug = (maso: string) => {
    setDrugs(drugs.filter((drug) => drug.maso !== maso))
  }

  const deleteService = (madichvu: string) => {
    setServices(services.filter((service) => service.madichvu !== madichvu))
  }
  useEffect(() => {
    // Call API to get drugs and services
    axios
      .get(`http://localhost:4000/api/buoikhambenh/${msbkb}`)
      .then((res) => {
        //setDrugs(res.data)
        console.log(res.data)
        setDrugs(res.data.donthuoc)
        setServices(res.data.lanthuchiendichvu)
      })
      .catch((err) => {
        console.error(err.message)
      })

    axios
      .get('http://localhost:4000/api/thuoc')
      .then((res) => {
        setDrugAvailable(res.data)
      })
      .catch((err) => {
        console.error(err.message)
      })
  }, [])

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold'>Medical Record</h1>
      {/* {
      maso_bkb: "1446b778-b4a0-47a8-a7fa-a5caa1f37bf3",
      maso_th: "1e48359c-dfb1-4dc1-a8a3-e733ee86e544",
      soluong: 200,
      cachsd: "KHOGN BIET",
      maso: "1e48359c-dfb1-4dc1-a8a3-e733ee86e544",
      ten: "Metformin",
      dang: "Viên nén",
      giaca: "10000",
    }, */}
      {/* Drugs Section */}
      <h2 className='text-lg font-semibold mt-4'>Drugs</h2>

      <Table>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Use</Table.HeadCell>
          <Table.HeadCell>Form</Table.HeadCell>
          <Table.HeadCell>Quantity</Table.HeadCell>
          <Table.HeadCell>Action</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {drugs.map((drug) => (
            <Table.Row key={drug.maso}>
              <Table.Cell>{drug.ten}</Table.Cell>
              <Table.Cell>{drug.cachsd}</Table.Cell>
              <Table.Cell>{drug.dang}</Table.Cell>
              <Table.Cell>{drug.soluong}</Table.Cell>
              <Table.Cell>
                <Button color='failure' onClick={() => deleteDrug(drug.maso)}>
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Button onClick={() => setDrugModalOpen(true)} className='my-2'>
        Add Drug
      </Button>
      {/* Services Section */}
      {/* madichvu: string
  ngaythuchien: string
  chuandoan: string
  ketluan: string
  ten: string
  giaca: string
  mota: string */}
      <h2 className='text-lg font-semibold mt-4'>Services</h2>

      <Table>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Description</Table.HeadCell>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Conclusion</Table.HeadCell>
          <Table.HeadCell>Action</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {services.map((service) => (
            <Table.Row key={service.madichvu}>
              <Table.Cell>{service.ten}</Table.Cell>
              <Table.Cell>{service.mota}</Table.Cell>
              <Table.Cell>{service.ngaythuchien}</Table.Cell>
              <Table.Cell>{service.ketluan}</Table.Cell>
              <Table.Cell className='text-right'>
                <Button color='failure' onClick={() => deleteService(service.madichvu)}>
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Button onClick={() => setServiceModalOpen(true)} className='my-2'>
        Add Service
      </Button>
      {/* Add Drug Modal */}
      <Modal show={isDrugModalOpen} onClose={() => setDrugModalOpen(false)}>
        <Modal.Header>Add Drug</Modal.Header>
        <Modal.Body>
          <TextInput placeholder='Mã thuốc' onChange={(e) => setNewDrug({ ...newDrug, maso_th: e.target.value })} />
          <TextInput
            placeholder='Số lượng'
            onChange={(e) => setNewDrug({ ...newDrug, soluong: parseInt(e.target.value) })}
          />
          <TextInput placeholder='Cách sử dụng' onChange={(e) => setNewDrug({ ...newDrug, cachsd: e.target.value })} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={addDrug}>Add</Button>
          <Button color='gray' onClick={() => setDrugModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Service Modal */}
      <Modal show={isServiceModalOpen} onClose={() => setServiceModalOpen(false)}>
        <Modal.Header>Add Service</Modal.Header>
        <Modal.Body>
          <TextInput
            placeholder='Mã dịch vụ'
            onChange={(e) => setNewService({ ...newService, madichvu: e.target.value })}
          />
          <TextInput
            placeholder='Chuẩn đoán'
            onChange={(e) => setNewService({ ...newService, chuandoan: e.target.value })}
          />
          <TextInput
            placeholder='Kết luận'
            onChange={(e) => setNewService({ ...newService, ketluan: e.target.value })}
          />
          <TextInput
            placeholder='CCCD nhân viên thực hiện'
            onChange={(e) => setNewService({ ...newService, cccd_nvth: e.target.value })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={addService}>Add</Button>
          <Button color='gray' onClick={() => setServiceModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default MedicalRecord
