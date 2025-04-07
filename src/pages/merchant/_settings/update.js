import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Box, Container, Card, CardHeader, Divider } from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";
import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import UpdateForm from "@comp/merchant/settings/UpdateForm";
import toast from "react-hot-toast";
import { BackButton } from "@comp/core/buttons";

const Update = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dataList, setListData] = useState(null);

  const getItem = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/merchant/${id}/settings`)
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
      await axios
        .put(`${app.api}/merchant/${id}/settings/update`, { ...values })
        .then((response) => {
          toast.success(t("Success update"));
          navigate(`/merchants/${id}/settings`);
        });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    getItem();
  }, [getItem]);

  return (
    <>
      <Helmet>
        <title>{t("Merchant Settings Update")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <BackButton action={() => navigate(`/merchants/id/${id}`)} />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader title={t("Merchant Settings Update")} />
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

export default Update;
