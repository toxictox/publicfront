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
  CardHeader,
  Divider,
} from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";
import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import UpdateForm from "@comp/users/UpdateForm";
import toast from "react-hot-toast";

const UserIdUpdate = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dataList, setListData] = useState(null);

  const getItem = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/user/${id}`)
        .then((response) => response.data);
      if (mounted.current) {
        setListData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  const handleSubmit = async (values) => {
    try {
      await axios
        .patch(`${app.api}/user/${id}`, { ...values })
        .then((response) => {
          toast.success(t("Success update"));
          navigate(`/users/id/${id}`);
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
        <title>{t("User Item Update")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 1 }}>
              <CardHeader title={t("User Item Update")} />
              <Divider />
              {dataList !== null ? (
                <UpdateForm data={dataList} callback={handleSubmit} />
              ) : null}
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
                  onClick={() => navigate(`/users/id/${id}`)}
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

export default UserIdUpdate;
