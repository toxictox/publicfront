import { toLocaleDateTime } from '@lib/date';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmationDialog from './confirmDialog';
import { Box, Button, Card, CardHeader, Divider, TableCell, TablePagination, TableRow } from '@material-ui/core'
import { TableStatic } from '@comp/core/tables'

const ReconciliationTable1 = ({
  reportData,
  banks,
  merchants,
  reasonMapping,
  totalRows,
  rowsPerPage,
  page,
  onPageChange,
  onRowsPerPageChange,
  onResolve,
  onRedirect
}) => {
  const { t } = useTranslation();
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleOpenDialogConfirm = (id) => {
    setSelectedId(id);
    setOpenDialogConfirm(true);
  };

  const handleCloseDialog = () => {
    setOpenDialogConfirm(false);
  };

  const handleConfirm = () => {
    if (selectedId) {
      onResolve(selectedId);
    }
    handleCloseDialog();
  };

  return (
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
            const bank = banks.data?.find((bank) => bank.id === item.bankId);
            const merchant = merchants.data?.find(
              (merchant) => merchant.id === item.merchantId
            );

            return (
              <TableRow hover key={index}>
                <TableCell>{item.reconciliationId}</TableCell>
                <TableCell>{item.reconciliationJobName}</TableCell>
                <TableCell>{toLocaleDateTime(item.createOn)}</TableCell>
                <TableCell>{bank ? bank.name : ''}</TableCell>
                <TableCell>{merchant ? merchant.name : ''}</TableCell>
                <TableCell>
                  {reasonMapping[item.reason] || item.reason}
                </TableCell>
                <TableCell
                  onClick={() => onRedirect(item.tranUid)}
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
                      onClick={() => handleOpenDialogConfirm(item.id)}
                    >
                      {t('fixed')}
                    </Button>
                  )}
                  <ConfirmationDialog
                    open={openDialogConfirm}
                    onClose={handleCloseDialog}
                    onConfirm={handleConfirm}
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
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 25, 50, 100]}
        />
      </Card>
    </Box>
  );
};

export default ReconciliationTable1;
