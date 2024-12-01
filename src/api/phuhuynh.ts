import { apiClient } from '.'

export const getAllParentsApi = async () => {
  const res = await apiClient.get('/phuhuynh')
  return res.data
}

export const addParentApi = async (data: Partial<Parent>) => {
  const res = await apiClient.post<ApiResponse<Parent>>('/phuhuynh/add', data)
  return res.data
}

export const deleteParentApi = async (cccd: string) => {
  const res = await apiClient.delete(`/phuhuynh/delete/`, { data: { cccd } })
  return res.data
}
