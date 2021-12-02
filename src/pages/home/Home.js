import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import gtm from "@lib/gtm";
import { Box, Container, Grid } from "@material-ui/core";
import useSettings from "@hooks/useSettings";
import { StatBox, StatSalesRevenue } from "@comp/core/stat/index";
import axios from "@lib/axios";
import { app } from "@root/config";

const Home = () => {
  const { settings } = useSettings();
  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  const [total, setTotal] = useState({});

  useEffect(async () => {
    await axios
      .get(`${app.api}/board/totals/7`)
      .then((response) => setTotal(response.data));
  }, []);

  return (
    <>
      <Helmet>
        <title>home page</title>
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
            <Grid item xl={12} md={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item md={6} sm={6} xs={12}>
                  <StatBox
                    title={"Успешные"}
                    value={`${total.successAmount} грн`}
                    description={`Количество ${total.successCount}`}
                    status={true}
                  />
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                  <StatBox
                    title={"Отмененные"}
                    value={`${total.reverseAmount} грн`}
                    description={`Количество ${total.reverseCount}`}
                    status={false}
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <StatSalesRevenue title={"Аналитика транзакций"} />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Home;
