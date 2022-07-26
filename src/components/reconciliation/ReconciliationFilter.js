import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  MenuItem,
  FormHelperText,
  TextField,
  Grid,
  Button,
} from '@material-ui/core';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import axios from '@lib/axios';
import { app } from '@root/config';
import toast from 'react-hot-toast';
import useAuth from '@hooks/useAuth';
//import UploadFilesInput from './coponents/UploadFilesInput';

const TransactionFilter = (props) => {
  const { t } = useTranslation();
  const { callback, update } = props;
  const [banksList, setBanksList] = useState([]);
  const [file, setFile] = useState(true);
  const { getAccess } = useAuth();

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
    <Formik
      initialValues={{
        bankId: '',
        bankName: '',
      }}
      validationSchema={Yup.object().shape({
        bankId: Yup.string().max(255),
        bankName: Yup.string().max(255),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        const bankName = values.bankName.toLowerCase().replace(/\d/gi, '');
        // if (values.bankName !== 'Pumb') {
        //   const formData = new FormData();
        //   formData.append('bankId', values.bankId);
        //   formData.append('file', values.file, values.file.name);
        //   await axios
        //     .post(`${app.api}/reconciliation/file`, formData)
        //     .then((response) => {
        //       setFile(true);
        //       update(response.data);
        //       toast.success(t('Success upload'));
        //     })
        //     .catch((e) => {
        //       setFile(true);
        //       toast.error(e.response.data.message);
        //     });
        // } else {
        await axios
          .post(`${app.api}/reconciliation/${bankName}`)
          .then((response) => {
            setFile(true);
            toast.success(t('Request success send'));
          })
          .catch((e) => {
            setFile(true);
            toast.error(e.response.data.message || 'Some error occurred');
          });
        // }
      }}
    >
      {({
        errors,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit} {...props}>
          <Box m={2}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  error={Boolean(touched.bankId && errors.bankId)}
                  fullWidth
                  select
                  helperText={touched.bankId && errors.bankId}
                  label={t('bankId')}
                  margin="normal"
                  name="bankId"
                  onBlur={handleBlur}
                  onChange={(e, elem) => {
                    setFieldValue('bankId', e.target.value);
                    setFieldValue('bankName', elem.props.children);
                    callback(e.target.value);
                  }}
                  value={values.bankId}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ m: 0 }}
                >
                  <MenuItem key={-1} value={''}>
                    {t('Select value')}
                  </MenuItem>
                  {banksList.map((item) => (
                    <MenuItem
                      key={item.id}
                      value={item.id}
                      data-name={item.name}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* {values.bankId !== '' &&
              values.bankName !== 'Pumb' &&
              getAccess('reconciliation', 'upload') ? (
                <UploadFilesInput
                  file={file}
                  setFieldValue={setFieldValue}
                  handleSubmit={handleSubmit}
                  setFile={setFile}
                />
              ) : null} */}

              {values.bankId !== '' &&
              // values.bankName === 'Pumb' &&
              getAccess('reconciliation', 'upload') ? (
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    type="submit"
                    //disabled={isSubmitting}
                  >
                    {t('Upload file')}
                  </Button>
                </Grid>
              ) : null}
            </Grid>
          </Box>

          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
        </form>
      )}
    </Formik>
  );
};

export default TransactionFilter;
