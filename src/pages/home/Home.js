import {
  PieStat,
  StackedChart,
  StatBox,
  StatSalesRevenue
} from '@comp/core/stat/index';
import useAuth from '@hooks/useAuth';
import useSettings from '@hooks/useSettings';
import axios from '@lib/axios';
import gtm from '@lib/gtm';
import { Box, Card, Container, Grid, Typography } from '@material-ui/core';
import { app } from '@root/config';
import { formatCurrency } from '@utils/formatCurrency';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { settings } = useSettings();
  const { t } = useTranslation();
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);
  const { user, getAccess } = useAuth();

  const [total, setTotal] = useState({});
  const [terminalBalances, setTerminalBalances] = useState([]);

  const getTerminalbBalances = async () => {
    await axios
      .get(`${app.api}/merchant/${user.merchantId}/terminal/balance`)
      .then((response) => {
        setTerminalBalances(response.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    const getData = async () => {
      await axios
        .get(`${app.api}/board/totals/7`)
        .then((response) => setTotal(response.data));
    };
    getData();
    getTerminalbBalances();
    const interval = setInterval(getTerminalbBalances, 30000);
    return () => clearInterval(interval);
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
              {terminalBalances.length > 0 && getAccess('boardBalance', 'read') && (
                <Grid item md={12} sm={12} xs={12}>
                  <Card sx={{ height: '100%', mb: 2 }}>
                    <Box
                      sx={{
                        p: 3
                      }}
                    >
                      <Typography color="textPrimary" variant="subtitle2">
                        {t('Balance merchants')}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                        {terminalBalances.map((item) => (
                          <>
                            <Grid item xs={4}>
                              <Typography
                                variant="subtitle1"
                                className="balanse__title"
                                component="div"
                              >
                                {item.label}
                              </Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Typography
                                variant="subtitle2"
                                className="balanse__amount"
                                component="div"
                                sx={{ textAlign: 'right' }}
                              >
                                {formatCurrency(item.amount / 100, '\u20B8')}
                              </Typography>
                            </Grid>
                          </>
                        ))}
                      </Grid>
                    </Box>
                  </Card>
                </Grid>
              )}

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
