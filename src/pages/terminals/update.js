import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Box, Container, Card, CardHeader, Divider } from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";
import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import UpdateForm from "@comp/terminals/UpdateTerminalForm";
import toast from "react-hot-toast";
import { BackButton } from "@comp/core/buttons";

const TerminalUpdate = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dataList, setListData] = useState(null);

  const getItem = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/terminal/${id}`)
        .then((response) => response.data);
      if (mounted.current) {
        setListData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted, id]);

  const handleSubmit = async (values) => {
    try {
      const requestData = {
        ...values,
        options: typeof values.options === 'object' && !Array.isArray(values.options)
            ? values.options
            : {}
      };

      await axios
          .put(`${app.api}/terminal/${id}`, requestData)
          .then((response) => {
            toast.success(t("Success update"));
            navigate(`/terminals/id/${id}`);
          });
    } catch (err) {
      toast.error(err.response?.data?.message || "Ошибка обновления");
    }
  };

  useEffect(() => {
    getItem();
  }, [getItem]);

  return (
    <>
      <Helmet>
        <title>{t("Terminals Item Update")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <BackButton action={() => navigate(`/terminals/id/${id}`)} />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader title={t("Terminals Item Update")} />
              <Divider />
              {dataList !== null ? (
                <UpdateForm data={dataList} callback={handleSubmit} />
              ) : null}
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TerminalUpdate;
