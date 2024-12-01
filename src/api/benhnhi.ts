import { apiClient } from '.'

export const getChildrenInfoApi = async (params: URLSearchParams) => {
  const phuhuynhCccd = params.get('phuhuynh_cccd')
  const endpoint = phuhuynhCccd ? `/benhnhi/phuhuynh/${phuhuynhCccd}` : '/benhnhi'
  const res = await apiClient.get(endpoint)
  return res.data
}

export const getMedicalExaminationApi = async (params: URLSearchParams) => {
  const benhnhiId = params.get('benhnhi_id')
  const endpoint = benhnhiId ? `/buoikhambenh/benhnhi/${benhnhiId}` : '/buoikhambenh'
  const res = await apiClient.get(endpoint)
  return res.data
}

export const getDrugHistoryApi = async (params: URLSearchParams) => {
  const benhnhiId = params.get('benhnhi_id')
  if (!benhnhiId) {
    return null
  }
  const endpoint = `/benhnhi/pill/${benhnhiId}`
  const res = await apiClient.get(endpoint)
  return res.data
}
