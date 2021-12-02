import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Box, CardHeader, Container, Card } from "@material-ui/core";

import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";
import { useTranslation } from "react-i18next";
import gtm from "../../lib/gtm";
import { ExportFileFilter } from "@comp/export";

import axios from "@lib/axios";
import { app } from "@root/config";

const ExportList = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [filterList, setFilterList] = useState({});

  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  const createFile = async (values) => {
    await axios
      .post(`${app.api}/export`, values !== undefined ? values : filterList, {
        responseType: "blob",
      })
      .then((response) => {
        const downloadUrl = URL.createObjectURL(response.data);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `${response.headers["content-disposition"].split("=")[1]}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setFilterList(values);
      });
  };

  return (
    <>
      <Helmet>
        <title>{t("Export List")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <Box sx={{ mt: 1 }}>
            <Card sx={{ mt: 1 }}>
              <CardHeader title={t("Export List")} />
              <ExportFileFilter callback={createFile} />
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ExportList;
