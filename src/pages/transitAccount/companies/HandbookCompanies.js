import { CreateButton } from '@comp/core/buttons';
import useSettings from '@hooks/useSettings';
import {
  Box,
  Card,
  CardHeader,
  Container,
  Divider,
  TablePagination
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import AuthTransitAccount from '../Auth';
import { getAllCompanies } from '../helper';
import { HandbookTable } from './HandbookTable';

const HandbookCompanies = () => {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(false);
  const [count, setCount] = useState(10);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [companies, setCompanies] = useState([]);
  const [totalRows, setTotalRows] = useState(0); //

  const handleAuthSuccess = () => {
    setAuthState(true);
  };
  const fakeCompanies = [
    {
      id: 1,
      name: 'Test2',
      iin: '220440024754',
      bik: 'TSESKZKA',
      bankAccount: 'KZ089985TB0001712398',
      bankName: 'Can be empty'
    },
    {
      id: 1,
      name: 'Test2',
      iin: '220440024754',
      bik: 'TSESKZKA',
      bankAccount: 'KZ089985TB0001712398',
      bankName: 'Can be empty'
    }
  ];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getAllCompanies(page + 1, rowsPerPage);
        setCompanies(data.companies);
        setTotalRows(data.total || 0);
      } catch (error) {
        console.log('Error fetching companies:', error);
        setTotalRows(0);
      }
    };

    fetchCompanies();
  }, [page, rowsPerPage]);

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
          {authState ? (
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

                {fakeCompanies && fakeCompanies.length > 0 ? (
                  <>
                    <HandbookTable fakeCompanies={fakeCompanies} />
                    <TablePagination
                      component="div"
                      count={totalRows}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      rowsPerPageOptions={[5, 10, 25, 50, 100]}
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
