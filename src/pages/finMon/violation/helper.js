import axios from '@lib/axios';
import { app } from '@root/config';

export const fetchTranTypes = async () => {
  const response = await axios.get(`${app.api}/filter/tran_types`);
  return response.data;
};

export const fetchRespCodes = async () => {
  const response = await axios.get(`${app.api}/filter/codes`);
  return response.data.data;
};

export const fetchViolations = async (page, count, filters = {}) => {
  const filteredParams = {
    page: page + 1,
    count,
    ...Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) =>
          value !== '' &&
          value !== null &&
          value !== undefined &&
          (!Array.isArray(value) || value.length > 0)
      )
    )
  };

  const response = await axios.get(`${app.api}/finMon/violation`, {
    params: filteredParams,
    paramsSerializer: (params) => {
      let queryString = '';
      for (const key in params) {
        if (Array.isArray(params[key])) {
          // eslint-disable-next-line no-loop-func
          params[key].forEach((value) => {
            queryString += `${key}[]=${value}&`;
          });
        } else {
          queryString += `${key}=${params[key]}&`;
        }
      }
      return queryString.slice(0, -1);
    }
  });

  return response.data;
};

export const fetchTransaction = async (transactionRef) => {
  const response = await axios.get(`${app.api}/transaction/${transactionRef}`);
  return response.data;
};

export const fetchTransactionCounts = async (params) => {
  const response = await axios.get(`${app.api}/transactions`, { params });
  return response.data.count;
};
