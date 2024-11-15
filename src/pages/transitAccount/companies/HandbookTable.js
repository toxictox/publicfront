import { GroupTable } from '@comp/core/buttons';
import { TableStatic } from '@comp/core/tables';
import useAuth from '@hooks/useAuth';
import { Box, TableCell, TableRow } from '@material-ui/core';
import { showConfirm } from '@slices/dialog';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { deleteCompany } from '../helper';

export const HandbookTable = ({ companies, refreshCompanies }) => {
  const { t } = useTranslation();
  const { getAccess } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateCompany = (item) => {
    navigate('/transit-account/handbook/form', { state: { item } });
  };

  const deleteCompanyId = async (item) => {
    try {
      const response = await deleteCompany(item.id);
      toast.success('Delete entry');
      refreshCompanies();
    } catch (error) {
      toast.error(t('Error!'));
    }
  };

  return (
    <>
      <Box sx={{ minWidth: 700 }}>
        <TableStatic
          header={['id', 'name', 'iin', 'bik', 'bankAccount', 'bankName', '']}
        >
          {companies?.map((item, index) => {
            return (
              <TableRow hover key={index}>
                <TableCell>{item?.id}</TableCell>
                <TableCell>{item?.name}</TableCell>
                <TableCell>{item?.iin}</TableCell>
                <TableCell>{item?.bik}</TableCell>
                <TableCell>{item?.bankAccount}</TableCell>
                <TableCell>{item?.bankName}</TableCell>
                <TableCell align="right">
                  <GroupTable
                    actionUpdate={() => updateCompany(item)}
                    actionDelete={{
                      access: getAccess('merchants', 'delete'),
                      callback: () => {
                        dispatch(
                          showConfirm({
                            title: t('Do you want to remove'),
                            isOpen: true,
                            okCallback: () => {
                              deleteCompanyId(item);
                            }
                          })
                        );
                      }
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableStatic>
      </Box>
    </>
  );
};
