import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactPDF, { PDFDownloadLink } from "@react-pdf/renderer";
import {
  Box,
  Container,
  Card,
  TableRow,
  TableCell,
  CardHeader,
  Divider,
  Alert,
} from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";
import { Info, PictureAsPdf } from "@material-ui/icons";

import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import { TableStatic } from "@comp/core/tables/index";
import { BackButton, GroupTable } from "@comp/core/buttons";
import { toLocaleDateTime } from "@lib/date";
import { TransactionPdf } from "./includes";
import toast from "react-hot-toast";
import useAuth from "@hooks/useAuth";

const TransactionsList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getAccess } = useAuth();
  const [dataList, setListData] = useState({
    data: [],
  });
  const [status, setStatus] = useState(undefined);

  const getItem = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/transaction/${id}`)
        .then((response) => response.data);
      if (mounted.current) {
        setListData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted, id]);

  const sendCallback = async () => {
    await axios
      .post(`${app.api}/transactions/callback/${id}`)
      .then((response) => {
        toast.success(t("Success update"));
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const sendStatus = async () => {
    await axios
      .post(`${app.api}/transactions/status/${id}`)
      .then((response) => {
        toast.success(t("Success update"));
        setStatus(() => response.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  useEffect(() => {
    getItem();
  }, [getItem]);

  return (
    <>
      <Helmet>
        <title>Transactions List</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <BackButton action={() => navigate("/transactions")} />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              {status ? (
                <Alert color={"success"} sx={{ m: 2 }}>
                  {status.description}
                </Alert>
              ) : null}
              <Divider />
              <CardHeader
                title={t("Transactions Item")}
                action={
                  <GroupTable
                    actionCustomIcon={[
                      {
                        icon: <Info />,
                        access: getAccess("transactions", "getTransactionLogs"),
                        callback: () => navigate(`/transactions/${id}/logs`),
                      },
                      {
                        icon: (
                          <PDFDownloadLink
                            document={<TransactionPdf />}
                            fileName="somename.pdf"
                          >
                            {({ blob, url, loading, error }) =>
                              loading ? "Loading document..." : <PictureAsPdf />
                            }
                          </PDFDownloadLink>
                        ),
                        access: getAccess("transactions", "getTransactionLogs"),
                      },
                    ]}
                    actionCustom={[
                      {
                        title: "callback",
                        callback: () => sendCallback(),
                      },
                      {
                        title: "status",
                        callback: () => sendStatus(),
                      },
                    ]}
                  />
                }
              />
              <Divider />
              <TableStatic>
                {Object.keys(dataList).map(function (i, index) {
                  return (
                    <TableRow key={i}>
                      <TableCell>{t(i)}</TableCell>
                      <TableCell>
                        {i === "createOn" || i === "editOn"
                          ? toLocaleDateTime(dataList[i])
                          : dataList[i]}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableStatic>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TransactionsList;
