import { useState } from 'react'
import { Table, Button, TextInput, Modal } from 'flowbite-react'

const MedicalRecord = () => {
  const [drugs, setDrugs] = useState<Drug[]>([
    {
      maso_bkb: '1446b778-b4a0-47a8-a7fa-a5caa1f37bf3',
      maso_th: '1e48359c-dfb1-4dc1-a8a3-e733ee86e544',
      soluong: 200,
      cachsd: 'KHOGN BIET',
      maso: '1e48359c-dfb1-4dc1-a8a3-e733ee86e544',
      ten: 'Metformin',
      dang: 'Viên nén',
      giaca: '10000'
    }
  ])
  const [services, setServices] = useState<Service[]>([
    {
      madichvu: '45563343-c8a0-4d3c-a759-7c2b4a8c285a',
      ngaythuchien: '2024-11-22T17:00:00.000Z',
      chuandoan: 'Diagnosis: Hypertension, high blood pressure',
      ketluan: 'Prescribed medication to control blood pressure',
      ten: 'Noi Soi',
      giaca: '600000',
      mota: 'Kiem tra noi soi day day'
    }
  ])
  const [isDrugModalOpen, setDrugModalOpen] = useState(false)
  const [isServiceModalOpen, setServiceModalOpen] = useState(false)
  const [newDrug, setNewDrug] = useState<Partial<Drug>>({})
  const [newService, setNewService] = useState<Partial<Service>>({})

  const addDrug = () => {
    setDrugs([...drugs, { ...newDrug, maso: Date.now().toString() } as Drug])
    setDrugModalOpen(false)
  }

  const addService = () => {
    setServices([...services, { ...newService, madichvu: Date.now().toString() } as Service])
    setServiceModalOpen(false)
  }

  const deleteDrug = (maso: string) => {
    setDrugs(drugs.filter((drug) => drug.maso !== maso))
  }

  const deleteService = (madichvu: string) => {
    setServices(services.filter((service) => service.madichvu !== madichvu))
  }

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
          <TextInput placeholder='Name' onChange={(e) => setNewDrug({ ...newDrug, ten: e.target.value })} />
          <TextInput placeholder='Form' onChange={(e) => setNewDrug({ ...newDrug, dang: e.target.value })} />
          <TextInput
            placeholder='Price'
            type='number'
            onChange={(e) => setNewDrug({ ...newDrug, giaca: e.target.value })}
          />
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
          <TextInput placeholder='Name' onChange={(e) => setNewService({ ...newService, ten: e.target.value })} />
          <TextInput
            placeholder='Description'
            onChange={(e) => setNewService({ ...newService, mota: e.target.value })}
          />
          <TextInput
            placeholder='Price'
            type='number'
            onChange={(e) => setNewService({ ...newService, giaca: e.target.value })}
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
