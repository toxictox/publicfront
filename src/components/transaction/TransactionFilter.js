import {
  OrderBySelect,
  SelectCheckbox,
  SelectCheckboxCodes
} from '@comp/core/forms';
import useAuth from '@hooks/useAuth';
import useMounted from '@hooks/useMounted';
import axios from '@lib/axios';
import { GetFilterDataFromStore } from '@lib/filter';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { app } from '@root/config';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

const TransactionFilter = (props) => {
  const mounted = useMounted();
  const { t } = useTranslation();
  const [banks, setBanks] = useState([]);
  const [tranType, setTranType] = useState([]);
  const [respCode, setRespCode] = useState([]);
  const { getAccess, user } = useAuth();
  const [selectedTranId, setSelectedTranId] = useState('');
  useEffect(() => {
    const getData = async () => {
      await axios.get(`${app.api}/filter/banks`).then((response) => {
        setBanks(response.data.data);
      });

      await axios.get(`${app.api}/filter/tran_types`).then((response) => {
        setTranType(response.data);
      });

      await axios.get(`${app.api}/filter/codes`).then((response) => {
        setRespCode(response.data.data);
      });
    };
    getData();
  }, []);

  const dataForFields =
    GetFilterDataFromStore('transactions') !== undefined
      ? GetFilterDataFromStore('transactions')
      : {
          respCode: [],
          banks: []
        };

  const tranIndex = [
    { label: '-', value: 'clear' },
    { label: 'Qiwi', value: 'qiwi_' },
    { label: 'Kassa 24', value: 'kassa24_' }
  ];

  const handleSelectChange = (event) => {
    setSelectedTranId(event.target.value);
  };

  return (
    <Formik
      initialValues={dataForFields}
      enableReinitialize={true}
      validationSchema={Yup.object().shape({
        tranId: Yup.string().max(255),
        tranTypes: Yup.array(),
        orderId: Yup.string().max(255),
        amountFrom: Yup.string().max(25),
        amountTo: Yup.string().max(25),
        dateFrom: Yup.string().max(255),
        dateTo: Yup.string().max(255),
        gatewayRefNo: Yup.string().max(255),
        banks: Yup.array(),
        pan1: Yup.string().min(6).max(6),
        pan2: Yup.string().min(4).max(4),
        rrn: Yup.string(),
        gatewayRefNo: Yup.string()
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        if (values.tranId && selectedTranId) {
          const originalTranId = values.tranId?.replace(/^.*?_/, '');
          if (selectedTranId === 'clear') {
            values.tranId = values.tranId?.split('_')?.slice(1)?.join('_');
            setSelectedTranId('');
          } else {
            values.tranId = `${selectedTranId}${originalTranId}`;
          }
        }

        try {
          await props.callback({
            ...values
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
        <form noValidate onSubmit={handleSubmit} {...props}>
          <Box m={2}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  autoFocus
                  error={Boolean(touched.dateFrom && errors.dateFrom)}
                  fullWidth
                  helperText={touched.dateFrom && errors.dateFrom}
                  label={t('createOn')}
                  margin="normal"
                  name="dateFrom"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="datetime-local"
                  value={values.dateFrom}
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
                  error={Boolean(touched.dateTo && errors.dateTo)}
                  fullWidth
                  helperText={touched.dateTo && errors.dateTo}
                  label={t('dateEnd')}
                  margin="normal"
                  name="dateTo"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="datetime-local"
                  value={values.dateTo}
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
                  error={Boolean(touched.tranTypes && errors.tranTypes)}
                  labelId="tranTypes"
                  helperText={touched.tranTypes && errors.tranTypes}
                  label={t('tranTypeId')}
                  name="tranTypes"
                  onBlur={handleBlur}
                  value={values.tranTypes !== undefined ? values.tranTypes : []}
                  sx={{ m: 0 }}
                  onChange={(e) => {
                    setFieldValue('tranTypes', e.target.value);
                  }}
                  items={tranType}
                />
              </Grid>

              <Grid item xs={3}>
                <SelectCheckbox
                  error={Boolean(touched.banks && errors.banks)}
                  labelId="banks"
                  helperText={touched.banks && errors.banks}
                  label={t('bankId')}
                  name="banks"
                  onBlur={handleBlur}
                  value={values.banks !== undefined ? values.banks : []}
                  sx={{ m: 0 }}
                  onChange={(e) => {
                    setFieldValue('banks', e.target.value);
                  }}
                  items={banks}
                />
              </Grid>

              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-helper-label">
                    {t('Transaction prefix')}
                  </InputLabel>
                  <Select
                    value={selectedTranId}
                    onChange={handleSelectChange}
                    onBlur={handleBlur}
                    label={t('Transaction prefix')}
                    labelId="demo-simple-select-helper-label"
                  >
                    {tranIndex.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.tranIdPrefix && errors.tranIdPrefix && (
                    <FormHelperText>{errors.tranIdPrefix}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={3}>
                <TextField
                  error={Boolean(touched.tranId && errors.tranId)}
                  fullWidth
                  helperText={touched.tranId && errors.tranId}
                  label={t('tranId')}
                  margin="normal"
                  name="tranId"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.tranId}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title={t('infoTranid')}>
                          <InfoIcon />
                        </Tooltip>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={3}>
                <SelectCheckboxCodes
                  error={Boolean(touched.respCode && errors.respCode)}
                  labelId="respCode"
                  helperText={touched.respCode && errors.respCode}
                  label={t('respCode')}
                  name="respCode"
                  onBlur={handleBlur}
                  value={values.respCode !== undefined ? values.respCode : []}
                  sx={{ m: 0 }}
                  onChange={(data) => {
                    setFieldValue('respCode', data);
                  }}
                  fieldText={['external', 'langEn']}
                  items={respCode}
                />
              </Grid>

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
                  type="text"
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
                  type="text"
                  value={values.amountTo}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  error={Boolean(touched.pan1 && errors.pan1)}
                  fullWidth
                  helperText={touched.pan1 && errors.pan1}
                  label={t('card first 6 number')}
                  margin="normal"
                  name="pan1"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.pan1}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  error={Boolean(touched.pan2 && errors.pan2)}
                  fullWidth
                  helperText={touched.pan2 && errors.pan2}
                  label={t('card last 4 number')}
                  margin="normal"
                  name="pan2"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.pan2}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  error={Boolean(touched.orderId && errors.orderId)}
                  fullWidth
                  helperText={touched.orderId && errors.orderId}
                  label={t('orderId')}
                  margin="normal"
                  name="orderId"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.orderId}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  error={Boolean(touched.rrn && errors.rrn)}
                  fullWidth
                  helperText={touched.rrn && errors.rrn}
                  label={t('rrn')}
                  margin="normal"
                  name="rrn"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.rrn}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              {getAccess('transactions', 'viewExtraInfo') && (
                <Grid item xs={3}>
                  <TextField
                    error={Boolean(touched.gatewayRefNo && errors.gatewayRefNo)}
                    fullWidth
                    helperText={touched.gatewayRefNo && errors.gatewayRefNo}
                    label={t('gatewayRefNo')}
                    margin="normal"
                    name="gatewayRefNo"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={values.gatewayRefNo}
                    variant="outlined"
                    size="small"
                    sx={{ m: 0 }}
                  />
                </Grid>
              )}

              <OrderBySelect
                touched={touched}
                handleBlur={handleBlur}
                handleChange={handleChange}
                errors={errors}
                values={values}
              />

              {getAccess('transactions', 'viewExtraInfo') && (
                <>
                  <Grid item xs={3}>
                    <TextField
                      error={Boolean(touched.email && errors.email)}
                      fullWidth
                      helperText={touched.email && errors.email}
                      label={'email'}
                      margin="normal"
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.email}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0 }}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <TextField
                      error={Boolean(touched.city && errors.city)}
                      fullWidth
                      helperText={touched.city && errors.city}
                      label={t('city')}
                      margin="normal"
                      name="city"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.city}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0 }}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <TextField
                      error={Boolean(touched.country && errors.country)}
                      fullWidth
                      helperText={touched.country && errors.country}
                      label={t('country')}
                      margin="normal"
                      name="country"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.country}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0 }}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <TextField
                      error={Boolean(touched.cardHash && errors.cardHash)}
                      fullWidth
                      helperText={touched.cardHash && errors.cardHash}
                      label={t('cardHash')}
                      margin="normal"
                      name="cardHash"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.cardHash}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0 }}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <TextField
                      error={Boolean(touched.ip && errors.ip)}
                      fullWidth
                      helperText={touched.ip && errors.ip}
                      label={t('ip')}
                      margin="normal"
                      name="ip"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.ip}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0 }}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <TextField
                      error={Boolean(touched.customerId && errors.customerId)}
                      fullWidth
                      helperText={touched.customerId && errors.customerId}
                      label={t('customerId')}
                      margin="normal"
                      name="customerId"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.customerId}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0 }}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <TextField
                      error={Boolean(touched.holder && errors.holder)}
                      fullWidth
                      helperText={touched.holder && errors.holder}
                      label={t('holder')}
                      margin="normal"
                      name="holder"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.holder}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0 }}
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
                    {t('Search button')}
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

export default TransactionFilter;
