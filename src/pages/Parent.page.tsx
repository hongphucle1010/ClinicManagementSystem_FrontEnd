import React, { useState } from 'react'
import { Button, Table, Modal, TextInput } from 'flowbite-react'
import ParentForm from '../components/ParentComponent/Parent.component'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate hook
import { addParentApi, deleteParentApi, getAllParentsApi } from '../api/phuhuynh'
import { Bounce, toast } from 'react-toastify'

const ParentManagement: React.FC = () => {
  const [Parents, setParents] = useState<Parent[]>([])

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)

  const addParent = (parent: Parent) => {
    addParentApi(parent).then((res) => {
      console.log(res)
      setParents([...Parents, res.data])
    })
    setShowModal(false)
  }

  const filteredParents = Parents.filter(
    (Parent) => Parent.hoten.toLowerCase().includes(searchTerm.toLowerCase()) || Parent.cccd.includes(searchTerm)
  )

  const handleViewButton = (cccd: string) => {
    // Chuyển hướng đến trang chi tiết phụ huynh
    navigate(`/children?phuhuynh_cccd=${cccd}`)
  }

  const handleDeleteButton = (cccd: string) => {
    deleteParentApi(cccd)
      .then((res) => {
        console.log(res)
        setParents(Parents.filter((Parent) => Parent.cccd !== cccd))
      })
      .catch((err) => {
        setError(err.message)
      })
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
    <div className='p-6 bg-gray-50 min-h-screen'>
      <h1 className='text-2xl font-bold mb-6'>Quản lý phụ huynh</h1>

      {/* Thanh tìm kiếm */}
      <div className='mb-4 flex gap-4'>
        <TextInput
          id='search'
          type='text'
          placeholder='Tìm kiếm theo tên hoặc CCCD'
          value={searchTerm}
          onChange={handleSearch}
          className='flex-grow'
        />
        <Button onClick={() => setShowModal(true)}>Thêm phụ huynh</Button>
      </div>

      {/* Bảng phụ huynh */}
      <Table hoverable={true}>
        <Table.Head>
          <Table.HeadCell>Tên</Table.HeadCell>
          <Table.HeadCell>CCCD</Table.HeadCell>
          <Table.HeadCell>Số điện thoại</Table.HeadCell>
          <Table.HeadCell>Địa chỉ</Table.HeadCell>
          <Table.HeadCell>Hành động</Table.HeadCell>
        </Table.Head>
        <Table.Body className='divide-y'>
          {filteredParents.map((Parent, index) => (
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
                  <Button size='xs' color='failure' onClick={() => handleDeleteButton(Parent.cccd)}>
                    Xóa
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Modal thêm phụ huynh */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Thêm phụ huynh</Modal.Header>
        <Modal.Body>
          <ParentForm onSubmit={addParent} />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ParentManagement
