import useSettings from '@hooks/useSettings';
import {
  Box,
  Button,
  Card,
  Container,
  LinearProgress,
  TablePagination
} from '@material-ui/core';
import { setAuthState } from '@slices/authBck';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import AuthTransitAccount from '../Auth';
import { getAllAccounts, getAllTransactions } from '../helper';
import { Accounts } from './Accounts';
import { TransactionsTable } from './TransactionsTable';

const TransitTransactions = () => {
  const { settings } = useSettings();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleAuthSuccess = () => {
    dispatch(setAuthState(true));
  };

  const getData = async () => {
    try {
      const [accountsResponse, transactionResponse] = await Promise.all([
        getAllAccounts(),
        getAllTransactions(page + 1, rowsPerPage)
      ]);
      setAccounts(accountsResponse);
      setTransactions(transactionResponse);
      setTotalRows(transactionResponse.count || 0);
    } catch (err) {
      console.log('error');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getData();
    }
  }, [isAuthenticated, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <>
      {loading && (
        <LinearProgress
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 9999
          }}
        />
      )}

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
            <Box>
              {accounts && <Accounts accounts={accounts} />}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    navigate('/transit-account/createTransactions', {
                      state: { accounts }
                    });
                  }}
                >
                  {t('Create transactions')}
                </Button>
              </Box>
              <TransactionsTable
                transactions={transactions}
                refetch={getData}
                setLoading={setLoading}
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
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};
export default TransitTransactions;
