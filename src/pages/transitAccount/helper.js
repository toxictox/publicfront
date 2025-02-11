import { app } from '@root/config';
import { getCsvFileHelper2 } from '@utils/getCsvFileHelper';
import axios from 'axios';

const baseURL = `${app.apiNewService}`;
// const baseURL = `https://bcc3.paytech.agis.work/api`;

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
export const getStatement = async (page, id, count) => {
  const response = await axios.get(
    `${baseURL}/account/${id}/statement?page=${page}&count=${count}`,
    {
      headers: getAuthHeaders()
    }
  );
  return response.data;
};
export const getStatementDownload = async (accountId, idStatement) => {
  const response = await axios
    .get(`${baseURL}/account/${accountId}/statement/${idStatement}/download`, {
      responseType: 'blob',
      headers: getAuthHeaders()
    })
    .then((res) => {
      const { data, headers } = res;
      getCsvFileHelper2({ data, headers });
    });
  return response.data;
};
export const createStatement = async (id, data) => {
  const response = await axios.post(
    `${baseURL}/account/${id}/statement`,
    data,
    {
      headers: getAuthHeaders()
    }
  );
  return response.data;
};
