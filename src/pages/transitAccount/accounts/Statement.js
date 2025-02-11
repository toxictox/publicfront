import { BackButton, GroupTable } from '@comp/core/buttons';
import useSettings from '@hooks/useSettings';
import { Box, Card, CardHeader, Container, Divider } from '@material-ui/core';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { createStatement, getStatement } from '../helper';
import CreateStatementDialog from './CreateStatementDialog';
import StatementTable from './StatementTable';

const Statement = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { id } = useParams();
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [totalRows, setTotalRows] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/transit-account/transitTransactions');
    }
  }, [isAuthenticated, navigate]);

  const fetchData = useCallback(async () => {
    try {
      const result = await getStatement(page + 1, id);
      setData(result);
      setTotalRows(result.count);
    } catch (error) {
      toast.error('Error!');
    }
  }, [page, id]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [page, id, fetchData]);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const openCreateStatement = useCallback(() => {
    handleOpen();
  }, [handleOpen]);

  const handleSubmit = useCallback(
    async (values) => {
      try {
        await createStatement(id, values);
        toast.success('Statement created!');
        fetchData();
      } catch (error) {
        toast.error('Error!');
      }
      handleClose();
    },
    [id, fetchData, handleClose]
  );

  return (
    <>
      {isAuthenticated && (
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 2
          }}
        >
          <Container maxWidth={settings.compact ? 'xl' : false}>
            <BackButton
              action={() => navigate('/transit-account/transitTransactions')}
            />
            <Box sx={{ minWidth: 700 }}>
              <Card sx={{ mt: 2 }}>
                <CardHeader
                  title={t('Account statements')}
                  action={
                    <GroupTable
                      actionCreate={{
                        callback: () => openCreateStatement()
                      }}
                    />
                  }
                />
                <Divider />
                {data && (
                  <StatementTable
                    data={data}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalRows={totalRows}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                )}
              </Card>
            </Box>
          </Container>
        </Box>
      )}
      <CreateStatementDialog
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default Statement;
