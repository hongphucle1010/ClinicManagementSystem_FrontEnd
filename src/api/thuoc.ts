import { apiClient } from '.'
export const getDrugAvailableApi = async () => {
    const res = await apiClient.get('/thuoc')
    return res.data as Drug[]
  }

