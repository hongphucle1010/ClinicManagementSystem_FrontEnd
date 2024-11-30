import { apiClient, childrenEndpoint } from '.'

export const getChildrenInfoApi = async (params: URLSearchParams) => {
  const phuhuynhCccd = params.get('phuhuynh_cccd')
  const endpoint = phuhuynhCccd ? `${childrenEndpoint}/phuhuynh/${phuhuynhCccd}` : childrenEndpoint
  const res = await apiClient.get(endpoint)
  return res.data
}

export const getBuoiKhamBenhApi = async (params: URLSearchParams) => {
  const benhnhiId = params.get('benhnhi_id')
  const endpoint = benhnhiId ? `buoikhambenh/benhnhi/${benhnhiId}` : 'buoikhambenh'
  const res = await apiClient.get(endpoint)
  return res.data
}
