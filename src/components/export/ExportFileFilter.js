import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  FormHelperText,
  Divider,
  TextField,
  MenuItem,
  Grid
} from '@material-ui/core';
import useMounted from '@hooks/useMounted';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import axios from '@lib/axios';
import { formatDate } from '@lib/date';
import { app } from '@root/config';
import { SelectCheckbox, SelectCheckboxCodes } from '@comp/core/forms';
import { useReports } from './useReports';

const ExportFileFilter = (props) => {
  const mounted = useMounted();
  const { t } = useTranslation();
  const { availableReports } = useReports();
  const [banks, setBanks] = useState([]);
  const [tranType, setTranType] = useState([]);
  const [merchant, setMerchant] = useState([]);
  const [respCode, setRespCode] = useState([]);

  useEffect(() => {
    const getData = async () => {
      await axios.get(`${app.api}/filter/banks`).then((response) => {
        setBanks(response.data.data);
      });

      await axios.get(`${app.api}/filter/tran_types`).then((response) => {
        setTranType(response.data);
      });

      await axios.get(`${app.api}/filter/merchants`).then((response) => {
        setMerchant(response.data.data);
      });

      await axios.get(`${app.api}/filter/codes`).then((response) => {
        setRespCode(response.data.data);
      });
    };
    getData();
  }, []);

  return (
    <Formik
      initialValues={{
        reportType: 'default',
        tranTypeId: [],
        dateStart: new Date().toISOString().slice(0, 16),
        dateEnd: '',
        merchantId: [],
        respCodeId: [],
        bankId: []
      }}
      validationSchema={Yup.object().shape({
        dateEnd: Yup.string().required(t('required'))
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        const { reportType, ...restValues } = values;

        try {
          await props.callback(reportType, {
            ...restValues,
            dateStart: formatDate(restValues.dateStart),
            dateEnd: formatDate(restValues.dateEnd)
          });

          if (mounted.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }
        } catch (err) {
          if (mounted.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        isSubmitting,
        touched,
        values
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Box m={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.reportType && errors.reportType)}
                  fullWidth
                  helperText={touched.reportType && errors.reportType}
                  label={t('reportType')}
                  margin="normal"
                  name="reportType"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  select
                  value={values.reportType}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                >
                  <MenuItem key={-1} value={''}>
                    {t('Select value')}
                  </MenuItem>
                  {availableReports.map((report) => (
                    <MenuItem key={report} value={report}>
                      {report}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  autoFocus
                  error={Boolean(touched.dateStart && errors.dateStart)}
                  fullWidth
                  helperText={touched.dateStart && errors.dateStart}
                  label={t('createOn')}
                  margin="normal"
                  name="dateStart"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="datetime-local"
                  value={values.dateStart}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true
                  }}
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  autoFocus
                  error={Boolean(touched.dateEnd && errors.dateEnd)}
                  fullWidth
                  helperText={touched.dateEnd && errors.dateEnd}
                  label={t('dateEnd')}
                  margin="normal"
                  name="dateEnd"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="datetime-local"
                  value={values.dateEnd}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true
                  }}
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={3}>
                <SelectCheckbox
                  error={Boolean(touched.tranTypeId && errors.tranTypeId)}
                  labelId="tranTypeId"
                  helperText={touched.tranTypeId && errors.tranTypeId}
                  label={t('tranTypeId')}
                  name="tranTypeId"
                  onBlur={handleBlur}
                  value={values.tranTypeId}
                  sx={{ m: 0 }}
                  onChange={(e) => {
                    setFieldValue('tranTypeId', e.target.value);
                  }}
                  items={tranType}
                />
              </Grid>

              <Grid item xs={3}>
                <SelectCheckbox
                  error={Boolean(touched.merchantId && errors.merchantId)}
                  labelId="merchantId"
                  helperText={touched.merchantId && errors.merchantId}
                  label={t('merchId')}
                  name="merchantId"
                  onBlur={handleBlur}
                  value={values.merchantId}
                  sx={{ m: 0 }}
                  onChange={(e) => {
                    setFieldValue('merchantId', e.target.value);
                  }}
                  items={merchant}
                />
              </Grid>

              <Grid item xs={3}>
                <SelectCheckbox
                  error={Boolean(touched.bankId && errors.bankId)}
                  labelId="bankId"
                  helperText={touched.bankId && errors.bankId}
                  label={t('bankId')}
                  name="bankId"
                  onBlur={handleBlur}
                  value={values.bankId}
                  sx={{ m: 0 }}
                  onChange={(e) => {
                    setFieldValue('bankId', e.target.value);
                  }}
                  items={banks}
                />
              </Grid>

              <Grid item xs={3}>
                <SelectCheckboxCodes
                  error={Boolean(touched.respCode && errors.respCode)}
                  labelId="respCodeId"
                  helperText={touched.respCode && errors.respCode}
                  label={t('respCode')}
                  name="respCodeId"
                  onBlur={handleBlur}
                  value={
                    values.respCodeId !== undefined ? values.respCodeId : []
                  }
                  sx={{ m: 0 }}
                  onChange={(data) => {
                    //setFieldValue('respCode', data);
                    setFieldValue('respCodeId', data);
                  }}
                  fieldText={['external', 'langEn']}
                  items={respCode}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                    size="small"
                  >
                    {t('Create button')}
                  </Button>
                </Box>
              </Grid>
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

export default ExportFileFilter;
