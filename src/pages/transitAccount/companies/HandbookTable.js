import { GroupTable } from '@comp/core/buttons';
import { TableStatic } from '@comp/core/tables';
import useAuth from '@hooks/useAuth';
import { Box, TableCell, TableRow } from '@material-ui/core';
import { showConfirm } from '@slices/dialog';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

export const HandbookTable = ({ fakeCompanies }) => {
  console.log(fakeCompanies, 'fakeCompanies');
  const { t } = useTranslation();
  const { getAccess } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateCompany = (item) => {
    navigate('/transit-account/handbook/form', { state: { item } });
  };

  return (
    <>
      <Box sx={{ minWidth: 700 }}>
        <TableStatic
          header={['id', 'name', 'iin', 'bik', 'bankAccount', 'bankName', '']}
        >
          {fakeCompanies?.map((item, index) => {
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
                              console.log('delete');
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
