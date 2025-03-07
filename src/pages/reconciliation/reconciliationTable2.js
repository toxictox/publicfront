import { TableStatic } from '@comp/core/tables';
import { toLocaleDateTime } from '@lib/date';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  TableCell,
  TablePagination,
  TableRow
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { getFileReconciliation, getReconciliationTransactionFile } from './helper';

const ReconciliationTable2 = ({
  reportData,
  banks,
  merchants,
  totalRows,
  rowsPerPage,
  page,
  onPageChange,
  onRowsPerPageChange,
  onRedirect
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const redirectUrl = (id) => {
    navigate(`/reconciliation/results/${id}`);
  };

  const downloadFile = async (id) => {
    try {
      const response = await getFileReconciliation(id);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadReconciliationTransactionFile = async (id) => {
    try {
      const response = await getReconciliationTransactionFile(id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ minWidth: 700 }}>
      <Card>
        <CardHeader title={t('Reconciliation menu')} />
        <Divider />
        <TableStatic
          header={[
            'ID',
            'reconciliationJobName',
            'bankId',
            'status',
            'merchantId',
            'createOn',
            'description',
            'reconciliationResult'
          ]}
        >
          {reportData.items?.map((item, index) => {
            const bank = banks.data?.find((bank) => bank.id === item.bankId);
            const merchant = merchants.data?.find(
              (merchant) => merchant.id === item.merchantId
            );
            return (
              <TableRow hover key={index}>
                <TableCell>{item?.id}</TableCell>
                <TableCell>{item?.name}</TableCell>
                <TableCell>{bank ? bank?.name : ''}</TableCell>
                <TableCell>{t(item?.status)}</TableCell>
                <TableCell>{merchant ? merchant?.name : ''}</TableCell>
                <TableCell>{toLocaleDateTime(item?.createOn)}</TableCell>
                <TableCell>
                  <div>
                    <strong>{t('Transactions Sum')}:</strong>{' '}
                    <b>{item.params?.totalAmountTransaction}</b>
                    <br />
                    <strong>{t('Total Amount Report')}:</strong>{' '}
                    <b>{item.params?.totalAmountReport}</b>
                    <br />
                    <strong>{t('Number of report lines')}:</strong>{' '}
                    <b>{item.params?.totalReportRowsCount}</b>
                    <br />
                    <strong
                      style={{
                        color:
                          item?.params?.totalAffectedRowsCount > 0
                            ? 'red'
                            : 'inherit',
                        fontWeight:
                          item?.params?.totalAffectedRowsCount > 0
                            ? 'bold'
                            : 'normal'
                      }}
                    >
                      {t('Number of rows affected')}:
                    </strong>{' '}
                    <b>{item?.params?.totalAffectedRowsCount}</b>
                    <br />
                    <strong>{t('Total number of rows processed')}:</strong>{' '}
                    <b>{item?.params?.totalProcessedRowsCount}</b>
                    <br />
                    <strong>{t('frequency')}:</strong>{' '}
                    {toLocaleDateTime(item?.params?.startDate)} -{' '}
                    {toLocaleDateTime(item?.params?.endDate)}
                    <br />
                  </div>
                </TableCell>
                <TableCell>
                  {item?.params?.totalAffectedRowsCount > 0 &&
                    item?.status === 'processed' && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => downloadFile(item.id)}
                      >
                        {t('Download File')}
                      </Button>
                    )}

                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => downloadReconciliationTransactionFile(item.id)}
                  >
                    {t('Download Reconciliation Transactions Report')}
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ marginLeft: '10px' }}
                    size="small"
                    onClick={() => redirectUrl(item?.id)}
                  >
                    {t('View results')}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableStatic>
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 25, 50, 100]}
        />
      </Card>
    </Box>
  );
};

export default ReconciliationTable2;
