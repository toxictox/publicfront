import { app } from '@root/config';
import { getCsvFileHelper2 } from '@utils/getCsvFileHelper';
import axios from 'axios';

export const getResults = async (page, count, id, filterValueResults) => {
  const baseUrl = `${app.api}/reconciliation/results`;
  const bankParams = filterValueResults?.bankId?.length
    ? filterValueResults.bankId.map((bank) => `banks[]=${bank}`).join('&')
    : '';
  const merchantParams = filterValueResults?.merchants?.length
    ? filterValueResults.merchants
        .map((merchant) => `merchants[]=${merchant}`)
        .join('&')
    : '';
  const statusParams = filterValueResults?.statuses?.length
    ? filterValueResults.statuses
        .map((status) => `statuses[]=${status}`)
        .join('&')
    : '';
  const typesParams = filterValueResults?.jobs?.length
    ? filterValueResults.jobs.map((job) => `jobs[]=${job}`).join('&')
    : '';

  const params = [
    `page=${page}`,
    `count=${count}`,
    id ? `reconciliation=${id}` : '',
    filterValueResults?.resolved !== undefined &&
    filterValueResults?.resolved !== null
      ? `resolved=${filterValueResults.resolved}`
      : '',
    filterValueResults?.startDate
      ? `startDate=${filterValueResults.startDate}`
      : '',
    filterValueResults?.endDate ? `endDate=${filterValueResults.endDate}` : '',
    bankParams,
    merchantParams,
    statusParams,
    typesParams
  ]
    .filter(Boolean)
    .join('&');
  const response = await axios.get(`${baseUrl}?${params}`);
  return response.data;
};

export const getResults2 = async (page, count, filterValueResults) => {
  const baseUrl = `${app.api}/reconciliation`;

  const bankParams = filterValueResults?.bankId?.length
    ? filterValueResults.bankId.map((bank) => `banks[]=${bank}`).join('&')
    : '';
  const merchantParams = filterValueResults?.merchants?.length
    ? filterValueResults.merchants
        .map((merchant) => `merchants[]=${merchant}`)
        .join('&')
    : '';
  const statusParams = filterValueResults?.statuses?.length
    ? filterValueResults.statuses
        .map((status) => `statuses[]=${status}`)
        .join('&')
    : '';
  const typesParams = filterValueResults?.jobs?.length
    ? filterValueResults.jobs.map((job) => `jobs[]=${job}`).join('&')
    : '';
  const params = [
    `page=${page}`,
    `count=${count}`,
    filterValueResults?.resolved !== undefined &&
    filterValueResults?.resolved !== null
      ? `resolved=${filterValueResults.resolved}`
      : '',
    filterValueResults?.startDate
      ? `startDate=${filterValueResults.startDate}`
      : '',
    filterValueResults?.endDate ? `endDate=${filterValueResults.endDate}` : '',
    bankParams,
    merchantParams,
    statusParams,
    typesParams
  ]
    .filter(Boolean)
    .join('&');

  const response = await axios.get(`${baseUrl}?${params}`);
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
  const response = await axios.get(`${app.api}/reconciliation/statuses`);
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
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return response.data;
};
