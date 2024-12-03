import { TableStatic } from '@comp/core/tables';
import { Link, TableCell, TableRow } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

const ViolationTable = ({
  dataList,
  transactionList,
  transactionCountList,
  getTransactionsListQuery,
  t
}) => {
  return (
    <TableStatic
      header={[
        'createOn',
        'transaction',
        'amount',
        'respCode',
        'tranType',
        'merchant',
        'clientId',
        'customerEmail',
        'pan',
        'gateway',
        'message',
        'critical',
        ''
      ]}
    >
      {dataList.items.map((item) => (
        <TableRow hover key={item.id}>
          <TableCell>
            {transactionList[item.transaction]?.createOn || t('Loading...')}
          </TableCell>
          <TableCell>
            <Link
              component={RouterLink}
              to={`/transactions/${item.transaction}`}
              underline="none"
              variant="subtitle2"
            >
              {item.transaction}
            </Link>
          </TableCell>
          <TableCell>
            {transactionList[item.transaction]?.amount || t('Loading...')}
          </TableCell>
          <TableCell>
            {transactionList[item.transaction]
              ? `${transactionList[item.transaction].respCode} ${
                  transactionList[item.transaction].respMessage
                }`
              : t('Loading...')}
          </TableCell>
          <TableCell>
            {transactionList[item.transaction]?.tranType || t('Loading...')}
          </TableCell>
          <TableCell>
            {transactionList[item.transaction]?.merchant || t('Loading...')}
          </TableCell>
          <TableCell>
            {transactionList[item.transaction]?.client || t('Loading...')}
          </TableCell>
          <TableCell>
            {transactionList[item.transaction]?.customerEmail ||
              t('Loading...')}
          </TableCell>
          <TableCell>
            {transactionList[item.transaction]?.pan || t('Loading...')}
          </TableCell>
          <TableCell>
            {transactionList[item.transaction]?.gateway || t('Loading...')}
          </TableCell>
          <TableCell>{item.message}</TableCell>
          <TableCell>
            {item.isCritical ? t('Blocking') : t('Alert only')}
          </TableCell>
          <TableCell>
            {transactionCountList[item.transaction] ? (
              <Link
                component={RouterLink}
                to={`/transactions?${getTransactionsListQuery(
                  transactionList[item.transaction]
                )}`}
                underline="none"
                variant="subtitle2"
              >
                {transactionCountList[item.transaction]}
              </Link>
            ) : (
              t('Loading...')
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableStatic>
  );
};

export default ViolationTable;
