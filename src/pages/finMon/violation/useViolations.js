import { useCallback, useEffect, useState } from 'react';
import { fetchRespCodes, fetchTranTypes, fetchViolations } from './helper';

export const useViolations = () => {
  const [dataList, setListData] = useState({ items: [], count: 0 });
  const [a2cTranType, seta2cTranType] = useState(0);
  const [respCodeId, setRespCodeId] = useState(0);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(50);
  const [filters, setFilters] = useState({}); 

  const fetchData = useCallback(async () => {
    const [tranTypes, respCodes] = await Promise.all([
      fetchTranTypes(),
      fetchRespCodes()
    ]);

    const a2cTran = tranTypes.find((item) => item.name === 'a2c');
    const respCode = respCodes.find((item) => item.internal === '1000');

    if (a2cTran) seta2cTranType(a2cTran.id);
    if (respCode) setRespCodeId(respCode.id);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const loadViolations = useCallback(async () => {
    if (a2cTranType && respCodeId) {
      const data = await fetchViolations(page, count, filters);
      setListData(data);
    }
  }, [a2cTranType, respCodeId, page, count, filters]);

  useEffect(() => {
    loadViolations();
  }, [loadViolations]);

  return { dataList, page, count, setPage, setCount , setFilters};
};
