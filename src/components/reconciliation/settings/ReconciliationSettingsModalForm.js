import React, { useState } from 'react';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import { Formik } from 'formik';
import axios from '@lib/axios';
import { app } from '@root/config';
import { toast } from "react-hot-toast";
import {
  Box,
  Grid,
  Button,
  TextField,
  Modal,
  Card,
  CardHeader,
  CardContent,
  MenuItem,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';
import {
  getBanks,
  getMerchants,
} from '@pages/reconciliation/helper';
import { Alert, AlertTitle } from '@material-ui/lab';

import { useTranslation } from 'react-i18next';
import { SelectCheckbox } from '@comp/core/forms';
import DynamicFieldsSet from '@comp/form/DynamicFieldsSet';


const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    // alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '455px',
    top: '65px',
    bottom: '65px',
    margin: '0 auto',
    overflowY: 'auto'
  },
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5]
  },
}));

const ReconciliationSettingsModalForm = ({entity, open, onClose, merchants, banks, onUpdate, ...props}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isOpen, setIsOpen] = React.useState(open);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [tranTypes, setTranTypes] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [fields, setFields] = useState([]);
  const [configFields, setConfigFields] = useState([]);

  React.useEffect(() => {
    setIsOpen(open);
    const getData = async () => {
      await axios.get(`${app.api}/filter/tran_types`).then((response) => {
        setTranTypes(response.data);
      })

      await axios.get(`${app.api}/reconciliation/strategy/list`).then((response) => {
        setStrategies(response.data);
      })

      await axios.get(`${app.api}/reconciliation/field/list`).then((response) => {
        setFields(response.data);
      })

      await axios.get(`${app.api}/reconciliation/strategy/config/field/list`).then((response) => {
        setConfigFields(response.data);
      })
    }

    if (tranTypes.length === 0 || fields.length === 0 || strategies.length === 0) {
      getData();
    }
  }, [open]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setIsOpen(false);
    setIsError(false);
    if (onClose) {
        onClose();
    }
  };

  const values = entity ?
  {
    id: entity.id,
    name: entity.name,
    strategy: entity.strategy,
    field: entity.field,
    bankId: entity.bankId,
    merchantId: entity.merchantId,
    timezone: entity.timezone,
    transactionRegEx: entity.transactionRegEx,
    transactionPostfix: entity.transactionPostfix,
    transactionPrefix: entity.transactionPrefix,
    usingReportInterval: entity.usingReportInterval,
    minDateInterval: entity.minDateInterval,
    maxDateInterval: entity.maxDateInterval,
    settings: entity.settings,
    tranTypes: entity.tranTypes !== null
      ? tranTypes
        .filter(tranType => entity.tranTypes.includes(tranType.name))
        .map(tranType => tranType.id)
      : []
  }
  :
  {
    id: null,
    name: '',
    strategy: '',
    field: '',
    bankId: null,
    merchantId: null,
    timezone: "Asia/Aqtau",
    transactionRegEx: '',
    transactionPostfix: '',
    transactionPrefix: '',
    usingReportInterval: false,
    minDateInterval: '',
    maxDateInterval: '',
    settings: {
      amountField: 12,
      amountScale: 100,
      apiLogin: '',
      apiPassword: '',
      bottomMargin: 0,
      dateField: 1,
      dateFormat: '',
      headerMargin: 4,
      referenceField: 6,
      checkAllTabs: false,
      sheetName: ''
    },
    tranTypes: []
  };

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setIsError(false);

    await axios({
      method: values.id ? 'put' : 'post',
      url:  `${app.api}/reconciliation/job` + (values.id ? `/${values.id}` : ''),
      data: {
        name: values.name,
        strategy: values.strategy,
        field: values.field,
        timezone: values.timezone,
        settings: values.settings,
        bankId: values.bankId ? values.bankId : null,
        merchantId: values.merchantId ? values.merchantId : null,
        usingReportInterval: values.usingReportInterval,
        minDateInterval: values.minDateInterval ? values.minDateInterval : null,
        maxDateInterval: values.maxDateInterval ? values.maxDateInterval : null,
        tranTypes: tranTypes
          .filter(tranType => values.tranTypes.includes(tranType.id))
          .map(tranType => tranType.name),
      }
    })
    .then(async (response) => {
      toast.success(values.id ? t("Successfully updated") : t("Successfully created"));
      handleClose();
      if (onUpdate) {
        onUpdate();
      }
    })
    .catch(async (error) => {
      setIsError(true);
    });
  };

  const validationSchema = 
    Yup.object().shape({
      name: Yup.string().required(t('required')),
      strategy: Yup.string().required(t('required')),
      field: Yup.string().required(t('required')),
      timezone: Yup.string().required(t('required')),
      // settings: Yup.object().shape({
      //   amountField: Yup.number().min(0, 'Should be 0 or greater').required(t('required')),
      //   referenceField: Yup.number().min(0, 'Should be 0 or greater').required(t('required')),
      //   dateField: Yup.number().min(0, 'Should be 0 or greater').required(t('required')),
      //   amountScale: Yup.number().min(0, 'Should be 0 or greater').required(t('required')),
      //   bottomMargin: Yup.number().min(0, 'Should be 0 or greater').required(t('required')),
      //   headerMargin: Yup.number().min(0, 'Should be 0 or greater').required(t('required')),
      //   apiLogin: Yup.string().nullable().optional(),
      //   apiPassword: Yup.string().nullable().optional(),
      //   dateFormat: Yup.string().nullable().optional(),
      //   checkAllTabs: Yup.string().nullable().optional(),
      //   sheetName: Yup.string().nullable().optional(),
      // }),
    });

  const form = (
    <>
    {isError &&
      <Alert severity='error'>
        <AlertTitle>{t('Error!')}</AlertTitle>
        {t('An error occurred during creating account. Please try again later.')}
      </Alert>
    }
    <Formik
      initialValues={values}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        isSubmitting,
        touched,
        values,}) => (
        <form noValidate onSubmit={handleSubmit} {...props}>
          <div><p>{t('Main settings')}</p></div>
          <TextField
            helperText={touched.name && errors.name}
            label={t('reconciliationName')}
            value={values.name}
            name='name'
            fullWidth
            onBlur={handleBlur}
            onChange={handleChange}
            margin='normal'
            variant='outlined'
            error={Boolean(errors.name)}
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            error={Boolean(touched.field && errors.field)}
            fullWidth
            helperText={touched.field && errors.field}
            label={t('fieldName')}
            name="field"
            onChange={(e ,f) => {
              if (f.props.value == values.target) {
                values.target = "";
              }
              handleChange(e, f);
            }}
            onBlur={handleBlur}
            select
            value={values.field}
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
          >
            <MenuItem value={""}>
              {t("Select value")}
            </MenuItem>
            {fields.map((field, index) => (
              <MenuItem key={index} value={field}>
                {field}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            error={Boolean(touched.bankId && errors.bankId)}
            fullWidth
            helperText={touched.bankId && errors.bankId}
            label={t('bank')}
            name="bankId"
            onChange={(e ,f) => {
              if (f.props.value == values.target) {
                values.target = "";
              }
              handleChange(e, f);
            }}
            onBlur={handleBlur}
            select
            value={values.bankId}
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
          >
            <MenuItem value={""}>
              {t("Select value")}
            </MenuItem>
            {banks.map((field, index) => (
              <MenuItem key={field.id} value={field.id}>
                {field.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            error={Boolean(touched.merchantId && errors.merchantId)}
            fullWidth
            helperText={touched.merchantId && errors.merchantId}
            label={t('merchant')}
            name="merchantId"
            onChange={(e ,f) => {
              if (f.props.value == values.target) {
                values.target = "";
              }
              handleChange(e, f);
            }}
            onBlur={handleBlur}
            select
            value={values.merchantId}
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
          >
            <MenuItem value={""}>
              {t("Select value")}
            </MenuItem>
            {merchants.map((field, index) => (
              <MenuItem key={field.id} value={field.id}>
                {field.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            helperText={touched.timezone && errors.timezone}
            label={t('timezone')}
            value={values.timezone}
            name='timezone'
            fullWidth
            onBlur={handleBlur}
            onChange={handleChange}
            margin='normal'
            variant='outlined'
            error={Boolean(errors.timezone)}
            InputLabelProps={{
              shrink: true
            }}
          />
          <FormControlLabel
            name='usingReportInterval'
            value={values.usingReportInterval}
            checked={values.usingReportInterval}
            control={
              <Checkbox
                name="usingReportInterval"
                color="primary"
                onBlur={handleBlur}
                onChange={handleChange}
              />
            }
            label={t('usingReportInterval')}
            labelPlacement="end"
          />
          <TextField
            helperText={touched.minDateInterval && errors.minDateInterval}
            label={t('minDateInterval')}
            value={values.minDateInterval}
            name='minDateInterval'
            fullWidth
            type="number"
            onBlur={handleBlur}
            onChange={handleChange}
            margin='normal'
            variant='outlined'
            error={Boolean(errors.minDateInterval)}
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            helperText={touched.maxDateInterval && errors.maxDateInterval}
            label={t('maxDateInterval')}
            value={values.maxDateInterval}
            name='maxDateInterval'
            fullWidth
            type="number"
            onBlur={handleBlur}
            onChange={handleChange}
            margin='normal'
            variant='outlined'
            error={Boolean(errors.maxDateInterval)}
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            helperText={touched.transactionPrefix && errors.transactionPrefix}
            label={t('transactionPrefix')}
            value={values.transactionPrefix}
            name='transactionPrefix'
            fullWidth
            onBlur={handleBlur}
            onChange={handleChange}
            margin='normal'
            variant='outlined'
            error={Boolean(errors.transactionPrefix)}
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            helperText={touched.transactionPostfix && errors.transactionPostfix}
            label={t('transactionPostfix')}
            value={values.transactionPostfix}
            name='transactionPostfix'
            fullWidth
            onBlur={handleBlur}
            onChange={handleChange}
            margin='normal'
            variant='outlined'
            error={Boolean(errors.transactionPostfix)}
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            helperText={touched.transactionRegEx && errors.transactionRegEx}
            label={t('transactionRegEx')}
            value={values.transactionRegEx}
            name='transactionRegEx'
            fullWidth
            onBlur={handleBlur}
            onChange={handleChange}
            margin='normal'
            variant='outlined'
            error={Boolean(errors.transactionRegEx)}
            InputLabelProps={{
              shrink: true
            }}
          />
          <SelectCheckbox
            error={Boolean(touched.tranTypes && errors.tranTypes)}
            labelId='tranTypes'
            helperText={touched.tranTypes && errors.tranTypes}
            label={t('tranTypes')}
            name='tranTypes'
            onBlur={handleBlur}
            value={values.tranTypes}
            onChange={(e) => {
              setFieldValue('tranTypes', e.target.value)
            }}
            items={tranTypes}
          />
          <TextField
            error={Boolean(touched.strategy && errors.strategy)}
            fullWidth
            helperText={touched.strategy && errors.strategy}
            label={t('strategyName')}
            name="strategy"
            onChange={(e ,f) => {
              if (f.props.value == values.target) {
                values.target = "";
              }
              handleChange(e, f);
            }}
            onBlur={handleBlur}
            select
            value={values.strategy}
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
          >
            <MenuItem value={""}>
              {t("Select value")}
            </MenuItem>
            {strategies.map((strategy, index) => (
              <MenuItem key={index} value={strategy}>
                {strategy}
              </MenuItem>
            ))}
          </TextField>
          <div><p>{t('Parsing settings')}</p></div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            padding: '0 0 25px 0'
          }}>
            <Grid item xs={12}>
              <DynamicFieldsSet
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                name='settings'
                value={values.settings}
                fields={configFields[values.strategy] ?? []}
              />
            </Grid>
          </div>
          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Button
                color='primary'
                disabled={isSubmitting || !Boolean(Object.keys(errors).length === 0)}
                type='submit'
                variant='contained'
                size='small'
              >
                {values.id ? t('Update') : t('Create')}
              </Button>
            </Box>
          </Grid>
        </form>
      )}
    </Formik>
    </>
  );

  return (
    <>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className={classes.modal}
      >
        <Card className={classes.paper}>
          <CardHeader title={values.id ? t('Edit reconciliation settings') : t('Create reconciliation settings')}/>
          <CardContent>
            {form}
          </CardContent>
        </Card>
      </Modal>
    </>
  );
}

export default ReconciliationSettingsModalForm;
