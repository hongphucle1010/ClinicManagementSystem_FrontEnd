import { apiClient } from '.'

export const getChildrenInfoApi = async (params: URLSearchParams) => {
  const phuhuynhCccd = params.get('phuhuynh_cccd')
  const endpoint = phuhuynhCccd ? `/benhnhi/phuhuynh/${phuhuynhCccd}` : '/benhnhi'
  const res = await apiClient.get(endpoint)
  return res.data
}

export const getDrugHistoryApi = async (params: URLSearchParams) => {
  const benhnhiId = params.get('searchTermDrug')
  console.log(benhnhiId)
  if (!benhnhiId) {
    return null
  }
  const endpoint = `/benhnhi/pill/${benhnhiId}`
  const res = await apiClient.get(endpoint)
  return res.data
}
export const addChildrenApi = async (data: Partial<Child>) => {
  const res = await apiClient.post<ApiResponse<AddChildrenResponse>>('/benhnhi/add', data)
  return res.data
}

export const deleteChildrenApi = async (maso: string) => {
  const res = await apiClient.delete(`/benhnhi/delete/`, { data: { maso } })
  return res.data
}

export const updateChildrenApi = async (data: UpdateChildrenParams) => {
  const res = await apiClient.put<ApiMessageOnlyResponse>('/benhnhi/update', data)
  return res.data
}
