import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { TextInput, Table, Button, Alert, Card } from 'flowbite-react'

interface HoaDon {
  mahoadon: string
  ngaytao: string
  tongtien: string
  ghichu: string
  maso_bkb: string
  cccd_ph: string
  cccd_tn: string
  trangthai: string
}

interface DonThuoc {
  maso_bkb: string
  maso_th: string
  soluong: number
  cachsd: string
  maso: string
  ten: string
  dang: string
  giaca: string
  column: string
}

interface LanThucHienDichVu {
  madichvu: string
  ngaythuchien: string
  chuandoan: string
  ketluan: string
  ten: string
  giaca: string
  mota: string
}

const HoaDonPage = () => {
  const [search, setSearch] = useState('')
  const [hoaDon, setHoaDon] = useState<HoaDon | null>(null)
  const [donThuoc, setDonThuoc] = useState<DonThuoc[]>([])
  const [lanThucHienDichVu, setLanThucHienDichVu] = useState<LanThucHienDichVu[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!search) {
      alert('Vui lòng nhập mã số buổi khám!')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`http://localhost:4000/api/hoadon/${search}`)
      setHoaDon(response.data.hoadon)
      setDonThuoc(response.data.donthuoc)
      setLanThucHienDichVu(response.data.lanthuchiendichvu)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải dữ liệu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-4 space-y-6'>
      <div className='flex gap-4'>
        <TextInput
          placeholder='Nhập mã số buổi khám'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='flex-grow'
        />
        <Button onClick={handleSearch}>Tìm kiếm</Button>
      </div>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className='text-red-500'>{error}</p>}

      {hoaDon ? (
        <Card className='border rounded-lg shadow-md'>
          <h1 className='text-xl font-bold text-center'>Thông tin hóa đơn</h1>
          <ul className='space-y-2'>
            <li className='text-sm'>
              <strong>Mã hóa đơn:</strong> {hoaDon.mahoadon}
            </li>
            <li className='text-sm'>
              <strong>Ngày tạo:</strong> {new Date(hoaDon.ngaytao).toLocaleString()}
            </li>
            <li className='text-sm'>
              <strong>Tổng tiền:</strong> {hoaDon.tongtien} VND
            </li>
            <li className='text-sm'>
              <strong>Ghi chú:</strong> {hoaDon.ghichu}
            </li>
            <li className='text-sm'>
              <strong>Trạng thái:</strong> {hoaDon.trangthai}
            </li>
          </ul>
        </Card>
      ) : (
        <Alert color='failure' className='text-center'>
          Nhập mã số buổi khám để tìm kiếm hóa đơn.
        </Alert>
      )}

      {donThuoc.length > 0 && (
        <div>
          <h2 className='text-xl font-bold'>Danh sách thuốc</h2>
          <Table>
            <Table.Head>
              <Table.HeadCell>Tên thuốc</Table.HeadCell>
              <Table.HeadCell>Dạng</Table.HeadCell>
              <Table.HeadCell>Số lượng</Table.HeadCell>
              <Table.HeadCell>Đơn giá (VND)</Table.HeadCell>
              <Table.HeadCell>Thành tiền (VND)</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {donThuoc.map((thuoc) => (
                <Table.Row key={thuoc.maso}>
                  <Table.Cell>{thuoc.ten}</Table.Cell>
                  <Table.Cell>{thuoc.dang}</Table.Cell>
                  <Table.Cell>{thuoc.soluong}</Table.Cell>
                  <Table.Cell>{thuoc.giaca}</Table.Cell>
                  <Table.Cell>{thuoc.soluong * parseInt(thuoc.giaca)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}

      {lanThucHienDichVu.length > 0 && (
        <div>
          <h2 className='text-xl font-bold'>Lần thực hiện dịch vụ</h2>
          <Table>
            <Table.Head>
              <Table.HeadCell>Tên dịch vụ</Table.HeadCell>
              <Table.HeadCell>Mô tả</Table.HeadCell>

              <Table.HeadCell>Kết luận</Table.HeadCell>
              <Table.HeadCell>Thành tiền (VND)</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {lanThucHienDichVu.map((dichvu) => (
                <Table.Row key={dichvu.madichvu}>
                  <Table.Cell>{dichvu.ten}</Table.Cell>
                  <Table.Cell>{dichvu.mota}</Table.Cell>

                  <Table.Cell>{dichvu.ketluan}</Table.Cell>
                  <Table.Cell>{dichvu.giaca}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  )
}

export default HoaDonPage