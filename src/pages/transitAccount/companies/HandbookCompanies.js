import { CreateButton } from '@comp/core/buttons';
import useSettings from '@hooks/useSettings';
import { Box, Card, CardHeader, Container, Divider, TablePagination } from '@material-ui/core';
import { setAuthState } from '@slices/authBck';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import AuthTransitAccount from '../Auth';
import { getAllCompanies } from '../helper';
import { HandbookTable } from './HandbookTable';

const HandbookCompanies = () => {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  

  const handleAuthSuccess = () => {
    dispatch(setAuthState(true));
  };

  const fetchCompanies = useCallback(async () => {
    try {
      const data = await getAllCompanies(page + 1, rowsPerPage);
      setCompanies(data.items);
      setTotalRows(data.count || 0);
    } catch (error) {
      setTotalRows(0);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCompanies();
    }
  }, [fetchCompanies, isAuthenticated, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 2
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          {!isAuthenticated ? (
            <Card sx={{ mt: 1, maxWidth: 600, p: 4 }}>
              <AuthTransitAccount onAuthSuccess={handleAuthSuccess} />
            </Card>
          ) : (
            <Box sx={{ mt: 1 }}>
              <Card sx={{ mt: 1 }}>
                <CardHeader
                  title={t('Handbook Companies')}
                  action={
                    <CreateButton
                      action={() => navigate('/transit-account/handbook/form')}
                      text={t('Create button')}
                    />
                  }
                />
                <Divider />

                {companies && companies.length > 0 ? (
                  <>
                    <HandbookTable
                      companies={companies}
                      refreshCompanies={fetchCompanies}
                    />
                    <TablePagination
                      component="div"
                      count={totalRows}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      rowsPerPageOptions={[5, 10, 25, 50]}
                    />
                  </>
                ) : (
                  <p>{t('No companies available')}</p>
                )}
              </Card>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default HandbookCompanies;
