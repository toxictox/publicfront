import axios from 'axios';

// const baseURL = `${app.apiNewService}`;
const baseURL = `https://bcc3.paytech.agis.work/api`;

let token = '';

export const auth = async (data) => {
  const response = await axios.post(`${baseURL}/auth`, data, {
    headers: {
      Authorization: ''
    }
  });
  token = response.data.token;
  return response.data;
};

const getAuthHeaders = () => {
  return {
    Authorization: `Bearer ${token}`
  };
};

export const getAllCompanies = async (page, count) => {
  const response = await axios.get(
    `${baseURL}/company?page=${page}&count=${count}`,
    {
      headers: getAuthHeaders()
    }
  );
  return response.data;
};
export const getAllCompaniesTransactions = async () => {
  const response = await axios.get(`${baseURL}/company`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const createCompany = async (data) => {
  const response = await axios.post(`${baseURL}/company`, data, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const getCompanyId = async (companyId) => {
  const response = await axios.get(`${baseURL}/company/${companyId}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateCompany = async (companyId, data) => {
  const response = await axios.put(`${baseURL}/company/${companyId}`, data, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const deleteCompany = async (companyId) => {
  const response = await axios.delete(`${baseURL}/company/${companyId}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const getAllAccounts = async () => {
  const response = await axios.get(`${baseURL}/account`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const getAllTransactions = async (page, count) => {
  const response = await axios.get(
    `${baseURL}/transaction?page=${page}&count=${count}`,
    {
      headers: getAuthHeaders()
    }
  );
  return response.data;
};

export const createTransaction = async (data) => {
  const response = await axios.post(`${baseURL}/transaction`, data, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const acceptTransaction = async (transactionId) => {
  const response = await axios.post(
    `${baseURL}/transaction/${transactionId}/accept`,
    {},
    {
      headers: getAuthHeaders()
    }
  );
  return response.data;
};

export const getTransactionStatus = async (transactionId) => {
  const response = await axios.get(
    `${baseURL}/transaction/${transactionId}/status`,
    {
      headers: getAuthHeaders()
    }
  );
  return response.data;
};
