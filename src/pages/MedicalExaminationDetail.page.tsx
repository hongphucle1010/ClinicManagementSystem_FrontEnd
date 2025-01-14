/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Table, Button, Modal, TextInput, Alert, Dropdown } from 'flowbite-react'
import axios from 'axios'
import { Bounce, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DrugSelector from '../components/DrugForm'
import ServiceSelector from '../components/ServiceForm'

// const GeneralInfo = (medicalInfo: any) => {
//   return (
//     <Card className='space-y-4 p-4 border rounded-lg shadow-md'>
//       <ul className='space-y-2'>
//         <li className='text-sm'>
//           <strong>Mã số:</strong> {medicalInfo.maso}
//         </li>
//         <li className='text-sm'>
//           <strong>Ngày khám:</strong> {new Date(medicalInfo.ngaykham).toLocaleString()}
//         </li>
//         <li className='text-sm'>
//           <strong>Ngày tái khám:</strong> {medicalInfo.taikham ? 'Có' : 'Không'}
//         </li>
//         <li className='text-sm'>
//           <strong>Trạng thái:</strong> {medicalInfo.trangthai}
//         </li>
//         <li className='text-sm'>
//           <strong>Huyết áp:</strong> {medicalInfo.huyetap}
//         </li>
//         <li className='text-sm'>
//           <strong>Nhiệt độ:</strong> {medicalInfo.nhietdo}°C
//         </li>
//         <li className='text-sm'>
//           <strong>Chẩn đoán:</strong> {medicalInfo.chandoan}
//         </li>
//         <li className='text-sm'>
//           <strong>Kết luận:</strong> {medicalInfo.ketluan}
//         </li>
//         <li className='text-sm'>
//           <strong>Mã số bệnh nhân:</strong> {medicalInfo.maso_bn}
//         </li>
//         <li className='text-sm'>
//           <strong>CCCD Bác sĩ:</strong> {medicalInfo.cccd_bs}
//         </li>

//         <li className='text-sm'>
//           <strong>Chuyên khoa:</strong> {medicalInfo.chuyenkhoa}
//         </li>
//         <li className='text-sm'>
//           <strong>Bằng cấp:</strong> {medicalInfo.bangcap}
//         </li>
//         <li className='text-sm'>
//           <strong>Chứng chỉ hành nghề:</strong> {medicalInfo.cc_hanhnghe}
//         </li>
//       </ul>
//     </Card>
//   )
// }

const MedicalRecord = () => {
  const [drugs, setDrugs] = useState<SoluongDrug[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription>({
    maso_bkb: '',
    tongtien: 0,
    ghichu: '',
    cccd_ph: '',
    cccd_tn: '',
    trangthai: 'PENDING'
  })
  // const [hoadon, setHoadon] = useState<any>(null)
  const [isDrugModalOpen, setDrugModalOpen] = useState(false)
  const [isServiceModalOpen, setServiceModalOpen] = useState(false)
  const [isPrescriptionModalOpen, setPrescriptionModalOpen] = useState(false)

  const [newDrug, setNewDrug] = useState<Partial<SoluongDrug>>({})
  const [newService, setNewService] = useState<Partial<Service>>({})

  // const [medicalInfo, setMedicalInfo] = useState<MedicalExamination>({
  //   maso: '',
  //   ngaykham: '',
  //   taikham: false,
  //   trangthai: '',
  //   huyetap: '',
  //   nhietdo: 0,
  //   chandoan: '',
  //   ketluan: '',
  //   maso_bn: '',
  //   cccd_bs: '',
  //   chuyenkhoa: '',
  //   bangcap: '',
  //   cc_hanhnghe: ''
  // })

  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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
    axios
      .post(`http://localhost:4000/api/soluongthuoc/add`, data)
      .then(() => {
        toast.success('Thêm thuốc thành công!', {
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
        toast.error(err.message, {
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
    axios
      .post(`http://localhost:4000/api/lanthuchiendichvu/add`, data)
      .then(() => {
        toast.success('Thêm dịch vụ thành công!', {
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
        toast.error(err.message, {
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

  const addPrescription = async () => {
    try {
      // Send POST request using Axios
      const data = { ...prescriptions, maso_bkb: msbkb }
      const response = await axios.post('http://localhost:4000/api/hoadon/add', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Check if the response is successful
      if (response.status === 200) {
        setSuccessMessage(response.data.message)
        setError(null)
        setPrescriptionModalOpen(false) // Close modal on success
      } else {
        setError(response.data.message || 'An error occurred')
        setSuccessMessage(null)
      }
    } catch (error: any) {
      // Handle errors from Axios
      setError(error.response?.data?.message || 'Failed to connect to the server')
      setSuccessMessage(null)
    }
  }

  const handlePrescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPrescriptions((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const deleteDrug = (maso: string) => {
    setDrugs(drugs.filter((drug) => drug.maso_th !== maso))
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
        // setMedicalInfo(res.data.buoikhambenh)
        // setHoadon(res.data.hoadon)
      })
      .catch((err) => {
        console.error(err.message)
      })
  }, [msbkb])

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold'>Hồ Sơ Y Tế</h1>
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
      <h2 className='text-lg font-semibold mt-4'>Thuốc</h2>

      <Table>
        <Table.Head>
          <Table.HeadCell>Tên</Table.HeadCell>
          <Table.HeadCell>Cách Sử Dụng</Table.HeadCell>
          <Table.HeadCell>Dạng</Table.HeadCell>
          <Table.HeadCell>Số Lượng</Table.HeadCell>
          <Table.HeadCell>Hành Động</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {drugs.map((drug) => (
            <Table.Row key={drug.maso_th}>
              <Table.Cell>{drug.ten}</Table.Cell>
              <Table.Cell>{drug.cachsd}</Table.Cell>
              <Table.Cell>{drug.dang}</Table.Cell>
              <Table.Cell>{drug.soluong}</Table.Cell>
              <Table.Cell>
                <Button color='failure' onClick={() => deleteDrug(drug.maso_th)}>
                  Xóa
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Button onClick={() => setDrugModalOpen(true)} className='my-4 mx-auto w-1/4'>
        Add Drug
      </Button>

      <h2 className='text-lg font-semibold mt-4'>Dịch vụ</h2>

      <Table>
        <Table.Head>
          <Table.HeadCell>Tên</Table.HeadCell>
          <Table.HeadCell>Mô Tả</Table.HeadCell>
          <Table.HeadCell>Ngày Thực Hiện</Table.HeadCell>
          <Table.HeadCell>Kết Luận</Table.HeadCell>
          <Table.HeadCell>Hành Động</Table.HeadCell>
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
                  Xóa
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Button onClick={() => setServiceModalOpen(true)} className='my-4 mx-auto w-1/4'>
        Add Service
      </Button>
      {/* Add Drug Modal */}
      <Modal show={isDrugModalOpen} onClose={() => setDrugModalOpen(false)}>
        <Modal.Header>Thêm Thuốc</Modal.Header>
        <Modal.Body>
          <DrugSelector newDrug={newDrug} setNewDrug={setNewDrug} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={addDrug}>Thêm</Button>
          <Button color='gray' onClick={() => setDrugModalOpen(false)}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Service Modal */}
      <Modal show={isServiceModalOpen} onClose={() => setServiceModalOpen(false)}>
        <Modal.Header>Add Service</Modal.Header>
        <Modal.Body>
          <ServiceSelector newService={newService} setNewService={setNewService} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={addService}>Add</Button>
          <Button color='gray' onClick={() => setServiceModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Service Modal */}
      <Modal show={isPrescriptionModalOpen} onClose={() => setPrescriptionModalOpen(false)}>
        <Modal.Header>Add Service</Modal.Header>
        <Modal.Body>
          {error && <Alert color='failure'>{error}</Alert>}
          {successMessage && <Alert color='success'>{successMessage}</Alert>}
          <div className='space-y-4'>
            <TextInput
              name='ghichu'
              value={prescriptions.ghichu}
              onChange={handlePrescriptionChange}
              placeholder='Ghi chú'
            />
            <TextInput
              name='cccd_ph'
              value={prescriptions.cccd_ph}
              onChange={handlePrescriptionChange}
              placeholder='CCCD phụ huynh'
            />
            <TextInput
              name='cccd_tn'
              value={prescriptions.cccd_tn}
              onChange={handlePrescriptionChange}
              placeholder='CCCD thu ngân'
            />
            <div className='flex gap-3'>
              <TextInput
                name='trangthai'
                className='flex-grow'
                readOnly
                value={prescriptions.trangthai}
                placeholder='Trạng thái'
              />

              <Dropdown label='Trạng thái'>
                <Dropdown.Item onClick={() => setPrescriptions((prev) => ({ ...prev, trangthai: 'PENDING' }))}>
                  PENDING
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPrescriptions((prev) => ({ ...prev, trangthai: 'PAID' }))}>
                  PAID
                </Dropdown.Item>
              </Dropdown>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={addPrescription}>Thêm</Button>
          <Button color='gray' onClick={() => setPrescriptionModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default MedicalRecord
