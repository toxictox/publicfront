import { TableStatic } from '@comp/core/tables';
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
import {
  getBanks,
  getMerchants,
  getResults,
  getStatuses,
  resolved
} from './helper';
import FilterDialog from '@comp/reconciliation/coponents/filterDialog'

const ReconciliationPage1 = () => {
  const { settings } = useSettings();
  const [reportData, setReportData] = useState([]);
  const [banks, setBanks] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleRedirect = (tranId) => {
    navigate(`/transactions/${tranId}`);
  };
  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      try {
        const [reportResults, bankResults, merchantResults, statusesResults] =
          await Promise.all([
            getResults(page + 1),
            getBanks(),
            getMerchants(),
            getStatuses()
          ]);

        if (isMounted) {
          setReportData(reportResults);
          setBanks(bankResults);
          setMerchants(merchantResults);
          setStatuses(statusesResults);
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
  const handleOpenDialog = () => {
    setOpenDialog(true);
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
            onClick={handleOpenDialog}
          >
            {t('Download File')}
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
                      <TableCell>{item.createOn}</TableCell>

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
                            onClick={() => handleResolve(item.id)}
                          >
                            {t('fixed')}
                          </Button>
                        )}
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
                rowsPerPageOptions={[]}
              />
            </Card>
          </Box>
          <FilterDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            banks={banks}
            merchants={merchants}
            statuses={statuses}
          />
        </Container>
      </Box>
    </>
  );
};

export default ReconciliationPage1;
