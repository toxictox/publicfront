import { BackButton, GroupTable } from '@comp/core/buttons';
import useSettings from '@hooks/useSettings';
import {
  Box,
  Card,
  CardHeader,
  Container,
  Divider,
  TablePagination
} from '@material-ui/core';
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
  const [data, setData] = useState(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/transit-account/transitTransactions');
    }
  }, [isAuthenticated, navigate]);

  const fetchData = useCallback(async () => {
    try {
      const result = await getStatement(page + 1, id, rowsPerPage);
      setData(result);
      setTotalRows(result.count);
    } catch (error) {
      toast.error('Error!');
    }
  }, [page, id, rowsPerPage]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [page, id, fetchData]);

  const openCreateStatement = useCallback(() => {
    handleOpen();
  }, [handleOpen]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
                <TablePagination
                  component="div"
                  count={totalRows}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                />
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
