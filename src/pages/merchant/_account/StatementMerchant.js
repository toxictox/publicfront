import { GroupTable } from '@comp/core/buttons';
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
import CreateStatementDialogMerchant from './CreateStatementDialogMerchant';
import StatementTableMerchant from './StatementTableMerchant';
import { createStatement, getStatement } from './helper';

const StatementMerchant = ({ accountId, merchantId }) => {
  const { settings } = useSettings();
  const [data, setData] = useState(null);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const fetchData = useCallback(async () => {
    try {
      const result = await getStatement(
        page + 1,
        merchantId,
        rowsPerPage,
        accountId
      );
      setData(result);
      setTotalRows(result.count);
    } catch (error) {
      toast.error('Error!');
    }
  }, [page, accountId, rowsPerPage, merchantId]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [page, merchantId, fetchData]);

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
        await createStatement(merchantId, accountId, values);
        toast.success('Statement created!');
        fetchData();
      } catch (error) {
        toast.error('Error!');
      }
      handleClose();
    },
    [accountId, merchantId, fetchData, handleClose]
  );

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
                <StatementTableMerchant
                  data={data}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  totalRows={totalRows}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  accountId={accountId}
                  merchantId={merchantId}
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
      <CreateStatementDialogMerchant
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default StatementMerchant;
