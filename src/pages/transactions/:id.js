import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Backspace } from "@material-ui/icons";
import {
  Box,
  Container,
  Grid,
  Button,
  Card,
  TableRow,
  TableCell,
  CardHeader,
  Divider,
} from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";
// import gtm from "../../lib/gtm";
import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import { TableScroll } from "@comp/core/tables/index";

const TransactionsList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dataList, setListData] = useState({
    data: [],
  });

  // useEffect(() => {
  //   gtm.push({ event: "page_view" });
  // }, []);
  const goBack = () => {
    navigate("/transaction");
  };
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
  }, [mounted]);

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
          <Grid container justifyContent="space-between" spacing={3}>
            <Grid sx={6} item>
              <Button
                variant="contained"
                color="primary"
                onClick={goBack}
                startIcon={<Backspace />}
              >
                {t("Back button")}
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 3 }}>
              <CardHeader title={t("Transactions Item")} />
              <Divider />
              <TableScroll>
                {Object.keys(dataList).map(function (i, index) {
                  return (
                    <TableRow key={i}>
                      <TableCell>{t(i)}</TableCell>
                      <TableCell>{dataList[i]}</TableCell>
                    </TableRow>
                  );
                })}
              </TableScroll>
            </Card>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
              sx={{ mt: 0 }}
            >
              <Grid sx={12} item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={goBack}
                  startIcon={<Backspace />}
                >
                  {t("Back button")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TransactionsList;
