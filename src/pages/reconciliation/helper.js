import { app } from '@root/config';
import { getCsvFileHelper2 } from '@utils/getCsvFileHelper';
import axios from 'axios';

export const getResults = async (page, count, id) => {
  const baseUrl = `${app.api}/reconciliation/results`;
  const params = new URLSearchParams();
  if (id) {
    params.append('reconciliation', id);
  }
  params.append('page', page);
  params.append('count', count);
  const response = await axios.get(`${baseUrl}?${params.toString()}`);
  return response.data;
};

export const getResults2 = async (page, count) => {
  const response = await axios.get(
    `${app.api}/reconciliation?page=${page}&count=${count}`
  );
  return response.data;
};
export const getBanks = async () => {
  const response = await axios.get(`${app.api}/banks`);
  return response.data;
};

export const getMerchants = async () => {
  const response = await axios.get(`${app.api}/merchants`);
  return response.data;
};
export const getStatuses = async () => {
  const response = await axios.get(
    `${app.api}/reconciliation/results/statuses`
  );
  return response.data;
};
export const getStatuses2 = async () => {
  const response = await axios.get(
    `${app.api}/reconciliation/statuses`
  );
  return response.data;
};
export const getTypes = async () => {
  const response = await axios.get(`${app.api}/reconciliation/job`);
  return response.data;
};
export const resolved = async (id) => {
  const response = await axios.post(
    `${app.api}/reconciliation/results/${id}/resolve`
  );
  return response.data;
};
export const getFileReconciliation = async (id) => {
  const response = await axios
    .get(`${app.api}/reconciliation/results/report?reconciliation=${id}`)
    .then((res) => {
      const { data, headers } = res;
      getCsvFileHelper2({ data, headers });
    });
};

export const uploadFile = async (file, uid) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(
    `${app.api}/reconciliation/job/${uid}/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};