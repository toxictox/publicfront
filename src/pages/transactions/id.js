import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Card,
  TableRow,
  TableCell,
  CardHeader,
  Divider,
  Alert
} from '@material-ui/core';
import useMounted from '@hooks/useMounted';
import useSettings from '@hooks/useSettings';
import { Info, PictureAsPdf } from '@material-ui/icons';
import axios from '@lib/axios';
import { app } from '@root/config';
import { useTranslation } from 'react-i18next';
import { TableStatic } from '@comp/core/tables/index';
import { BackButton, GroupTable } from '@comp/core/buttons';
import { toLocaleDateTime } from '@lib/date';
import toast from 'react-hot-toast';
import useAuth from '@hooks/useAuth';
import HoldersList from '@comp/transaction/HoldersList';
import { getFileHelper } from '@utils/getCsvFileHelper';

const TransactionsList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getAccess } = useAuth();
  const [dataList, setListData] = useState({});
  const [status, setStatus] = useState(undefined);

  const { user } = useAuth();
  const [merchId] = useState(
    localStorage.getItem('merchId') !== null
      ? localStorage.getItem('merchId')
      : user.merchantId
  );

  const getItem = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/transaction/${id}`)
        .then((response) => response.data);
      if (mounted.current) {
        setListData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted, id]);

  const sendCallback = async () => {
    await axios
      .post(`${app.api}/transactions/callback/${id}`)
      .then((response) => {
        toast.success(t('Success update'));
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const sendStatus = async () => {
    await axios
      .post(`${app.api}/transactions/status/${id}`)
      .then((response) => {
        toast.success(t('Success update'));
        setStatus(() => response.data);
        getItem();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const deleteTransaction = () => {
    axios
      .post(
        `${app.api}/merchant/trans/update?key=$2y$12$kfCtPRzJfNmZsC.UhyK/WeRgB.I9OqWcODNi8FFGGGZE7HoJKThT2&status=3000`,
        { tranId: [dataList.tranId] }
      )
      .then((response) => {
        toast.success(t('Success update'));
        setStatus(() => response.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const confirmationDownload = () => {
    axios
      .get(`${app.api}/merchant/${merchId}/document/transaction/confirmation/transaction/${id}/`, {
        responseType: 'blob'
      })
      .then((res) => {
        const { data, headers } = res;
        getFileHelper(data, headers, `${id}.pdf`);
      });

  }

  const getActionCustom = (status) => {
    const actions = [
      {
        title: 'callback',
        callback: () => sendCallback()
      },
      {
        title: t('status'),
        callback: () => sendStatus()
      }
    ];
    if (status == 1000) {
      actions.push({
        title: t('confirmation'),
        callback: () => confirmationDownload()
      });
    }
    return actions;
  };

  useEffect(() => {
    getItem();
  }, [getItem]);

  return (
    <>
      <Helmet>
        <title>Transactions List</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 2
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <BackButton action={() => navigate('/transactions')} />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              {status ? (
                <Alert color={'success'} sx={{ m: 2 }}>
                  {status.description}
                </Alert>
              ) : null}
              <Divider />
              <CardHeader
                title={t('Transactions Item')}
                action={
                  <GroupTable
                    actionCustomIcon={[
                      {
                        icon: <Info />,
                        title: `l${id}`,
                        access: getAccess('transactions', 'getTransactionLogs'),
                        callback: () => navigate(`/transactions/${id}/logs`)
                      }
                    ]}
                    actionCustom={getActionCustom(
                      dataList.respCode,
                      dataList.cityRespCode
                    )}
                  />
                }
              />
              <Divider />
              <TableStatic>
                {dataList.trxReference &&
                  Object.keys(dataList.trxReference).map(function (i, index) {
                    return (
                      <TableRow key={i}>
                        <TableCell>{t(i)}</TableCell>
                        <TableCell>
                          {i === 'createOn' || i === 'editOn'
                            ? toLocaleDateTime(dataList[i])
                            : dataList[i]}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableStatic>
            </Card>
            {getAccess('transactions', 'viewExtraInfo') &&
              <HoldersList transactionId={id}/>
            }

            {dataList.geoData &&
              <Card sx={{ mt: 2 }}>
                <CardHeader
                  title={t('IP Geo data')}
                />
                <Divider />
                <TableStatic>
                  {Object.keys(dataList.geoData).map(function (index) {
                      return (
                        <TableRow key={index}>
                          <TableCell>{t(index)}</TableCell>
                          <TableCell>
                            {dataList.geoData[index]}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableStatic>
              </Card>
            }
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TransactionsList;
