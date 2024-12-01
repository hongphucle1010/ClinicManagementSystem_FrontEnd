import { apiClient } from '.'

export const getBKBHistoryApi = async (params: URLSearchParams) => {
  const from = params.get('from')
  const to = params.get('to')
  const cccd = params.get('cccd')
  if (!cccd) return []
  console.log(from, to, cccd)

  const res = await apiClient.post('/bacsi/bkb', { params: { from, to, cccd } })
  return res.data
}
