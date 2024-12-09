import { SelectCheckbox, SelectCheckboxCodes } from '@comp/core/forms';
import useMounted from '@hooks/useMounted';
import axios from '@lib/axios';
import { getCurrentDate, toLocaleDateTime } from '@lib/date';
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormHelperText,
  Grid,
  MenuItem,
  TextField
} from '@material-ui/core';
import { app } from '@root/config';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
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
        dateStart: getCurrentDate(),
        dateEnd: getCurrentDate(),
        merchantId: [],
        respCodeId: [],
        bankId: [],
        amountFrom: '',
        amountTo: '',
        tranId: [],
        panMask: [],
        panHash: [],
        rrn: [],
        ip: []
      }}
      validationSchema={Yup.object().shape({
        dateEnd: Yup.string().required(t('required'))
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        const { reportType, ...restValues } = values;
        try {
          await props.callback(reportType, {
            ...restValues,
            dateStart: toLocaleDateTime(restValues.dateStart),
            dateEnd: toLocaleDateTime(restValues.dateEnd)
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
      }) => {
        return (
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

                {values.reportType === 'aml' && (
                  <>
                    <Grid item xs={3}>
                      <TextField
                        error={Boolean(touched.amountFrom && errors.amountFrom)}
                        fullWidth
                        helperText={touched.amountFrom && errors.amountFrom}
                        label={t('amountFrom')}
                        margin="normal"
                        name="amountFrom"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="number"
                        value={values.amountFrom}
                        variant="outlined"
                        size="small"
                        sx={{ m: 0 }}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField
                        error={Boolean(touched.amountTo && errors.amountTo)}
                        fullWidth
                        helperText={touched.amountTo && errors.amountTo}
                        label={t('amountTo')}
                        margin="normal"
                        name="amountTo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="number"
                        value={values.amountTo}
                        variant="outlined"
                        size="small"
                        sx={{ m: 0 }}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        onChange={(event, value) => {
                          setFieldValue('tranId', value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label={t('tranId')}
                            size="small"
                          />
                        )}
                        value={values.tranId || []}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        onChange={(event, value) => {
                          setFieldValue('panMask', value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label={t('panMask')}
                            size="small"
                          />
                        )}
                        value={values.panMask || []}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        onChange={(event, value) => {
                          setFieldValue('panHash', value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label={t('panHash')}
                            size="small"
                          />
                        )}
                        value={values.panHash || []}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        onChange={(event, value) => {
                          setFieldValue('rrn', value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label={t('RNN')}
                            size="small"
                          />
                        )}
                        value={values.rrn || []}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        onChange={(event, value) => {
                          setFieldValue('ip', value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label={t('IP')}
                            size="small"
                          />
                        )}
                        value={values.ip || []}
                      />
                    </Grid>
                  </>
                )}

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
        );
      }}
    </Formik>
  );
};

export default ExportFileFilter;
