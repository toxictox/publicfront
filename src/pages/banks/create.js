import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Box, Container, Card, CardHeader, Divider } from "@material-ui/core";

import useSettings from "@hooks/useSettings";
import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import CreateBankForm from "@comp/banks/CreateBankForm";
import toast from "react-hot-toast";
import { BackButton } from "@comp/core/buttons";

const UserIdUpdate = () => {
  const { settings } = useSettings();

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (values) => {
    try {
      await axios.post(`${app.api}/bank`, { ...values }).then((response) => {
        toast.success(t("Success update"));
        navigate(`/banks`);
      });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("Bank Item Create")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <BackButton action={() => navigate(`/banks`)} />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader title={t("Bank Item Create")} />
              <Divider />
              <CreateBankForm callback={handleSubmit} />
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default UserIdUpdate;
