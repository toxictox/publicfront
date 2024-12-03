import { TableStatic } from '@comp/core/tables';
import { Link, TableCell, TableRow } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

const ViolationTable = ({ dataList }) => {
  const { t } = useTranslation();
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
      {dataList?.items?.map((item) => (
        <TableRow hover key={item?.id}>
          <TableCell>{item?.createOn || t('Loading...')}</TableCell>
          <TableCell>
            <Link
              component={RouterLink}
              to={`/transactions/${item?.transaction}`}
              underline="none"
              variant="subtitle2"
            >
              {item?.transaction}
            </Link>
          </TableCell>
          <TableCell>{item?.amount || t('Loading...')}</TableCell>
          <TableCell>
            {item?.transaction
              ? `${item?.respCode} ${item?.respMessage}`
              : t('Loading...')}
          </TableCell>
          <TableCell>{item?.tranType || t('Loading...')}</TableCell>
          <TableCell>{item?.merchant || t('Loading...')}</TableCell>
          <TableCell>{item?.client || t('Loading...')}</TableCell>
          <TableCell>{item?.customerEmail || t('Loading...')}</TableCell>
          <TableCell>{item?.pan || t('Loading...')}</TableCell>
          <TableCell>{item?.gateway || t('Loading...')}</TableCell>
          <TableCell>{item?.message}</TableCell>
          <TableCell>
            {item?.isCritical ? t('Blocking') : t('Alert only')}
          </TableCell>
        </TableRow>
      ))}
    </TableStatic>
  );
};

export default ViolationTable;
