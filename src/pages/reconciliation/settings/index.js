import { useCallback, useEffect, useState } from "react";
import React from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Card,
  CardHeader,
  Divider,
  TableRow,
  TablePagination,
  Link,
  TableCell,
  Button,
} from "@material-ui/core";
import useSettings from "@hooks/useSettings";
import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import { BackButton, GroupTable } from "@comp/core/buttons";
import { TableStatic } from "@comp/core/tables";
import { toLocaleDateTime } from "@lib/date";
import useAuth from "@hooks/useAuth";
import { showConfirm } from '@slices/dialog';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import ReconciliationSettingsModalForm from '@comp/reconciliation/settings/ReconciliationSettingsModalForm';

const ReconciliationSettingsIndex = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { settings } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dataList, setDataList] = useState({
    items: [],
    count: 0,
  });
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(50);
  const { getAccess } = useAuth();

  const [isModalFormOpen, setModalFormOpen] = useState(false);
  const [editableItem, setEditableItem] = useState(null);

  const [banks, setBanks] = useState([]);
  const [merchants, setMerchants] = useState([]);

  const formatAmount = (number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT' }).format(number);
  };

  const openForm = (item) => {
    setModalFormOpen(true);
    setEditableItem(item);
  };

  const closeForm = () => {
    setModalFormOpen(false);
    setEditableItem(null);
  };

  const getReconciliationJobs = useCallback(async () => {
    axios.get(`${app.api}/reconciliation/job/`, {
      params: {
        page: page + 1,
        count: count
      }
    }).then((response) => {
      setDataList(response.data);
    });
  }, [id, page, count]);

  const handleDelete = async (reconciliationId) => {
    await axios
      .delete(`${app.api}/reconciliation/job/${reconciliationId}`)
      .then((response) => {
        toast.success(t("Success deleted"));
        getReconciliationJobs();
      })
      .catch((e) => toast.error(e));
  };

  const handlePageChange = async (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = async (e, newValue) => {
    setCount(newValue.props.value);
  };

  useEffect(() => {
    const getData = async () => {
      await axios.get(`${app.api}/filter/banks`).then((response) => {
        setBanks(response.data.data);
      })

      await axios.get(`${app.api}/filter/merchants`).then((response) => {
        setMerchants(response.data.data);
      });
    }
    getData();
    getReconciliationJobs();
  }, [getReconciliationJobs]);

  return (
    <>
      <Helmet>
        <title>{t("Reconciliation settings")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <ReconciliationSettingsModalForm
            open={isModalFormOpen}
            onClose={closeForm}
            entity={editableItem}
            onUpdate={getReconciliationJobs}
            merchants={merchants}
            banks={banks}
          />

          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Reconciliation settings")}
                action={
                  <GroupTable
                    actionCreate={{
                      access: getAccess("reconciliation", "read"),
                      callback: () => {
                        openForm(null);
                      },
                    }}
                  />
                }
              />
              <Divider />
              <TableStatic
                header={[
                  "id",
                  "reconciliationName",
                  "field",
                  "strategyName",
                  "bank",
                  "merchant",
                  "tranTypes",
                  '',
                ]}
              >
                {dataList.items.map((item) => {
                  return (
                    <>
                      <TableRow hover key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.field}</TableCell>
                        <TableCell>{item.strategy}</TableCell>
                        <TableCell>{banks ? banks.find(bank => bank.id === item.bankId)?.name  : ''}</TableCell>
                        <TableCell>{merchants ? merchants.find(merchant => merchant.id === item.merchantId)?.name  : ''}</TableCell>
                        <TableCell>{item?.tranTypes?.join(', ')}</TableCell>
                        <TableCell
                          align='right'
                          className='static-table__table-cell'
                        >
                          <GroupTable
                            actionView={() => {
                              navigate(`/reconciliation/settings/${item.id}`);
                            }}
                            actionUpdate={() => {
                              openForm(item);
                            }}
                            // actionDelete={{
                            //   access: getAccess("reconciliation", "read"),
                            //   callback: () => {
                            //     dispatch(
                            //       showConfirm({
                            //         title: t("Do you want to remove"),
                            //         isOpen: true,
                            //         okCallback: () => handleDelete(item.id),
                            //       })
                            //     );
                            //   }}
                            // }
                          />
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
              </TableStatic>

              <TablePagination
                count={dataList.count}
                onPageChange={handlePageChange}
                page={page}
                rowsPerPage={count}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
              />
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ReconciliationSettingsIndex;
