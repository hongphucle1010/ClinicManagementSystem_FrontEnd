import { apiClient } from '.'

export const getAllDrugsApi = async () => {
  const endpoint = '/thuoc';
  const res = await apiClient.get(endpoint);
  return res.data;
};

export const addDrugApi = async (drugData: {
  ten: string;
  dang: string;
  giaca: number;
}) => {
  const endpoint = '/thuoc/add';
  const res = await apiClient.post(endpoint, drugData);
  return res.data;
};

export const updateDrugApi = async (drugData: {
  maso: string;
  ten: string;
  dang: string;
  giaca: number;
}) => {
  const endpoint = '/thuoc/update';
  const res = await apiClient.put(endpoint, drugData);
  return res.data;
};
export const deleteDrugApi = async (maso: string) => {
  const endpoint = '/thuoc/delete';
  const res = await apiClient.delete(endpoint, { data: { maso } });
  return res.data;
};