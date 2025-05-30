import { Link as RouterLink, useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Link,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core';

import MoreMenu from '@comp/MoreMenu';
import Scrollbar from '@comp/Scrollbar';
import { TableStatic } from '@comp/core/tables/index';
import { useTranslation } from 'react-i18next';
import TransactionFilter from '@comp/transaction/TransactionFilter';
import TransactionCreateModal from '@comp/transaction/TransactionCreateModal';
import { GroupTable } from '@comp/core/buttons';
import { toLocaleDateTime } from '@lib/date';
import useAuth from '@hooks/useAuth';

const TransactionListTable = (props) => {
  const { data, loading, ...other } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getAccess } = useAuth();

  return (
    <>
      <Card {...other}>
        <CardHeader avatar={<TransactionCreateModal />} action={<MoreMenu />} title={t('Transactions List')} />

        <Divider />
        <TransactionFilter loading={loading} callback={props.callback} />
        <Divider />
        <Scrollbar>
          <Box sx={{ minWidth: false }}>
            <TableStatic
              header={[
                'createOn',
                'merchant',
                'tranId',
                'orderId',
                'clientId',
                'tranType',
                'pan',
                'phoneNumber',
                'amount',
                'fee',
                'gateway',
                'respCode',
                ''
              ]}
            >
              {loading &&
                <CardContent>
                  <Typography>
                    <CircularProgress size={20} />
                    &nbsp;{t('loading')}
                  </Typography>
                </CardContent>
              }
              {data.map((order) => {
                return (
                  <TableRow hover key={order.uuid}>
                    <TableCell className="static-table__table-cell">
                      <Link
                        color="textPrimary"
                        component={RouterLink}
                        to={`/transactions/${order.uuid}`}
                        underline="none"
                        variant="subtitle2"
                      ></Link>
                      <Typography color="textSecondary" variant="body2">
                        {toLocaleDateTime(order.createOn)}
                      </Typography>
                    </TableCell>
                    <TableCell className="static-table__table-cell">
                      {order.merchant}
                    </TableCell>
                    <TableCell className="static-table__table-cell static-table__table-cell--word-wrap static-table__table-cell-id">
                      {order.tranId}
                    </TableCell>
                    <TableCell className="static-table__table-cell static-table__table-cell--word-wrap static-table__table-cell-id">
                      {order.orderId}
                    </TableCell>
                    <TableCell className="static-table__table-cell static-table__table-cell--word-wrap static-table__table-cell-id">
                      {order.client}
                    </TableCell>
                    <TableCell className="static-table__table-cell">
                      <Typography
                        color="textPrimary"
                        variant="subtitle2"
                        align={'center'}
                      >
                        {order.tranType}
                      </Typography>
                    </TableCell>
                    <TableCell className="static-table__table-cell">
                      {order.pan}
                    </TableCell>
                      <TableCell className="static-table__table-cell">
                       {order.phoneNumber}
                      </TableCell>
                    <TableCell className="static-table__table-cell">
                      {order.amount}
                    </TableCell>
                    <TableCell className="static-table__table-cell">
                      {order.fee}
                    </TableCell>
                    <TableCell className="static-table__table-cell">
                      {order.gateway}
                    </TableCell>
                    <TableCell
                      sx={{ color: order.respCodeColor }}
                      className="static-table__table-cell"
                    >
                      {order.respCode} {order.respMessage}
                    </TableCell>

                    <TableCell
                      align="right"
                      className="static-table__table-cell"
                    >
                      {getAccess('transactions', 'details') ? (
                        <GroupTable
                          actionView={() =>
                            navigate(`/transactions/${order.uuid}`)
                          }
                        />
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableStatic>
          </Box>
        </Scrollbar>
      </Card>
    </>
  );
};

TransactionListTable.propTypes = {
  data: PropTypes.array.isRequired
};

export default TransactionListTable;
