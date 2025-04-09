import { GroupTable } from '@comp/core/buttons';
import { TableStatic } from '@comp/core/tables';
import useAuth from '@hooks/useAuth';
import { toLocaleDateTime } from '@lib/date';
import {
  Divider,
  TableCell,
  TablePagination,
  TableRow
} from '@material-ui/core';
import { showConfirm } from '@slices/dialog';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { deleteMaintenance } from './helper';

const TableComponent = ({
  data,
  page,
  count,
  onPageChange,
  onRowsPerPageChange,
  onDataUpdate
}) => {
  const navigate = useNavigate();
  const { getAccess } = useAuth();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleDelete = async (id) => {
    try {
      await deleteMaintenance(id);
      const updatedItems = data.items.filter((item) => item.id !== id);
      onDataUpdate({ ...data, items: updatedItems });
      toast.success(t('Success'));
    } catch (error) {
      toast.error(`${t('Error!')}`);
    }
  };

  return (
    <>
      <Divider />
      <TableStatic
        header={[
          'ID',
          'merchants',
          'startDate',
          'endDate',
          'Merchants filter',
          'actions'
        ]}
      >
        {data?.items?.map((item) => (
          <TableRow hover key={item.id}>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.merchants.join(', ')}</TableCell>
            <TableCell>{toLocaleDateTime(item.startDate)}</TableCell>
            <TableCell>{toLocaleDateTime(item.endDate)}</TableCell>
            <TableCell>
              {item.filteredByMerchant ? t('enabled') : t('off')}
            </TableCell>
            <TableCell>
              <GroupTable
                actionUpdate={{
                  access: getAccess('maintenance', 'edit'),
                  callback: () =>
                    navigate(`/maintenance/create`, { state: { item } })
                }}
                actionDelete={{
                  access: getAccess('maintenance', 'delete'),
                  callback: () => {
                    dispatch(
                      showConfirm({
                        title: t('Do you want to remove'),
                        isOpen: true,
                        okCallback: () => {
                          handleDelete(item.id);
                        }
                      })
                    );
                  }
                }}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableStatic>

      <TablePagination
        count={data?.items?.length || 0}
        onPageChange={onPageChange}
        page={page}
        rowsPerPage={count}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
      />
    </>
  );
};

export default TableComponent;
