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
import { BackButton } from "@comp/core/buttons";
import { toLocaleDateTime } from "@lib/date";

const TransactionsList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [dataList, setListData] = useState({
    data: [],
  });

  const getItem = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/transactions/logs/${id}`)
        .then((response) => response.data);
      if (mounted.current) {
        setListData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted, id]);

  useEffect(() => {
    getItem();
  }, [getItem]);

  return (
    <>
      <Helmet>
        <title>{t("Transactions Logs Item")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <BackButton action={() => navigate(-1)} />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader title={t("Transactions Logs Item")} />
              <Divider />
              <TableStatic header={["createOn", "message", "data"]}>
                {dataList.data.map((item) => (
                  <TableRow hover key={item.id}>
                    <TableCell width={200}>
                      {toLocaleDateTime(item.createOn)}
                    </TableCell>
                    <TableCell>{item.message}</TableCell>
                    <TableCell width={"50%"}>{item.data}</TableCell>
                  </TableRow>
                ))}
              </TableStatic>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TransactionsList;
