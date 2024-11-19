import { TableStatic } from '@comp/core/tables';
import { Box, Button, Card, TableCell, TableRow } from '@material-ui/core';
import { showConfirm } from '@slices/dialog';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { acceptTransaction, getTransactionStatus } from '../helper';

export const TransactionsTable = ({ transactions, refetch, setLoading }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const sendToBank = async (item) => {
    dispatch(
      showConfirm({
        title: t('Do you confirm the action?'),
        isOpen: true,
        okCallback: async () => {
          setLoading(true);
          try {
            const response = await acceptTransaction(item.id);
            if (response) {
              toast.success(t('Success'));
              refetch();
            }
          } catch (error) {
            toast.error(t('Error!'));
          } finally {
            setLoading(false);
          }
        }
      })
    );
  };

  const refreshStatus = async (id) => {
    dispatch(
      showConfirm({
        title: t('Do you confirm the action?'),
        isOpen: true,
        okCallback: async () => {
          setLoading(true);
          try {
            await getTransactionStatus(id);
            toast.success(t('updateStatus'));
            refetch();
          } catch (error) {
            toast.error(t('Error!'));
          } finally {
            setLoading(false);
          }
        }
      })
    );
  };

  return (
    <>
      <Box sx={{ marginTop: '20px' }}>
        <Card>
          {transactions?.items?.length > 0 && (
            <>
              <TableStatic
                header={[
                  'id',
                  'account',
                  'amount',
                  'targetAccount',
                  'iin',
                  'narrative',
                  'code',
                  'knp',
                  'status',
                  'statusName',
                  'bik',
                  'createOn',
                  'editOn',
                  ''
                ]}
              >
                {transactions?.items?.map((item, index) => (
                  <TableRow hover key={index}>
                    <TableCell>{item?.id}</TableCell>
                    <TableCell>{item?.account}</TableCell>
                    <TableCell>{item?.amount}</TableCell>
                    <TableCell>{item?.targetAccount}</TableCell>
                    <TableCell>{item?.iin}</TableCell>
                    <TableCell>{item?.narrative}</TableCell>
                    <TableCell>{item?.code}</TableCell>
                    <TableCell>{item?.knp}</TableCell>
                    <TableCell>{item?.status}</TableCell>
                    <TableCell>{item?.statusName}</TableCell>
                    <TableCell>{item?.bik}</TableCell>
                    <TableCell>{item?.createdAt}</TableCell>
                    <TableCell>{item?.updatedAt}</TableCell>
                    <TableCell>
                      {item?.status === 'ready' ? (
                        <Button
                          variant="contained"
                          onClick={() => sendToBank(item)}
                        >
                          {t('Send to Bank')}
                        </Button>
                      ) : null}

                      {item?.status !== 'new' && item?.status !== 'ready' ? (
                        <Button
                          variant="outlined"
                          onClick={() => refreshStatus(item.id)}
                        >
                          {t('Update Status')}
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableStatic>
            </>
          )}
        </Card>
      </Box>
    </>
  );
};
