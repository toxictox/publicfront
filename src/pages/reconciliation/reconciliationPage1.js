import FilterDialog from '@comp/reconciliation/coponents/filterDialog';
import { getFile } from '@comp/reconciliation/helper';
import useSettings from '@hooks/useSettings';
import { Box, Button, Container } from '@material-ui/core';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getBanks,
  getMerchants,
  getResults,
  getResults2,
  getStatuses,
  getTypes,
  resolved
} from './helper';
import ReconciliationTable1 from './ReconciliationTable1';
import ReconciliationTable2 from './reconciliationTable2';

const ReconciliationPage1 = ({ pageNumber }) => {
  const { settings } = useSettings();
  const [reportData, setReportData] = useState([]);
  const [reportData2, setReportData2] = useState([]);
  const [banks, setBanks] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [filterData, setFilterData] = useState();

  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(5);
  const [totalRows2, setTotalRows2] = useState(0);
  const redirectId = localStorage.getItem('redirectId');

  const reasonMapping = {
    nonExistent: 'Отсутствует в ПО',
    missing: 'Отсутствует в отчете',
    amount: 'Сумма',
    resp_code: 'Статус (код)',
    duplicate: 'Дубликат'
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
          typesResult,
          results2
        ] = await Promise.all([
          getResults(page + 1, rowsPerPage, redirectId),
          getBanks(),
          getMerchants(),
          getStatuses(),
          getTypes(),
          getResults2(page2 + 1, rowsPerPage2)
        ]);

        if (isMounted) {
          setReportData(reportResults);
          setReportData2(results2);
          setBanks(bankResults);
          setMerchants(merchantResults);
          setStatuses(statusesResults);
          setTypes(typesResult);
          setTotalRows(reportResults?.count || 0);
          setTotalRows2(results2?.count || 0);
        }
      } catch (error) {
        if (isMounted) {
          console.log(error);
          setTotalRows(0);
          setTotalRows2(0);
        }
      }
    };

    fetchAllData();
    return () => {
      isMounted = false;
    };
  }, [page, rowsPerPage, page2, rowsPerPage2]);

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

  const handleRedirect = (tranId) => {
    window.open(`/transactions/${tranId}`, '_blank');
  };

  const handleOpenFilterDialog = () => {
    setDialogType('filter');
    setOpenDialog(true);
  };
  const filterDialogClose = () => {
    localStorage.removeItem('redirectId');
    setOpenDialog(false);
  };

  const handleFilterResults = (results) => {
    setReportData(results);
  };

  const handleFilterResults2 = (results) => {
    setReportData2(results);
  };

  const downloadFile = async () => {
    try {
      const response = await getFile(
        filterData.resolved,
        filterData.startDate,
        filterData.endDate,
        filterData.merchants,
        filterData.bankId,
        filterData.statuses,
        filterData.jobs
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange2 = useCallback((event, newPage) => {
    setPage2(newPage);
  }, []);

  const handleRowsPerPageChange2 = useCallback((event) => {
    setRowsPerPage2(parseInt(event.target.value, 10));
    setPage2(0);
  }, []);

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
            sx={{ marginBottom: '20px', marginRight: '20px' }}
            onClick={handleOpenFilterDialog}
          >
            {t('Filter')}
          </Button>

          {filterData && pageNumber === 'one' && (
            <Button
              onClick={downloadFile}
              variant="contained"
              sx={{ marginBottom: '20px' }}
            >
              {t('Download File')}
            </Button>
          )}

          {pageNumber === 'one' && (
            <ReconciliationTable1
              reportData={reportData}
              banks={banks}
              merchants={merchants}
              reasonMapping={reasonMapping}
              totalRows={totalRows}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onResolve={handleResolve}
              onRedirect={handleRedirect}
            />
          )}

          {pageNumber === 'two' && (
            <ReconciliationTable2
              reportData={reportData2}
              banks={banks}
              merchants={merchants}
              reasonMapping={reasonMapping}
              totalRows={totalRows2}
              rowsPerPage={rowsPerPage2}
              page={page2}
              onPageChange={handlePageChange2}
              onRowsPerPageChange={handleRowsPerPageChange2}
              onResolve={handleResolve}
              onRedirect={handleRedirect}
            />
          )}

          <FilterDialog
            open={openDialog}
            onClose={() => filterDialogClose()}
            banks={banks}
            merchants={merchants}
            statuses={statuses}
            types={types}
            dialogType={dialogType}
            page={page}
            count={rowsPerPage}
            onFilterResults={
              pageNumber === 'one' ? handleFilterResults : handleFilterResults2
            }
            setFilterData={setFilterData}
            pageNumber={pageNumber}
          />
        </Container>
      </Box>
    </>
  );
};

export default ReconciliationPage1;
