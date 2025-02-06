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
import ReconciliationSettingsModalForm from '@comp/reconciliation/settings/ReconciliationSettingsModalForm';

const ReconciliationSettingsId = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, getAccess } = useAuth();
  const [ reconciliationJob, setReconciliationJob ] = useState({
  });
  const [dataList, setListData] = useState({
    data: [],
  });
  const dispatch = useDispatch();

  const [isModalFormOpen, setModalFormOpen] = useState(false);
  const [editableItem, setEditableItem] = useState(null);

  const [banks, setBanks] = useState([]);
  const [merchants, setMerchants] = useState([]);

  const getItem = useCallback(async () => {
    const response = await axios
    .get(`${app.api}/reconciliation/job/${id}`)
    .then((response) => setReconciliationJob(response.data))
    .catch((err) => {
        if (err.response.status === 404) {
            navigate("*");
        }
    });
  }, [mounted, id]);

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
        <title>{t("Reconciliation settings Item")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <BackButton action={() => navigate(`/reconciliation/settings/`)} />

          <ReconciliationSettingsModalForm
            open={isModalFormOpen}
            onClose={closeForm}
            merchants={merchants}
            banks={banks}
            entity={editableItem}
            onUpdate={getItem}
          />

          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Reconciliation settings Item")}
                action={
                  <GroupTable
                    actionUpdate={() => {
                      openForm(reconciliationJob);
                    }}
                  />
                }
              />
              <Divider />
              <TableStatic>
                <TableRow>
                  <TableCell colSpan={2}>
                    <p><b>{t('Main settings')}</b></p>
                  </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>{t("id")}</TableCell>
                    <TableCell>{reconciliationJob.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("uid")}</TableCell>
                  <TableCell>{reconciliationJob.uid}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("reconciliationName")}</TableCell>
                  <TableCell>{reconciliationJob.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("field")}</TableCell>
                  <TableCell>{reconciliationJob.field}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("strategyName")}</TableCell>
                  <TableCell>{reconciliationJob.strategy}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("bank")}</TableCell>
                  <TableCell>{banks ? banks.find(bank => bank.id === reconciliationJob.bankId)?.name  : ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("merchant")}</TableCell>
                  <TableCell>{merchants ? merchants.find(merchant => merchant.id === reconciliationJob.merchantId)?.name  : ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("tranTypes")}</TableCell>
                  <TableCell>{reconciliationJob?.tranTypes?.join(', ')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("timezone")}</TableCell>
                  <TableCell>{reconciliationJob.timezone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("transactionPrefix")}</TableCell>
                  <TableCell>{reconciliationJob.transactionPrefix}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("transactionPostfix")}</TableCell>
                  <TableCell>{reconciliationJob.transactionPostfix}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("transactionRegEx")}</TableCell>
                  <TableCell>{reconciliationJob.transactionRegEx}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("usingReportInterval")}</TableCell>
                  <TableCell>{reconciliationJob.usingReportInterval ? t('true') : t('false')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("minDateInterval")}</TableCell>
                  <TableCell>{reconciliationJob.minDateInterval}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("maxDateInterval")}</TableCell>
                  <TableCell>{reconciliationJob.maxDateInterval}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>
                    <p><b>{t('Parsing settings')}</b></p>
                  </TableCell>
                </TableRow>
                {reconciliationJob?.settings ? Object.keys(reconciliationJob?.settings).map((item) =>
                  <TableRow>
                    <TableCell>{t(item)}</TableCell>
                    {typeof reconciliationJob?.settings[item] === 'boolean'
                      ? <TableCell>{reconciliationJob?.settings[item] ? t('true') : t('false')}</TableCell>
                      : <TableCell>{reconciliationJob?.settings[item]}</TableCell>
                    }
                  </TableRow>
                ) : ''}
              </TableStatic>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ReconciliationSettingsId;
