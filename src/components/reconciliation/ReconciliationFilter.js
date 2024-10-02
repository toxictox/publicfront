import useAuth from '@hooks/useAuth';
import axios from '@lib/axios';
import { Box, Button, Grid } from '@material-ui/core';
import { app } from '@root/config';
import { getLocalFormValues } from '@utils/localFormValues';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import UploadFilesInput from './coponents/UploadFilesInput';
import FilterDialog from './coponents/filterDialog';


const TransactionFilter = (props) => {
  const { t } = useTranslation();
  const { callback, update } = props;
  const [banksList, setBanksList] = useState([]);
  const [file, setFile] = useState(true);
  const { getAccess } = useAuth();
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  useEffect(() => {
    if (getLocalFormValues('reconcilation')) {
      callback(getLocalFormValues('reconcilation').bankId);
    }
  }, []);

  useEffect(() => {
    const getData = async () => {
      await axios
        .get(`${app.api}/filter/banks`)
        .then((response) => {
          setBanksList(response.data.data);
        })
        .catch((e) => {
          console.error(e);
        });
    };
    getData();
  }, []);

  return (
    <>
      <Box m={2}>
        <Grid container spacing={3}>
          <Grid item>
            <Button
              onClick={() => setOpenFilterDialog(true)}
              variant="contained"
            >
              Фильтр
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained">Скачать CSV</Button>
          </Grid>
          {getAccess('reconciliation', 'upload') && (
            <Grid item>
              <UploadFilesInput file={file} setFile={setFile} />
            </Grid>
          )}
        </Grid>
      </Box>
      <FilterDialog
        open={openFilterDialog}
        onClose={() => setOpenFilterDialog(false)}
        banksList={banksList}
      />
    </>
  );
};

export default TransactionFilter;
