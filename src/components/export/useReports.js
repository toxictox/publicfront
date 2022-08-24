import { useEffect, useState } from 'react';
import axios from '@lib/axios';
import { app } from '@root/config';

export const useReports = () => {
  const [availableReports, setAvailableReports] = useState([]);

  useEffect(() => {
    const getReportData = async () => {
      await axios.get(`${app.api}/report/processors/get`).then((res) => {
        const { data } = res;
        if (data) {
          setAvailableReports(data);
        }
      });
    };
    getReportData();
  }, []);

  return { availableReports };
};
