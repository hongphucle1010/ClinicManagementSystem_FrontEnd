interface ApiResponse<T> {
  message: string
  data: T
}

interface ApiMessageOnlyResponse {
  message: string
}

interface AddChildrenResponse {
  maso_bn: string
  hoten: string
  quanhe: string
  phuhuynh_cccd: string
}

interface AddChildrenParams {
  hoten: string
  ngaysinh: string
  gioitinh: 'Nam' | 'Nữ'
  chieucao: number
  cannang: number
  bmi: number
  tiensubenh: string
  masobhyt: string
  cccd: string
  quanhe: string
}

interface UpdateChildrenParams {
  maso: string
  hoten: string
  ngaysinh: string
  gioitinh: 'Nam' | 'Nữ'
  chieucao: number
  cannang: number
  tiensubenh: string
  masobhyt: string
}
