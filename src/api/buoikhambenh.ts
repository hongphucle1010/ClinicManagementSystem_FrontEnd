import { apiClient } from '.'

export const getMedicalExaminationApi = async (params: URLSearchParams) => {
  const benhnhiId = params.get('benhnhi_id')
  const endpoint = benhnhiId ? `/buoikhambenh/benhnhi/${benhnhiId}` : '/buoikhambenh'
  const res = await apiClient.get(endpoint)
  return res.data
}

export const addMedicalExaminationApi = async (data: Partial<MedicalExamination>) => {
  const res = await apiClient.post<ApiResponse<MedicalExamination>>('/buoikhambenh/add', data)
  return res.data
}
