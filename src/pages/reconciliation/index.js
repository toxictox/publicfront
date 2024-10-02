import { fetchReconciliationData } from '@comp/reconciliation/helper';
import ReconciliationFilter from '@comp/reconciliation/ReconciliationFilter';
import useAuth from '@hooks/useAuth';
import useSettings from '@hooks/useSettings';
import axios from '@lib/axios';
import {
  Box,
  Card,
  CardHeader,
  Container,
  Divider,
  TablePagination
} from '@material-ui/core';
import { app } from '@root/config';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './ReconcilationDetail.scss';

const ReconciliationList = () => {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const { getAccess } = useAuth();
  const [dataList, setListData] = useState({ data: [], count: 0 });
  const [page, setPage] = useState(0);
  const [filterList, setFilterList] = useState({});
  const updateData = async (values) => {
    await handlePageChange(null, 0, { bankId: values });
  };

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const data = await fetchReconciliationData();
    //     console.log(data);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };
    // fetchData();
  }, []);

  const handlePageChange = async (e, newPage, values) => {
    setPage(newPage);
    const params = values !== undefined ? values : filterList;
    await axios
      .get(`${app.api}/reconciliation/files/bank/${params.bankId}`, {
        params: {
          page: newPage,
          count: 25
        }
      })
      .then((response) => {
        setFilterList(params);
        setListData(response.data);
      });
  };

  // const checkStatus = async (id) => {
  //   await axios
  //     .get(`${app.api}/reconciliation/file/${id}`)
  //     .then((response) => {
  //       setListData({
  //         ...dataList,
  //         data: dataList.data.map((item) => {
  //           if (item.id === id) return response.data;
  //           else return item;
  //         })
  //       });
  //       toast.success(t('Success update'));
  //     })
  //     .catch((err) => {
  //       toast.error(err.response.data.message);
  //     });
  // };

  // const startReconciliation = async (id) => {
  //   await axios
  //     .post(`${app.api}/reconciliation/make/${id}`)
  //     .then((response) => {
  //       setListData({
  //         ...dataList,
  //         data: dataList.data.map((item) => {
  //           if (item.id === id) return response.data;
  //           else return item;
  //         })
  //       });
  //       toast.success(t('Success update'));
  //     })
  //     .catch((err) => {
  //       toast.error(err.response.data.message);
  //     });
  // };

  const updateList = async (response) => {
    setListData({
      dataList,
      data: [response, ...dataList.data]
    });
  };

  const getDetailReconcilationLink = ({ reconciliationResult, id, name }) => {
    if (reconciliationResult && Object.keys(reconciliationResult).length > 0) {
      return (
        <Link
          className="reconcilation__link"
          to={`/reconciliation/${id}`}
          state={{ detail: reconciliationResult }}
        >
          {name}
        </Link>
      );
    }
    return name;
  };

  return (
    <>
      <Helmet>
        <title>{t('Reconciliation List')}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 2
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Box sx={{ mt: 1 }}>
            <Card sx={{ mt: 1 }}>
              <CardHeader title={t('Reconciliation List')} />
              <Divider />
              <ReconciliationFilter callback={updateData} update={updateList} />
              <Divider />
              {/* <TableStatic
                header={[
                  'id',
                  'name',
                  'createOn',
                  'editOn',
                  'totalCount',
                  'successCount',
                  'failedCount',
                  'status',
                  ''
                ]}
              >
                {dataList.data.map(function (item) {
                  return (
                    <TableRow hover key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>
                        {getDetailReconcilationLink({
                          reconciliationResult: item.reconciliationResult,
                          id: item.id,
                          name: item.name
                        })}
                      </TableCell>
                      <TableCell>{toLocaleDateTime(item.createOn)}</TableCell>
                      <TableCell>{toLocaleDateTime(item.editOn)}</TableCell>
                      <TableCell>{item.totalCount}</TableCell>
                      <TableCell>{item.successCount}</TableCell>
                      <TableCell>{item.failedCount}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>
                        {item.status === 'loaded' ? (
                          <GroupTable
                            actionCustomIcon={[
                              {
                                access: getAccess(
                                  'reconciliation',
                                  'makeReconciliation'
                                ),
                                icon: <Send />,
                                title: item.id,
                                callback: () => startReconciliation(item.id)
                              }
                            ]}
                          />
                        ) : item.status === 'pending' ? (
                          <GroupTable
                            actionCustomIcon={[
                              {
                                icon: <Cached />,
                                title: item.id,
                                callback: () => checkStatus(item.id)
                              }
                            ]}
                          />
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableStatic> */}
            </Card>
            {dataList.count ? (
              <TablePagination
                component="div"
                count={dataList.count}
                onPageChange={handlePageChange}
                page={page}
                rowsPerPage={25}
                rowsPerPageOptions={[25]}
              />
            ) : null}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ReconciliationList;
