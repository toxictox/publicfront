import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import gtm from '@lib/gtm';
import { Box, Container, Grid } from '@material-ui/core';
import useSettings from '@hooks/useSettings';
import {
  StatBox,
  StatSalesRevenue,
  PieStat,
  StackedChart
} from '@comp/core/stat/index';
import axios from '@lib/axios';
import { app } from '@root/config';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@utils/formatCurrency';

const Home = () => {
  const { settings } = useSettings();
  const { t } = useTranslation();
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const [total, setTotal] = useState({});

  useEffect(() => {
    const getData = async () => {
      await axios
        .get(`${app.api}/board/totals/7`)
        .then((response) => setTotal(response.data));
    };
    getData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Главная страница</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 2
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Box sx={{ mt: 1 }}>
            <Grid item xl={12} md={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item md={4} sm={4} xs={12}>
                  <StatBox
                    title={t('Success tab')}
                    value={`${formatCurrency(total.successAmount)}`}
                    description={`Количество ${total.successCount}`}
                    status={true}
                  />
                </Grid>
                <Grid item md={8} sm={8} xs={12}>
                  <StatBox
                    title={t('Failed tab')}
                    value={`${formatCurrency(total.failedAmount)}`}
                    description={`Количество ${total.failedCount}`}
                    status={false}
                  />
                </Grid>
         {/*       <Grid item md={4} sm={4} xs={12}>
                  <StatBox
                    title={t('Conversion tab')}
                    value={`${total.conversion} %`}
                    description={`Количество ${total.reverseCount}`}
                  />
                </Grid>*/}
                <Grid item md={12} sm={12} xs={12}>
                  <StatSalesRevenue title={'Аналитика транзакций'} />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <StackedChart title={'Top кодов отказа'} />
                </Grid>
                <Grid item md={6} sm={6} xs={6}>
                  <PieStat title={'Visa/Master'} data={total} />
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
