import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Card,
  TableRow,
  TableCell,
  CardHeader,
  Divider,
} from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";
import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import { TableStatic } from "@comp/core/tables/index";
import { GroupTable, BackButton } from "@comp/core/buttons";
import { useDispatch } from "react-redux";
import useAuth from "@hooks/useAuth";
import { toLocaleDateTime } from "@lib/date";
import ServerMaintenanceScheduleModalForm
  from '@comp/gateway/server-maintenance-schedule/ServerMaintenanceScheduleModalForm';

const ServerMaintenanceScheduleId = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { id, scheduleId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, getAccess } = useAuth();
  const [ schedule, setSchedule ] = useState({
  });
  const [dataList, setListData] = useState({
    data: [],
  });
  const dispatch = useDispatch();

  const [isModalFormOpen, setModalFormOpen] = useState(false);
  const [editableItem, setEditableItem] = useState(null);

  const getItem = useCallback(async () => {
    const response = await axios
    .get(`${app.api}/gateways/${id}/server_maintenance_schedule/${scheduleId}`)
    .then((response) => setSchedule(response.data))
    .catch((err) => {
        if (err.response.status === 404) {
            navigate("*");
        }
    });
  }, [mounted, id, scheduleId]);

  useEffect(() => {
    getItem();
  }, [getItem]);

  const openForm = (item) => {
    setModalFormOpen(true);
    setEditableItem(item);
  };

  const closeForm = () => {
    setModalFormOpen(false);
    setEditableItem(null);
  };

  return (
    <>
      <Helmet>
        <title>{t("Server maintenance Item")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <BackButton action={() => navigate(`/gateways/id/${id}/server_maintenance_schedule/`)} />

          <ServerMaintenanceScheduleModalForm
            gatewayId={id}
            open={isModalFormOpen}
            onClose={closeForm}
            entity={editableItem}
            onUpdate={getItem}
          />

          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Server maintenance Item")}
                action={
                  <GroupTable
                    actionUpdate={() => {
                      openForm(schedule);
                    }}
                  />
                }
              />
              <Divider />
              <TableStatic>
                <TableRow>
                    <TableCell>{t("Id")}</TableCell>
                    <TableCell>{schedule.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("Frequency")}</TableCell>
                  <TableCell>{schedule.frequency}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("Status")}</TableCell>
                  <TableCell>{schedule.status}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("Started At")}</TableCell>
                  <TableCell>{toLocaleDateTime(schedule.startedAt)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("Finished At")}</TableCell>
                  <TableCell>{toLocaleDateTime(schedule.finishedAt)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("createOn")}</TableCell>
                  <TableCell>{toLocaleDateTime(schedule.createOn)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("editOn")}</TableCell>
                  <TableCell>{toLocaleDateTime(schedule.editOn)}</TableCell>
                </TableRow>
              </TableStatic>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ServerMaintenanceScheduleId;
