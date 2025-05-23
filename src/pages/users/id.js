import { BackButton, GroupTable } from '@comp/core/buttons';
import { TableStatic } from '@comp/core/tables/index';
import useAuth from '@hooks/useAuth';
import useMounted from '@hooks/useMounted';
import useSettings from '@hooks/useSettings';
import axios from '@lib/axios';
import { toLocaleDateTime } from '@lib/date';
import {
  Box,
  Card,
  CardHeader,
  Container,
  Divider,
  TableCell,
  TableRow
} from '@material-ui/core';
import { app } from '@root/config';
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const UserId = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getAccess } = useAuth();
  const [dataList, setListData] = useState({
    data: []
  });

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
  }, [mounted, id]);

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
          pt: 2
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <BackButton action={() => navigate('/users')} />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t('User Item')}
                action={
                  <GroupTable
                    actionUpdate={{
                      access: getAccess('users', 'update'),
                      callback: () => navigate(`/users/id/${id}/update`)
                    }}
                  />
                }
              />
              <Divider />
              <TableStatic>
                <TableRow>
                  <TableCell width={'50%'}>{t('firstName')}</TableCell>
                  <TableCell>{dataList.firstName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('lastName')}</TableCell>
                  <TableCell>{dataList.lastName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('email table')}</TableCell>
                  <TableCell>{dataList.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('phone')}</TableCell>
                  <TableCell>{dataList.phone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('hash')}</TableCell>
                  <TableCell>{dataList.hash}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('merchant')}</TableCell>
                  <TableCell>{dataList.merchantName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('lastLogin')}</TableCell>
                  <TableCell>
                    {dataList.lastLogin
                      ? toLocaleDateTime(dataList.lastLogin)
                      : null}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('loginTries')}</TableCell>
                  <TableCell>{dataList.loginTries}</TableCell>
                </TableRow>
              </TableStatic>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default UserId;
