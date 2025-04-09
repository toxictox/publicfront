import { app } from '@root/config';
import axios from 'axios';
import { formatISO } from 'date-fns';

export const getMaintenance = async (page, count) => {
  const response = await axios.get(
    `${app.api}/maintenance?page=${page}&count=${count}`,
    {}
  );
  return response.data;
};

export const createMaintenance = async (data) => {
  const response = await axios.post(`${app.api}/maintenance`, data);
  return response.data;
};
export const updateMaintenance = async (data, id) => {
  const response = await axios.put(`${app.api}/maintenance/${id}`, data);
  return response.data;
};

export const deleteMaintenance = async (id) => {
  const response = await axios.delete(`${app.api}/maintenance/${id}`);
  return response.data;
};

export const formatDate = (date) =>
  date
    ? formatISO(new Date(date), { representation: 'complete' }).slice(0, 16)
    : '';
