import { useState, useEffect } from 'react';
import axios from '@lib/axios';
import { app } from '@root/config';

export const UseMerchantFormData = () => {
  const [timezoneData, setTimezoneData] = useState([]);
  const [cityTerminal, setCityTerminal] = useState([]);
  const [cityMerchant, setCityMerchant] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [designId, setDesignId] = useState([]);
  const types = ['a2c', 'c2a', 'p2p'];
  const notificationChannels = ['email'];

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

      await axios.get(`${app.api}/company`).then((res) => {
        setCompanies(res.data);
      });
    };
    getData();
  }, []);

  return {
    timezoneData,
    cityTerminal,
    cityMerchant,
    designId,
    companies,
    types,
    notificationChannels
  };
};
