import { TableStatic } from '@comp/core/tables';
import { Box, Button, Card, TableCell, TableRow } from '@material-ui/core';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { acceptTransaction } from '../helper';

export const TransactionsTable = ({ transactions, refetch }) => {
  const { t } = useTranslation();

  const sendToBank = async (item) => {
    console.log(item);
    try {
      const response = await acceptTransaction(item.id);
      if (response) {
        toast.success(t('Success'));
        refetch();
      }
    } catch (error) {
      toast.error(t('Error!'));
    }
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
                    <TableCell>
                      {item?.status === 'ready' ? (
                        <Button
                          variant="contained"
                          onClick={() => sendToBank(item)}
                        >
                          {t('Send to Bank')}
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
