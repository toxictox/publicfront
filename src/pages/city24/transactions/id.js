import { useCallback, useEffect, useState, Fragment } from 'react';
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
  Alert,
} from '@material-ui/core';
import useMounted from '@hooks/useMounted';
import useSettings from '@hooks/useSettings';
import { Info } from '@material-ui/icons';

import axios from '@lib/axios';
import { app } from '@root/config';
import { useTranslation } from 'react-i18next';
import { TableStatic } from '@comp/core/tables/index';
import { BackButton, GroupTable } from '@comp/core/buttons';
import { toLocaleDateTime } from '@lib/date';
import toast from 'react-hot-toast';
import useAuth from '@hooks/useAuth';
import { showConfirm } from '@slices/dialog';
import { useDispatch } from 'react-redux';

const TransactionsList = () => {
  const mounted = useMounted();
  const dispatch = useDispatch();
  const { settings } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getAccess } = useAuth();
  const [dataList, setListData] = useState({
    data: [],
  });
  const [status, setStatus] = useState(undefined);

  const getItem = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/transaction/city/${id}`)
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
      .post(`${app.api}/transactions/city/status/${id}`)
      .then((response) => {
        dispatch(
          showConfirm({
            title: t('city24.status'),
            text: response.data.respMessage.xml,
            isOpen: true,
          })
        );
        //setStatus(() => response.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const sendCancel = async () => {
    await axios
      .post(`${app.api}/transactions/city/cancel/${id}`)
      .then((response) => {
        dispatch(
          showConfirm({
            title: t('city24.cancel'),
            text: response.data.respMessage.xml,
            isOpen: true,
          })
        );
        //setStatus(() => response.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const sendRegister = async () => {
    await axios
      .post(`${app.api}/transactions/city/register/${id}`)
      .then((response) => {
        dispatch(
          showConfirm({
            title: t('city24.register'),
            text: response.data.respMessage.xml,
            isOpen: true,
          })
        );
        //setStatus(() => response.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
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
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <BackButton action={() => navigate(-1)} />
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
                    actionCustom={[
                      {
                        title: t('register-city'),
                        callback: () => sendRegister(),
                      },
                      {
                        title: t('cancel-city'),
                        callback: () => sendCancel(),
                      },
                      {
                        title: t('status-city'),
                        callback: () => sendStatus(),
                      },
                    ]}
                  />
                }
              />
              <Divider />
              <TableStatic>
                {Object.keys(dataList).map(function (i, index) {
                  return (
                    <Fragment key={i}>
                      {i !== 'uuid' ? (
                        <TableRow key={i}>
                          <TableCell>{t(i)}</TableCell>
                          <TableCell>
                            {i === 'createOn' || i === 'editOn'
                              ? toLocaleDateTime(dataList[i])
                              : dataList[i]}
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </Fragment>
                  );
                })}
              </TableStatic>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TransactionsList;
