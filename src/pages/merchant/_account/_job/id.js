import { useCallback, useEffect, useState } from "react";
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
import AccountCronJobHistory from "@comp/merchant/account/job/AccountCronJobHistory";
import toast from 'react-hot-toast';

const AccountJobId = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { merchantId, jobId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, getAccess } = useAuth();
  const [ job, setJob ] = useState({
  });
  const dispatch = useDispatch();

  const getItem = useCallback(async () => {
    const response = await axios
    .get(`${app.api}/merchant/${merchantId}/account_job/${jobId}`)
    .then((response) => setJob(response.data))
    .catch((err) => {
        if (err.response.status === 404) {
            navigate("*");
        }
    });
  }, [mounted, merchantId, jobId]);

  useEffect(() => {
    getItem();
  }, [getItem]);


  const execute = async () => {
    await axios
      .post(`${app.api}/merchant/${merchantId}/account_job/${jobId}/execute`)
      .then((response) => {
        toast.success(t('Success update'));
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <>
      <Helmet>
        <title>{t("Merchant Cron Job")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <BackButton action={() => navigate(`/merchants/${merchantId}/account_job/`)} />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Merchant Cron Job")}
                action={
                  <GroupTable
                    actionCustom={[
                      {
                        title: "Run",
                        callback: execute
                      }
                    ]
                    }
                  />
                }
              />
              <Divider />
              <TableStatic>
                <TableRow>
                    <TableCell>{t("Id")}</TableCell>
                    <TableCell>{job.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("Name")}</TableCell>
                  <TableCell>{job.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("Description")}</TableCell>
                  <TableCell>{job.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("Source Account")}</TableCell>
                  <TableCell>{job.sourceName + ": " + job.source}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("Target Account")}</TableCell>
                  <TableCell>{job.targetName + ": " + job.target}</TableCell>
                </TableRow>
              </TableStatic>
            </Card>
          </Box>
        </Container>
        <AccountCronJobHistory
            job={jobId}
            merchant={merchantId}
        />
      </Box>
    </>
  );
};

export default AccountJobId;
