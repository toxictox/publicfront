import { app } from '@root/config';
import { getCsvFileHelper2 } from '@utils/getCsvFileHelper';
import axios from 'axios';

export const getStatement = async (page, idMerchant, count, accountId) => {
  const response = await axios.get(
    `${app.api}/merchant/${idMerchant}/account/${accountId}/statement?page=${page}&count=${count}`,
    {}
  );
  return response.data;
};
export const getStatementDownload = async (
  merchantId,
  accountId,
  statementId
) => {
  const response = await axios
    .get(
      `${app.api}/merchant/${merchantId}/account/${accountId}/statement/${statementId}/download`,
      {
        responseType: 'blob'
      }
    )
    .then((res) => {
      const { data, headers } = res;
      getCsvFileHelper2({ data, headers });
    });
  return response.data;
};

export const createStatement = async (merchantId, accountId, data) => {
  const response = await axios.post(
    `${app.api}/merchant/${merchantId}/account/${accountId}/statement`,
    data,
    {}
  );
  return response.data;
};
