import { apiClient } from '.'

export const getAllServicesApi = async () => {
  const endpoint = '/dichvukham'
  const res = await apiClient.get(endpoint)
  return res.data
}

export const addServiceApi = async (serviceData: { ten: string; giaca: number; mota: string }) => {
  const endpoint = '/dichvukham/add'
  const res = await apiClient.post(endpoint, serviceData)
  return res.data
}

export const updateServiceApi = async (serviceData: { madichvu: string; ten: string; giaca: number; mota: string }) => {
  const endpoint = '/dichvukham/update'
  const res = await apiClient.put(endpoint, serviceData)
  return res.data
}
