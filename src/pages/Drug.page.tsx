import { useState, useEffect } from 'react'
import { Table, Button, Modal, TextInput } from 'flowbite-react'
import { getAllDrugsApi, addDrugApi, updateDrugApi, deleteDrugApi } from '../api/thuoc'

interface Drug {
  maso: string
  ten: string
  dang: string
  giaca: number
}

const DrugPage = () => {
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newDrug, setNewDrug] = useState<Drug>({
    maso: '',
    ten: '',
    dang: '',
    giaca: 0
  })

  useEffect(() => {
    const fetchDrugs = async () => {
      const data = await getAllDrugsApi()
      setDrugs(data)
    }
    fetchDrugs()
  }, [])

  const handleEdit = (drug: Drug) => {
    setSelectedDrug(drug)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (selectedDrug) {
      await updateDrugApi(selectedDrug)
      const updatedDrugs = drugs.map((drug) => (drug.maso === selectedDrug.maso ? selectedDrug : drug))
      setDrugs(updatedDrugs)
      setIsEditModalOpen(false)
    }
  }

  const handleAdd = async () => {
    await addDrugApi(newDrug)
    const updatedDrugs = await getAllDrugsApi()
    setDrugs(updatedDrugs)
    setIsAddModalOpen(false)
  }

  const handleDelete = async (maso: string) => {
    await deleteDrugApi(maso)
    const updatedDrugs = drugs.filter((drug) => drug.maso !== maso)
    setDrugs(updatedDrugs)
  }

  return (
    <div>
      <div className='mb-4 flex justify-between'>
        <h1 className='text-xl font-bold'>Drug Management</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add New Drug</Button>
      </div>

      <Table hoverable={true}>
        <Table.Head>
          <Table.HeadCell>Drug Name</Table.HeadCell>
          <Table.HeadCell>Form</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className='divide-y'>
          {drugs.map((drug, index) => (
            <Table.Row key={index} className='bg-white hover:bg-gray-100'>
              <Table.Cell>{drug.ten}</Table.Cell>
              <Table.Cell>{drug.dang}</Table.Cell>
              <Table.Cell>{drug.giaca}</Table.Cell>
              <Table.Cell>
                <div className='flex gap-2'>
                  <Button size='xs' color='info' onClick={() => handleEdit(drug)}>
                    Edit
                  </Button>
                  <Button size='xs' color='failure' onClick={() => handleDelete(drug.maso)}>
                    Delete
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

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
                <TextInput
                  value={selectedDrug.dang}
                  onChange={(e) =>
                    setSelectedDrug({
                      ...selectedDrug,
                      dang: e.target.value
                    })
                  }
                />
              </div>
              <div className='mb-4'>
                <label className='block mb-2 text-sm font-medium text-gray-700'>Price</label>
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
              <TextInput
                value={newDrug.dang}
                onChange={(e) =>
                  setNewDrug({
                    ...newDrug,
                    dang: e.target.value
                  })
                }
              />
            </div>
            <div className='mb-4'>
              <label className='block mb-2 text-sm font-medium text-gray-700'>Price</label>
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
