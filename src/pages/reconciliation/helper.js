import { app } from '@root/config';
import axios from 'axios';

export const getResults = async (page, count) => {
  const response = await axios.get(
    `${app.api}/reconciliation/results?page=${page}&count=5`
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
  const response = await axios.get(`${app.api}/reconciliation/results/statuses`);
  return response.data;
};

export const resolved = async (id) => {
  const response = await axios.post(
    `${app.api}/reconciliation/results/${id}/resolve`
  );
  return response.data;
};
