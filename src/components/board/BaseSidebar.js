import {
  Box,
  Divider,
  Drawer,
  Grid,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { red } from '@material-ui/core/colors'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import {
  AccountBalance,
  BlurLinear,
  CenterFocusWeak,
  Code,
  DescriptionOutlined,
  Dns,
  GridOn,
  Group,
  Home,
  LinearScale,
  PriceCheck,
  Receipt,
  Security,
  Storefront,
  Timeline,
  VpnLock
} from '@material-ui/icons'
import PropTypes from 'prop-types'
import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import NavSection from './NavSection'
import Scrollbar from './Scrollbar'

import useAuth from '@hooks/useAuth'
import axios from '@lib/axios'
import { app } from '@root/config'
import { formatCurrency } from '@utils/formatCurrency'
import './styles/sidebar.scss'

const BaseSidebar = (props) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [merchId, setMerchId] = useState(
    localStorage.getItem('merchId') !== null
      ? localStorage.getItem('merchId')
      : user.merchantId
  );

  const [balance, setBalance] = useState({
    balance: 0,
    hold: 0,
    available: 0,
    day_credit: 0,
    day_debit: 0,
    month_credit: 0,
    month_debit: 0,
    month_transaction_debit: 0,
    month_transaction_credit: 0,
    day_transaction_credit: 0,
    day_transaction_debit: 0,
  });

  const [overdrafts, setOverdrafts] = useState([]);
  const [overdraftsSum, setOverdraftsSum] = useState(0);

  const getOverdrafts = async () => {
    await axios
      .get(`${app.api}/merchant/${merchId}/overdraft/totals`)
      .then((response) => {
        setOverdrafts(response.data);
        setOverdraftsSum(response.data.reduce((sum, val) => {
          return sum + Math.abs(val.amount);
        }, 0));
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    const intervalCall = setInterval(() => {
      getOverdrafts();
    }, 30000);
    getOverdrafts();
    return () => {
      clearInterval(intervalCall);
    };
  }, []);

  const getActiveStatus = (name) => {
    return user.permissions[name] !== undefined;
  };
  const sections = [
    {
      title: '',
      items: [
        {
          title: t('Dashboard menu'),
          path: '/board',
          icon: <Home fontSize="small" />,
          active: true
        },
        {
          title: t('Transaction menu'),
          path: '/transactions',
          icon: <Receipt fontSize="small" />,
          active: getActiveStatus('transactions')
        },
        {
          title: t('Users menu'),
          path: '/users',
          icon: <Group fontSize="small" />,
          active: getActiveStatus('users'),
          children: [
            {
              title: t('Users active menu'),
              path: '/users',
              icon: <Group fontSize="small" />,
              active: getActiveStatus('users')
            },
            {
              title: t('Users inactive menu'),
              path: '/users/inactive',
              icon: <Group fontSize="small" />,
              active: getActiveStatus('users')
            }
          ]
        },

        {
          title: t('Role menu'),
          path: '/roles',
          icon: <Security fontSize="small" />,
          active: getActiveStatus('roles')
        },
        {
          title: t('Banks menu'),
          path: '/banks',
          icon: <AccountBalance fontSize="small" />,
          active: getActiveStatus('banks')
        },
        {
          title: t('Flow menu'),
          path: '/flows',
          icon: <Timeline fontSize="small" />,
          active: getActiveStatus('flows')
        },
        {
          title: t('Gateway menu'),
          path: '/gateways',
          icon: <CenterFocusWeak fontSize="small" />,
          active: getActiveStatus('gateways')
        },
        {
          title: t('Cascading menu'),
          path: '/cascading',
          icon: <LinearScale fontSize="small" />,
          active: getActiveStatus('cascading')
        },
        {
          title: t('Terminals menu'),
          path: '/terminals',
          icon: <BlurLinear fontSize="small" />,
          active: getActiveStatus('terminals')
        },
        {
          title: t('Merchant menu'),
          path: '/merchants',
          icon: <Storefront fontSize="small" />,
          active: getActiveStatus('merchants')
        },
        {
          title: t('Reconciliation menu'),
          path: '/reconciliation',
          icon: <PriceCheck fontSize="small" />,
          active: getActiveStatus('reconciliation'),
          children: [
            {
              title: t('reconciliationResult'),
              path: '/reconciliation/results',
              icon: <DescriptionOutlined fontSize="small" />,
              active: getActiveStatus('reconciliation')
            },
            {
              title: t('Reconciliation menu'),
              path: '/reconciliation',
              icon: <DescriptionOutlined fontSize="small" />,
              active: getActiveStatus('reconciliation')
            }
          ]
        },
        {
          title: t('Description menu'),
          path: '/export',
          icon: <DescriptionOutlined fontSize="small" />,
          active: getActiveStatus('export'),
          children: [
            {
              title: t('generated_reports_list'),
              path: '/export',
              icon: <DescriptionOutlined fontSize="small" />,
              active: getActiveStatus('export')
            }
          ]
        },
        {
          title: t('Catalogs menu'),
          icon: <GridOn fontSize="small" />,
          active: true,
          children: [
            {
              title: t('Sanctions List'),
              path: '/sanctions',
              icon: <VpnLock fontSize="small" />,
              active: true,
            },
            {
              title: t('Sanctions White List'),
              path: '/sanctions/exceptions',
              icon: <VpnLock fontSize="small" />,
              active: true,
            },
            {
              title: t('Bin menu'),
              path: '/bin',
              icon: <Dns fontSize="small" />,
              active: getActiveStatus('bin')
            },
            {
              title: t('Codes menu'),
              path: '/codes',
              icon: <Code fontSize="small" />,
              active: getActiveStatus('codes')
            }
          ]
        },
      ]
    }
  ];
  const { onMobileClose, openMobile } = props;
  const location = useLocation();

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const handleChangeMerch = async (e) => {
    localStorage.setItem('merchId', e.target.value);
    setMerchId(e.target.value);
    await axios
      .post(`${app.api}/user/${user.hash}`, {
        merchantId: e.target.value
      })
      .then((response) => {
        localStorage.setItem('accessToken', response.data.token);
        window.location.replace('/board');
      });
  };

  useEffect(() => {
    const getData = async () => {
      if (openMobile && onMobileClose) {
        await onMobileClose();
      }
    };
    getData();
  }, [location.pathname]);

  const getBalance = async () => {
    await axios
      .get(`${app.api}/merchant/${merchId}/balance`)
      .then((response) => {
        setBalance(response.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    const intervalCall = setInterval(() => {
      getBalance();
    }, 30000);
    getBalance();
    return () => {
      clearInterval(intervalCall);
    };
  }, []);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Scrollbar options={{ suppressScrollX: true }}>
        <Box sx={{ p: 2 }}>
          <Box>
            <TextField
              fullWidth
              label={t('merchId')}
              onChange={handleChangeMerch}
              select
              size="small"
              value={merchId}
              variant="outlined"
            >
              {user.merchants.map((item) => {
                return (
                  <MenuItem value={item.merchantId} key={item.merchantId}>
                    {item.merchantName}
                  </MenuItem>
                );
              })}
            </TextField>
          </Box>
        </Box>
        <Divider />
        { overdraftsSum > 0 &&
          <Box sx={{ paddingY: 1, paddingX: 3, marginTop: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography 
                  color={red[800]}
                  variant="subtitle1"
                  component="div"
                  className="balanse__title"
                >
                  {t('Overdraft')}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Tooltip
                  title={
                    <Fragment>
                      {overdrafts.map((item) => {
                          return <Typography color="inherit">{item.bank}: {formatCurrency(item.amount / 100, '\u20B8')}</Typography>
                      })}
                    </Fragment>
                  }
                >
                  <Typography
                    color={red[800]}
                    variant="subtitle2"
                    component="div"
                    className="balanse__amount"
                    sx={{ textAlign: 'right' }}
                  >
                    {formatCurrency(overdraftsSum / 100, '\u20B8')}
                  </Typography>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        }
        { Number(balance.hold) > 0 &&
        <Box sx={{ paddingY: 1, paddingX: 3, marginTop: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="subtitle1" component="div" className="balanse__title">
                {t('Hold Funds')}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="subtitle2"
                component="div"
                className="balanse__amount"
                sx={{ textAlign: 'right' }}
              >
                {formatCurrency(balance.hold / 100, '\u20B8')}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        }

        <Box sx={{ paddingY: 1, paddingX: 3, marginTop: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="subtitle1" component="div" className="balanse__title">
                {t('Available Funds')}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="subtitle2"
                className="balanse__amount"
                component="div"
                sx={{ textAlign: 'right' }}
              >
                {formatCurrency(balance.available / 100, '\u20B8')}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ paddingY: 1, paddingX: 3, marginTop: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="subtitle1" className="balanse__title" component="div">
                {t('Day Transactions Credit')}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="subtitle2"
                className="balanse__amount"
                component="div"
                sx={{ textAlign: 'right' }}
              >
                {formatCurrency(balance.dayTransactionCredit / 100, '\u20B8')}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ paddingY: 1, paddingX: 3, marginTop: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="subtitle1" className="balanse__title" component="div">
                {t('Day Transactions Debit')}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="subtitle2"
                className="balanse__amount"
                component="div"
                sx={{ textAlign: 'right' }}
              >
                {formatCurrency(balance.dayTransactionDebit / 100, '\u20B8')}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ paddingY: 1, paddingX: 3, marginTop: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="subtitle1" className="balanse__title" component="div">
                {t('Month Transactions Credit')}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="subtitle2"
                className="balanse__amount"
                component="div"
                sx={{ textAlign: 'right' }}
              >
                {formatCurrency(balance.monthTransactionCredit / 100, '\u20B8')}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ paddingY: 1, paddingX: 3, marginTop: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="subtitle1" className="balanse__title" component="div">
                {t('Month Transactions Debit')}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="subtitle2"
                className="balanse__amount"
                component="div"
                sx={{ textAlign: 'right' }}
              >
                {formatCurrency(balance.monthTransactionDebit / 100, '\u20B8')}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          {sections.map((section) => {
            return (
              <NavSection
                key={section.title}
                pathname={location.pathname}
                sx={{
                  '& + &': {
                    mt: 3
                  }
                }}
                {...section}
              />
            );
          })}
        </Box>
      </Scrollbar>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        onClose={onMobileClose}
        open={openMobile}
        //open
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            height: 'calc(100% - 64px) !important',
            top: '64px !Important',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onMobileClose}
      open={openMobile}
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          width: 280
        }
      }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

BaseSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default BaseSidebar;
