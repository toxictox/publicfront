import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Box, Container, Card, CardHeader, Divider } from "@material-ui/core";

import useSettings from "@hooks/useSettings";
import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import UpdateRoleForm from "@comp/users/UpdateRoleForm";
import toast from "react-hot-toast";
import { BackButton } from "@comp/core/buttons";

const UserIdUpdate = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (values) => {
    try {
      await axios
        .patch(`${app.api}/user/update/roles`, values)
        .then((response) => {
          toast.success(t("Success update"));
          navigate(`/users`);
        });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("Role Item Update")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <BackButton action={() => navigate(`/users`)} />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader title={t("Role Item Update")} />
              <Divider />
              <UpdateRoleForm callback={handleSubmit} />
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default UserIdUpdate;
