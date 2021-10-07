import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Box, Container, Card, CardHeader, Divider } from "@material-ui/core";
import useSettings from "@hooks/useSettings";
import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import CreateForm from "@comp/roles/CreateForm";
import toast from "react-hot-toast";
import { BackButton } from "@comp/core/buttons";

const RoleCreate = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { state } = useLocation();

  const handleSubmit = async (values) => {
    try {
      await axios
        .post(`${app.api}/role/set`, {
          ...values,
          merchantId: state.merchantId,
        })
        .then((response) => {
          toast.success(t("Success update"));
          navigate(`/roles`);
        });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("Role Item Create")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <BackButton action={() => navigate(`/roles`)} />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader title={t("Role Item Create")} />
              <Divider />
              <CreateForm callback={handleSubmit} />
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default RoleCreate;
