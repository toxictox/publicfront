import {
  Alert,
  Box,
  Card,
  CardHeader,
  Container,
  Divider,
  InputAdornment,
  TableCell,
  TablePagination,
  TableRow,
  TextField
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';

import { CreateButton, GroupTable } from '@comp/core/buttons';
import { TableStatic } from '@comp/core/tables';
import useMounted from '@hooks/useMounted';
import useSettings from '@hooks/useSettings';

import axios from '@lib/axios';
import { toLocaleDateTime } from '@lib/date';
import { app } from '@root/config';
import { useTranslation } from 'react-i18next';
import { processUserList } from './userListUtils';

const UserInactiveList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [dataList, setListData] = useState({
    data: []
  });
  const [page, setPage] = useState(0);
  const [searchEmail, setSearchEmail] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const linkToken = useMemo(
    () => (state !== null && state.link !== undefined ? state.link : undefined),
    [state]
  );

  const createInviteLink = () => {
    return `${window.location.origin}/authentication/register/${linkToken}`;
  };

  const getOrders = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/users/inactive?page=${page}&count=${25}`)
        .then((response) => response.data);

      if (mounted.current) {
        setListData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted, page]);

  const handlePageChange = async (e, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  useEffect(() => {
    setFilteredData(processUserList(dataList, searchEmail));
  }, [searchEmail, dataList]);

  return (
    <>
      <Helmet>
        <title>{t('Users List')}</title>
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
            <TextField
              fullWidth
              placeholder={t('Search by email')}
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
            />
            {linkToken !== undefined ? (
              <Alert severity="success">
                {t('Invitation link')} — {createInviteLink()}
              </Alert>
            ) : null}

            <Card sx={{ mt: 1 }}>
              <CardHeader
                title={t('Users List')}
                action={
                  <CreateButton
                    action={() => navigate('/users/create')}
                    text={t('Create button')}
                  />
                }
              />
              <Divider />
              <TableStatic
                header={[
                  'email table',
                  'firstName',
                  'phone',
                  'loginTries',
                  'lastLogin',
                  ''
                ]}
              >
                {filteredData.map(function (item) {
                  return (
                    <TableRow hover key={item.hash}>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>
                        {item.firstName} {item.lastName}
                      </TableCell>
                      <TableCell>{item.phone}</TableCell>
                      <TableCell>{item.loginTries}</TableCell>
                      <TableCell>
                        {item.lastLogin
                          ? toLocaleDateTime(item.lastLogin)
                          : null}
                      </TableCell>
                      <TableCell align={'right'}>
                        <GroupTable
                          actionView={() => navigate(`/users/id/${item.hash}`)}
                          actionCustom={[
                            {
                              title: t('role'),
                              callback: () =>
                                navigate(`/users/id/${item.hash}/role`)
                            }
                          ]}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableStatic>
            </Card>
            <TablePagination
              component="div"
              count={dataList.count}
              onPageChange={handlePageChange}
              page={page}
              rowsPerPage={25}
              rowsPerPageOptions={[25]}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default UserInactiveList;
