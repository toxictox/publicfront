import { app } from '@root/config';
import axios from 'axios';

const baseURL = `${app.api}`;

export const auth = async (data) => {
  const response = await axios.post(`${app.api}/api/auth`, data);
  return response.data;
};

// 1. Получение списка всех компаний
export const getAllCompanies = async (page, count) => {
  const response = await axios.get(`${baseURL}/company?page=${page}&count=${count}`);
  return response.data;
};

// 2. Создание новой компании
export const createCompany = async (data) => {
  const response = await axios.post(`${baseURL}/company`, data);
  return response.data;
};

// 3. Получение инфы об определенной компании
export const getCompanyId = async (companyId) => {
  const response = await axios.get(`${baseURL}/company/${companyId}`);
  return response.data;
};

// 4. Изменение информации об определенной компании
export const updateCompany = async (companyId, data) => {
  const response = await axios.put(`${baseURL}/company/${companyId}`, data);
  return response.data;
};

// 5. Удаление выбранной компании
export const deleteCompany = async (companyId) => {
  const response = await axios.delete(`${baseURL}/company/${companyId}`);
  return response.data;
};

// 6. Получение всех транзитных счетов
export const getAllAccounts = async () => {
  const response = await axios.get(`${baseURL}/account`);
  return response.data;
};

// 7. Получение списка всех транзакций
export const getAllTransactions = async () => {
  const response = await axios.get(`${baseURL}/transaction`);
  return response.data;
};

// 8. Создание транзакции
export const createTransaction = async (data) => {
  const response = await axios.post(`${baseURL}/transaction`, data);
  return response.data;
};

// 9. Отправка верифицированной с нашей стороны транзакции в банк
export const acceptTransaction = async (transactionId) => {
  const response = await axios.post(
    `${baseURL}/transaction/${transactionId}/accept`
  );
  return response.data;
};

// 10. Обновление статуса транзакции со стороны банка
export const getTransactionStatus = async (transactionId) => {
  const response = await axios.get(
    `${baseURL}/transaction/${transactionId}/status`
  );
  return response.data;
};
