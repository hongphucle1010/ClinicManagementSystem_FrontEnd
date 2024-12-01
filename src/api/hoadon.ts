import { apiClient } from '.'

// export const getDrugHistoryApi = async (params: URLSearchParams) => {
//   const benhnhiId = params.get('searchTerm')
//   console.log(benhnhiId)
//   if (!benhnhiId) {
//     return null
//   }
//   const endpoint = `/benhnhi/pill/${benhnhiId}`
//   const res = await apiClient.get(endpoint)
//   return res.data
// }

export const getBillHistoryApi = async (params: URLSearchParams) => {
  const benhnhiId = params.get('searchTerm')
  console.log(benhnhiId)
  if (!benhnhiId) {
    return null
  }
  const endpoint = `/benhnhi/bill/${benhnhiId}`
  const res = await apiClient.get(endpoint)
  return res.data
}
