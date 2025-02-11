import { TableStatic } from '@comp/core/tables';
import { Box, Button, TableCell, TableRow } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { getStatementDownload } from '../helper';

const StatementTable = ({ data }) => {
  const { t } = useTranslation();
  const { id } = useParams();

  const downloadFile = async (idStatement) => {
    try {
      await getStatementDownload(id, idStatement);
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
            <TableCell>{item?.startDate}</TableCell>
            <TableCell>{item?.endDate}</TableCell>
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

export default React.memo(StatementTable);
