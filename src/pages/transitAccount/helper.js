import axios from 'axios';

const baseURL = `https://bcc3.paytech.agis.work/api`;

let token = ''; // Здесь будем хранить токен после авторизации

// 1. Авторизация и получение токена
export const auth = async (data) => {
  const response = await axios.post(`${baseURL}/auth`, data, {
    headers: {
      // Убираем токен
      Authorization: ''
    }
  });
  token = response.data.token; // Сохраняем токен
  return response.data;
};

// Функция для добавления Authorization в заголовки всех запросов
const getAuthHeaders = () => {
  return {
    Authorization: `Bearer ${token}`
  };
};

// 2. Получение списка всех компаний
export const getAllCompanies = async (page, count) => {
  const response = await axios.get(
    `${baseURL}/company?page=${page}&count=${count}`,
    {
      headers: getAuthHeaders() // Используем токен в заголовках
    }
  );
  return response.data;
};
export const getAllCompaniesTransactions = async () => {
  const response = await axios.get(`${baseURL}/company`, {
    headers: getAuthHeaders() // Используем токен в заголовках
  });
  return response.data;
};

// 3. Создание новой компании
export const createCompany = async (data) => {
  const response = await axios.post(`${baseURL}/company`, data, {
    headers: getAuthHeaders() // Используем токен в заголовках
  });
  return response.data;
};

// 4. Получение инфы об определенной компании
export const getCompanyId = async (companyId) => {
  const response = await axios.get(`${baseURL}/company/${companyId}`, {
    headers: getAuthHeaders() // Используем токен в заголовках
  });
  return response.data;
};

// 5. Изменение информации об определенной компании
export const updateCompany = async (companyId, data) => {
  const response = await axios.put(`${baseURL}/company/${companyId}`, data, {
    headers: getAuthHeaders() // Используем токен в заголовках
  });
  return response.data;
};

// 6. Удаление выбранной компании
export const deleteCompany = async (companyId) => {
  const response = await axios.delete(`${baseURL}/company/${companyId}`, {
    headers: getAuthHeaders() // Используем токен в заголовках
  });
  return response.data;
};

// 7. Получение всех транзитных счетов
export const getAllAccounts = async () => {
  const response = await axios.get(`${baseURL}/account`, {
    headers: getAuthHeaders() // Используем токен в заголовках
  });
  return response.data;
};

// 8. Получение списка всех транзакций
export const getAllTransactions = async (page, count) => {
  const response = await axios.get(
    `${baseURL}/transaction?page=${page}&count=${count}`,
    {
      headers: getAuthHeaders() // Используем токен в заголовках
    }
  );
  return response.data;
};

// 9. Создание транзакции
export const createTransaction = async (data) => {
  const response = await axios.post(`${baseURL}/transaction`, data, {
    headers: getAuthHeaders() // Используем токен в заголовках
  });
  return response.data;
};

// 10. Отправка верифицированной с нашей стороны транзакции в банк
export const acceptTransaction = async (transactionId) => {
  const response = await axios.post(
    `${baseURL}/transaction/${transactionId}/accept`,
    {},
    {
      headers: getAuthHeaders() // Используем токен в заголовках
    }
  );
  return response.data;
};

// 11. Обновление статуса транзакции со стороны банка
export const getTransactionStatus = async (transactionId) => {
  const response = await axios.get(
    `${baseURL}/transaction/${transactionId}/status`,
    {
      headers: getAuthHeaders() // Используем токен в заголовках
    }
  );
  return response.data;
};
