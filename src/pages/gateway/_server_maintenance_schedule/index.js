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
import ServerMaintenanceScheduleModalForm
  from '@comp/gateway/server-maintenance-schedule/ServerMaintenanceScheduleModalForm';

const ServerMaintenanceScheduleIndex = () => {
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

  const getSchedule = useCallback(async () => {
    axios.get(`${app.api}/gateways/${id}/server_maintenance_schedule`, {
      params: {
        page: page + 1,
        count: count
      }
    }).then((response) => {
      setDataList(response.data);
    });
  }, [id, page, count]);

  const handleDelete = async (gatewayId, scheduleId) => {
    await axios
      .delete(`${app.api}/gateways/${gatewayId}/server_maintenance_schedule/${scheduleId}`)
      .then((response) => {
        toast.success(t("Success deleted"));
        getSchedule();
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
    getSchedule();
  }, [getSchedule]);

  return (
    <>
      <Helmet>
        <title>{t("Server maintenance schedule")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <BackButton action={() => navigate(`/gateways/id/${id}/`)} />

          <ServerMaintenanceScheduleModalForm
            gatewayId={id}
            open={isModalFormOpen}
            onClose={closeForm}
            entity={editableItem}
            onUpdate={getSchedule}
          />

          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Server maintenance schedule")}
                action={
                  <GroupTable
                    actionCreate={{
                      access: getAccess("gateways", "update"),
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
                  "frequency",
                  "status",
                  "startedAt",
                  "finishedAt",
                  "createOn",
                  "editOn",
                  ''
                ]}
              >
                {dataList.items.map(function (item) {
                  return (
                    <>
                      <TableRow hover key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.frequency}</TableCell>
                        <TableCell>{item.status}</TableCell>
                        <TableCell>{toLocaleDateTime(item.startedAt)}</TableCell>
                        <TableCell>{toLocaleDateTime(item.finishedAt)}</TableCell>
                        <TableCell>{toLocaleDateTime(item.createOn)}</TableCell>
                        <TableCell>{toLocaleDateTime(item.editOn)}</TableCell>
                        <TableCell
                              align="right"
                              className="static-table__table-cell"
                        >
                          <GroupTable
                            actionView={() => {
                                navigate(`/gateways/id/${id}/server_maintenance_schedule/${item.id}/`);
                            }}
                            actionUpdate={() => {
                              openForm(item);
                            }}
                            actionDelete={{
                              access: getAccess("gateways", "update"),
                              callback: () => {
                                dispatch(
                                  showConfirm({
                                    title: t("Do you want to remove"),
                                    isOpen: true,
                                    okCallback: () => handleDelete(id, item.id),
                                  })
                                );
                              }}
                            }
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

export default ServerMaintenanceScheduleIndex;
