import { TableStatic } from '@comp/core/tables';
import { getMomentDate } from '@lib/date';
import { Box, Button, TableCell, TableRow } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getStatementDownload } from './helper';

const StatementTableMerchant = ({ data, accountId, merchantId }) => {
  const { t } = useTranslation();

  const downloadFile = async (idStatement) => {
    try {
      await getStatementDownload(merchantId, accountId, idStatement);
    } catch (error) {
      console.log('Error!');
    }
  };
  return (
    <Box>
      <TableStatic header={['id', 'status', 'Start Date', 'End Date', '']}>
        {data?.items?.map((item) => (
          <TableRow hover key={item?.id}>
            <TableCell>{item?.id}</TableCell>
            <TableCell>{item?.status}</TableCell>
            <TableCell>{getMomentDate(item?.startDate)}</TableCell>
            <TableCell>{getMomentDate(item?.endDate)}</TableCell>
            <TableCell>
              {item.status === 'ready' && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => downloadFile(item?.id)}
                >
                  {t('Download statement')}
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableStatic>
    </Box>
  );
};

export default React.memo(StatementTableMerchant);
