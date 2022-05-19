import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Grid,
  MenuItem,
} from '@material-ui/core';
import useMounted from '@hooks/useMounted';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import axios from '@lib/axios';
import { app } from '@root/config';
import { fields } from '@lib/validate';

const CreateForm = (props) => {
  const mounted = useMounted();
  const { callback } = props;
  const [timezoneData, setTimezoneData] = useState([]);
  const [cityTerminal, setCityTerminal] = useState([]);
  const [cityMerchant, setCityMerchant] = useState([]);
  const [designId, setDesignId] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const getData = async () => {
      await axios.get(`${app.api}/timezone`).then((response) => {
        setTimezoneData(response.data.data);
      });

      await axios.get(`${app.api}/filter/city/terminals`).then((response) => {
        setCityTerminal(response.data.data);
      });

      await axios.get(`${app.api}/filter/city/merchants`).then((response) => {
        setCityMerchant(response.data.data);
      });

      await axios.get(`${app.api}/filter/designs`).then((res) => {
        setDesignId(res.data.data);
      });
    };
    getData();
  }, []);
  return (
    <Formik
      initialValues={{
        name: '',
        description: '',
        timezoneId: '',
        percentFee: '',
        minAmountFee: '',
        cityTerminalId: '',
        cityMerchantId: '',
        fixAmountFee: 0,
        businessName: '',
        contractNumber: '',
        contractDate: '',
        design: '',
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255).required(t('required')),
        description: Yup.string().max(255),
        fixAmountFee: Yup.string(),
        businessName: Yup.string(),
        contractNumber: Yup.string(),
        contractDate: Yup.string(),
        percentFee: Yup.string().matches(fields.decimal, t('field float')),
        minAmountFee: Yup.number().typeError(t('field number')),
        timezoneId: Yup.string().max(255).required(t('required')),
        design: Yup.number().max(2).required(t('required')),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await callback(values);

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
        isSubmitting,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit} {...props}>
          <Box m={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  error={Boolean(touched.name && errors.name)}
                  fullWidth
                  helperText={touched.name && errors.name}
                  label={t('name')}
                  margin="normal"
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.name}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.description && errors.description)}
                  fullWidth
                  helperText={touched.description && errors.description}
                  label={t('description')}
                  margin="normal"
                  name="description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.description}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.businessName && errors.businessName)}
                  fullWidth
                  helperText={touched.businessName && errors.businessName}
                  label={t('businessName')}
                  margin="normal"
                  name="businessName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.businessName}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={Boolean(
                    touched.contractNumber && errors.contractNumber
                  )}
                  fullWidth
                  helperText={touched.contractNumber && errors.contractNumber}
                  label={t('contractNumber')}
                  margin="normal"
                  name="contractNumber"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.contractNumber}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.contractDate && errors.contractDate)}
                  fullWidth
                  helperText={touched.contractDate && errors.contractDate}
                  label={t('contractDate')}
                  margin="normal"
                  name="contractDate"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="datetime-local"
                  value={values.contractDate}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.fixAmountFee && errors.fixAmountFee)}
                  fullWidth
                  helperText={touched.fixAmountFee && errors.fixAmountFee}
                  label={t('fixAmountFee')}
                  margin="normal"
                  name="fixAmountFee"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.fixAmountFee}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.percentFee && errors.percentFee)}
                  fullWidth
                  helperText={touched.percentFee && errors.percentFee}
                  label={t('percentFee')}
                  margin="normal"
                  name="percentFee"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.percentFee}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.minAmountFee && errors.minAmountFee)}
                  fullWidth
                  helperText={touched.minAmountFee && errors.minAmountFee}
                  label={t('minAmountFee')}
                  margin="normal"
                  name="minAmountFee"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.minAmountFee}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(
                    touched.cityTerminalId && errors.cityTerminalId
                  )}
                  fullWidth
                  helperText={touched.cityTerminalId && errors.cityTerminalId}
                  label={t('cityTerminalId')}
                  margin="normal"
                  name="cityTerminalId"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  select
                  value={values.cityTerminalId}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                >
                  <MenuItem key={-1} value={''}>
                    {t('Select value')}
                  </MenuItem>
                  {cityTerminal.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(
                    touched.cityMerchantId && errors.cityMerchantId
                  )}
                  fullWidth
                  helperText={touched.cityMerchantId && errors.cityMerchantId}
                  label={t('cityMerchantId')}
                  margin="normal"
                  name="cityMerchantId"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  select
                  value={values.cityMerchantId}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                >
                  <MenuItem key={-1} value={''}>
                    {t('Select value')}
                  </MenuItem>
                  {cityMerchant.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.timezoneId && errors.timezoneId)}
                  fullWidth
                  helperText={touched.timezoneId && errors.timezoneId}
                  label={t('timezoneId')}
                  margin="normal"
                  name="timezoneId"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  select
                  value={values.timezoneId}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                >
                  <MenuItem key={-1} value={''}>
                    {t('Select value')}
                  </MenuItem>
                  {timezoneData.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.design && errors.design)}
                  fullWidth
                  helperText={touched.design && errors.design}
                  label={t('design')}
                  margin="normal"
                  name="design"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  select
                  value={values.design}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                >
                  <MenuItem key={-1} value={''}>
                    {t('Select value')}
                  </MenuItem>
                  {designId.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                    size="large"
                  >
                    {t('Update button')}
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

export default CreateForm;
