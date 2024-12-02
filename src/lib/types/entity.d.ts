interface Child {
  maso: string
  hoten: string
  ngaysinh: string
  gioitinh: 'Nam' | 'Nữ'
  chieucao: number
  cannang: number
  bmi: number
  tiensubenh: string
  masobhyt: string
}

interface Parent {
  cccd: string
  hoten: string
  sdt: string
  sonha: string
  tenduong: string
  phuong: string
  huyen: string
  tinh: string
}

interface MedicalExamination {
  maso: string
  ngaykham: string
  taikham: boolean
  trangthai: string
  huyetap: string
  nhietdo: number
  chandoan: string
  ketluan: string
  maso_bn: string
  cccd_bs: string
}

interface SoluongDrug {
  maso_bkb: string
  maso_th: string
  soluong: number
  cachsd: string
  ms: string
  ten: string
  dang: string
  giaca: string
}

interface Drug {
  maso: string
  ten: string
  dang: string
  tong_so_luong: number
  tong_gia_tien: number
  ms: string
}
interface Bill {
  maso: string
  ngaytao: string
  tongtien: number
  maso_bkb: string
  hoten_bn: string
  hoten_ph: string
}

interface Service {
  madichvu: string
  ngaythuchien: string
  chuandoan: string
  ketluan: string
  ten: string
  giaca: string
  mota: string
  cccd_nvth: string
}

interface BKB {
  bkb_maso: string
  ngaykham: string
  trangthai: string
  benh_nhi_maso: string
  ten_bn: string
}
