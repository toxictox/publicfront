import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, TablePagination } from '@material-ui/core';

import useMounted from '@hooks/useMounted';
import useSettings from '@hooks/useSettings';

import gtm from '@lib/gtm';
import { GetFilterDataFromStore, GetFilterPageFromStore } from '@lib/filter';
import { TransactionListTable } from '@comp/transaction';
import useAuth from '@hooks/useAuth';

import axios from '@lib/axios';
import { app } from '@root/config';
import { useDispatch } from '@store';
import { setFilterParams, setFilterPage } from '@slices/filter';

const TransactionsList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { user } = useAuth();
  const [dataList, setListData] = useState({
    data: [],
    count: 0,
  });
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [ loading, setLoading ] = useState(false);

  const [merchId, setMerchId] = useState(
    localStorage.getItem('merchId') !== null
      ? localStorage.getItem('merchId')
      : user.merchantId
  );

  const filterList = GetFilterDataFromStore('transactions');

  const [page, setPage] = useState(GetFilterPageFromStore('transactions'));
  const dispatch = useDispatch();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios
        .get(`${app.api}/transactions`,
        {
          params: {
            page: page + 1,
            count: rowsPerPage,
            merchant: merchId,
            ...filterList
          }
        }
        )
        .then((response) => response.data)
        .finally(() => [setLoading(false)]);

      if (mounted.current) {
        setListData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted, rowsPerPage]);

  const filter = (values) => {
    handlePageChange(null, 0, values);
  };

  const handleRowsPerPageChange = async (e, newValue) => {
    setRowsPerPage(newValue.props.value);
  };

  const handlePageChange = async (e, newPage, values) => {
    setPage(newPage);
    dispatch(setFilterPage({ path: 'transactions', page: newPage }));

    setLoading(true);
    await axios
      .get(
        `${app.api}/transactions`,
        {
          params: {
            page: page + 1,
            count: rowsPerPage,
            merchant: merchId,
            ...values !== undefined ? values : filterList
          }
        }
      )
      .then(async (response) => {
        if (values !== undefined) {
          dispatch(
            setFilterParams({ path: 'transactions', params: { ...values } })
          );
        }
        setListData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return (
    <>
      <Helmet>
        <title>Transactions List</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Box sx={{ mt: 1 }}>
            <TransactionListTable
              data={dataList.data}
              callback={filter}
              loading={loading}
            />
            <TablePagination
              component="div"
              count={dataList.count == rowsPerPage ? rowsPerPage * (page + 2) : rowsPerPage * page + dataList.count }
              onPageChange={handlePageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[25, 50, 100]}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TransactionsList;
