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
  TableCell,
} from "@material-ui/core";
import useSettings from "@hooks/useSettings";
import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import { BackButton, GroupTable } from "@comp/core/buttons";
import { TableStatic } from "@comp/core/tables";
import { toLocaleDateTime } from "@lib/date";
import useAuth from "@hooks/useAuth";
import AccountCronJobModalForm from "@comp/merchant/account/job/AccountCronJobModalForm";

const AccountJobIndex = () => {
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

  const getOperations = useCallback(async () => {
    axios.get(`${app.api}/merchant/${id}/account_job`, {
      params: {
        page: page + 1,
        count: count
      }
    }).then((response) => {
      setDataList(response.data);
    });
  }, [id, page, count]);

  const handlePageChange = async (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = async (e, newValue) => {
    setCount(newValue.props.value);
  };

  useEffect(() => {
    getOperations();
  }, [getOperations]);

  return (
    <>
      <Helmet>
        <title>{t("Merchant Account Cron Jobs")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <BackButton action={() => navigate(`/merchants/${id}/account/`)} />

          <AccountCronJobModalForm
            merchant={id}
            open={isModalFormOpen}
            onClose={closeForm}
            entity={editableItem}
            onUpdate={getOperations}
          />

          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Merchant Account Cron Jobs")}
                action={
                  <GroupTable
                    actionCreate={{
                      access: getAccess("merchants", "update"),
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
                  "name",
                  "accounts",
                  "fee",
                  "enabled",
                  "cronExpression",
                  ""
                ]}
              >
                {dataList.items.map(function (item) {
                  return (
                    <>
                      <TableRow hover key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.sourceName + "->" + item.targetName}</TableCell>
                        <TableCell>{item.fee + "%"}</TableCell>
                        <TableCell>{item.enabled ? "Enabled" : "Disabled"}</TableCell>
                        <TableCell>{item.cronExpression}</TableCell>
                        <TableCell
                              align="right"
                              className="static-table__table-cell"
                        >
                          <GroupTable
                            actionView={() => {
                                navigate(`/merchants/${id}/account_job/${item.id}`);
                            }}
                            actionUpdate={() => {
                              openForm(item);
                            }}
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

export default AccountJobIndex;
