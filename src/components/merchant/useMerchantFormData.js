import { useState, useEffect } from 'react';
import axios from '@lib/axios';
import { app } from '@root/config';

export const UseMerchantFormData = () => {
  const [timezoneData, setTimezoneData] = useState([]);
  const [cityTerminal, setCityTerminal] = useState([]);
  const [cityMerchant, setCityMerchant] = useState([]);
  const [designId, setDesignId] = useState([]);

  useEffect(() => {
    const getData = async () => {
      await axios.get(`${app.api}/timezone`).then((response) => {
        setTimezoneData(response.data.data);
      });

      await axios.get(`${app.api}/filter/city/terminals`).then((response) => {
        setCityTerminal(response.data.data);
      });

      await axios.get(`${app.api}/filter/city/merchants`).then((response) => {
        setCityMerchant(response.data.data);
      });

      await axios.get(`${app.api}/filter/designs`).then((res) => {
        setDesignId(res.data.data);
      });
    };
    getData();
  }, []);

  return { timezoneData, cityTerminal, cityMerchant, designId };
};
