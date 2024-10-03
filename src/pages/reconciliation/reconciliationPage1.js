import { TableStatic } from '@comp/core/tables';
import FilterDialog from '@comp/reconciliation/coponents/filterDialog';
import useSettings from '@hooks/useSettings';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  Divider,
  TableCell,
  TablePagination,
  TableRow
} from '@material-ui/core';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import ConfirmationDialog from './confirmDialog';
import {
  getBanks,
  getMerchants,
  getResults,
  getStatuses,
  getTypes,
  resolved
} from './helper';
import { toLocaleDateTime } from '@lib/date'

const ReconciliationPage1 = () => {
  const { settings } = useSettings();
  const [reportData, setReportData] = useState([]);
  const [banks, setBanks] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const [dialogType, setDialogType] = useState(null);
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);

  const handleOpenDialogConfirm = () => {
    setOpenDialogConfirm(true);
  };

  const handleCloseDialog = () => {
    setOpenDialogConfirm(false);
  };

  const handleConfirm = (id) => {
    handleResolve(id);
    handleCloseDialog();
  };
  const handleRedirect = (tranId) => {
    navigate(`/transactions/${tranId}`);
  };
  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      try {
        const [
          reportResults,
          bankResults,
          merchantResults,
          statusesResults,
          typesResult
        ] = await Promise.all([
          getResults(page + 1, rowsPerPage),
          getBanks(),
          getMerchants(),
          getStatuses(),
          getTypes()
        ]);

        if (isMounted) {
          setReportData(reportResults);
          setBanks(bankResults);
          setMerchants(merchantResults);
          setStatuses(statusesResults);
          setTypes(typesResult);
          setTotalRows(reportResults?.count || 0);
        }
      } catch (error) {
        if (isMounted) {
          console.log(error);
          setTotalRows(0);
        }
      }
    };

    fetchAllData();
    return () => {
      isMounted = false;
    };
  }, [page, rowsPerPage]);

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleResolve = async (id) => {
    try {
      await resolved(id);
      setReportData((prevData) => ({
        ...prevData,
        items: prevData.items.map((item) =>
          item.id === id ? { ...item, resolved: true } : item
        )
      }));
    } catch (error) {
      console.error('Failed to resolve:', error);
    }
  };
  const reasonMapping = {
    nonExistent: 'Отсутствует в ПО',
    missing: 'Отсутствует в отчете',
    amount: 'Сумма',
    resp_code: 'Статус (код)',
    duplicate: 'Дубликат'
  };

  const handleOpenDownloadDialog = () => {
    setDialogType('download');
    setOpenDialog(true);
  };

  const handleOpenFilterDialog = () => {
    setDialogType('filter');
    setOpenDialog(true);
  };

  const handleFilterResults = (results) => {
    setReportData(results);
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
          <Button
            variant="contained"
            sx={{ marginBottom: '20px' }}
            onClick={handleOpenDownloadDialog}
          >
            {t('Download File')}
          </Button>

          <Button
            variant="contained"
            sx={{ marginBottom: '20px', marginLeft: '20px' }}
            onClick={handleOpenFilterDialog}
          >
            {t('Filter')}
          </Button>

          <Box sx={{ minWidth: 700 }}>
            <Card>
              <CardHeader title={t('reconciliationResult')} />
              <Divider />
              <TableStatic
                header={[
                  'reconciliationId',
                  'reconciliationJobName',
                  'createOn',
                  'bankId',
                  'merchantId',
                  'reason',
                  'tranId',
                  'fieldName',
                  'reference',
                  'originalField',
                  'reportField',
                  'resolved'
                ]}
              >
                {reportData.items?.map((item, index) => {
                  const bank = banks.data?.find(
                    (bank) => bank.id === item.bankId
                  );
                  const merchant = merchants.data?.find(
                    (merchant) => merchant.id === item.bankId
                  );
                  return (
                    <TableRow hover key={index}>
                      <TableCell>{item.reconciliationId}</TableCell>
                      <TableCell>{item.reconciliationJobName}</TableCell>
                      <TableCell>{toLocaleDateTime(item.createOn)}</TableCell>
                      <TableCell>{bank ? bank.name : ''}</TableCell>
                      <TableCell>{merchant ? merchant.name : ''}</TableCell>
                      <TableCell>
                        {reasonMapping[item.reason] || item.reason}{' '}
                      </TableCell>
                      <TableCell
                        onClick={() => handleRedirect(item.tranUid)}
                        style={{
                          cursor: 'pointer',
                          color: '#7474e3'
                        }}
                      >
                        {item.tranId}
                      </TableCell>
                      <TableCell>{item.fieldName}</TableCell>
                      <TableCell>{item.reference}</TableCell>
                      <TableCell>{item.originalField}</TableCell>
                      <TableCell>{item.reportField}</TableCell>
                      <TableCell>
                        {item.resolved ? (
                          'Да'
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleOpenDialogConfirm}
                          >
                            {t('fixed')}
                          </Button>
                        )}
                        <ConfirmationDialog
                          open={openDialogConfirm}
                          onClose={handleCloseDialog}
                          onConfirm={() => handleConfirm(item.id)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableStatic>
              <TablePagination
                component="div"
                count={totalRows}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 25, 50, 100]}
              />
            </Card>
          </Box>
          <FilterDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            banks={banks}
            merchants={merchants}
            statuses={statuses}
            types={types}
            dialogType={dialogType}
            page={page}
            count={rowsPerPage}
            onFilterResults={handleFilterResults}
          />
        </Container>
      </Box>
    </>
  );
};

export default ReconciliationPage1;
