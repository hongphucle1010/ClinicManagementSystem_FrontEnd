import { apiClient } from '.'

export const getAllParentsApi = async () => {
  const res = await apiClient.get('/phuhuynh')
  return res.data
}
