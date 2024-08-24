import React from 'react';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import { Formik } from 'formik';
import axios from '@lib/axios';
import { app } from '@root/config';
import useAuth from '@hooks/useAuth';
import { format } from 'date-fns';
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
  InputAdornment,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

import { useTranslation } from 'react-i18next';


const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5]
  },
}));

const ModalForm = ({entity, open, merchantId, onClose, onUpdate, ...props}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isOpen, setIsOpen] = React.useState(open);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [strategies, setStrategies] = React.useState([]);
  const [tranTypes, setTranTypes] = React.useState([]);
  const [terminals, setTerminals] = React.useState({
    data: []
  });

  React.useEffect(() => {
    setIsOpen(open);
    if (open) {
      if (strategies.length == 0) {
        getStrategies();
      }
      if (tranTypes.length == 0) {
        getStrategies();
      }
      if (tranTypes.length == 0) {
        getTranTypes();
      }
      if (terminals.data.length == 0) {
        getTerminals();
      }
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

  const getStrategies = () => {
    axios.get(`${app.api}/merchant/${merchantId}/fee/strategies/`
    ).then((response) => {
      setStrategies(response.data);
    });
  };

  const getTranTypes = () => {
    axios.get(`${app.api}/filter/tran_types`
    ).then((response) => {
      setTranTypes(response.data);
    });
  }

  const getTerminals = () => {
    axios.get(`${app.api}/terminals`,
      {
        params: {
          merchant: merchantId,
          count: 100,
        }
      }
    ).then((response) => {
      setTerminals(response.data);
    });
  }

  const values = entity ?
  {
    id: entity.id,
    priority: entity.priority,
    tranType: entity.tranType,
    terminal: entity.terminal,
    min: entity.min,
    max: entity.max,
    strategyName: entity.strategyName,
    value: entity.value,
    merchantFeePercent: entity.merchantFeePercent,
    startDate: entity.startDate ?
        format(new Date(entity.startDate), 'yyyy-MM-dd') + 'T' + format(new Date(entity.startDate), 'hh:mm')
    : null,
    endDate: entity.endDate ?
        format(new Date(entity.endDate), 'yyyy-MM-dd') + 'T' + format(new Date(entity.endDate), 'hh:mm')
    : null,
  }
  :
  {
    id: null,
    priority: 1,
    tranType: null,
    terminal: null,
    min: null,
    max: null,
    strategyName: null,
    value: 0,
    merchantFeePercent: 0,
    startDate: null,
    endDate: null,

  };

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setIsError(false);

    await axios
    .request(
      {
        method: values.id ? 'put' : 'post',
        url: values.id ? `${app.api}/merchant/${merchantId}/fee/${values.id}` : `${app.api}/merchant/${merchantId}/fee/`,
        data: values
      }
    )
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
      startDate: Yup.date().nullable().default(null),
      endDate: Yup.date().nullable().default(null),
      value: Yup.number().nullable(),
    });

  const form = (
    <>
    {isError &&
      <Alert severity='error'>
        <AlertTitle>{t('Error!')}</AlertTitle>
        {t('An error occurred during creating rule. Please try again later.')}
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
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <TextField
                  label={t('priority')}
                  value={values.priority}
                  name="priority"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  margin="normal"
                  type="number"
                  error={Boolean(errors.priority)}
                  helperText={errors.priority}
                />
              </Grid>

              <Grid item xs={9}>
                <TextField
                    error={Boolean(touched.tranType && errors.tranType)}
                    fullWidth
                    helperText={touched.tranType && errors.tranType}
                    label="tranType"
                    name="tranType"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    select
                    value={values.tranType}
                    margin="normal"
                >
                  <MenuItem value={""}>
                  {t("Select value")}
                  </MenuItem>
                  {tranTypes.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                          {item.name}
                      </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                    error={Boolean(touched.terminal && errors.terminal)}
                    fullWidth
                    helperText={touched.terminal && errors.terminal}
                    label="terminal"
                    name="terminal"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    select
                    value={values.terminal}
                    margin="normal"
                >
                  <MenuItem value={""}>
                  {t("Select value")}
                  </MenuItem>
                  {terminals.data.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                          {item.name}
                      </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label={t('min')}
                  value={values.min}
                  name="min"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  margin="normal"
                  type="number"
                  error={Boolean(errors.min)}
                  helperText={errors.min}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label={t('max')}
                  value={values.max}
                  name="max"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  margin="normal"
                  type="number"
                  error={Boolean(errors.max)}
                  helperText={errors.max}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                    error={Boolean(touched.strategyName && errors.strategyName)}
                    fullWidth
                    helperText={touched.strategyName && errors.strategyName}
                    label="strategyName"
                    name="strategyName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    select
                    value={values.strategyName}
                    margin="normal"
                >
                  <MenuItem value={""}>
                  {t("Select value")}
                  </MenuItem>
                  {strategies.map((item) => (
                      <MenuItem key={item} value={item}>
                          {item}
                      </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={8}>
                <TextField
                  label={t('value')}
                  value={values.value}
                  name="value"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  margin="normal"
                  type="number"
                  error={Boolean(errors.value)}
                  helperText={errors.value}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label={t('merchantFeePercent')}
                  value={values.merchantFeePercent}
                  name="merchantFeePercent"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  margin="normal"
                  type="number"
                  error={Boolean(errors.merchantFeePercent)}
                  helperText={errors.merchantFeePercent}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">&#37;</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item md={6}>
                <TextField
                  label={t('Start date')}
                  value={values.startDate}
                  name="startDate"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  margin="normal"
                  error={Boolean(errors.startDate)}
                  helperText={t('Leave empty to create default rule')}
                  type="datetime-local"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              <Grid item md={6}>
                <TextField
                  label={t('End date')}
                  value={values.endDate}
                  name="endDate"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  margin="normal"
                  error={Boolean(errors.endDate)}
                  helperText={t('Leave empty to create default rule')}
                  type="datetime-local"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
            </Grid>
            <DialogActions>
              <Button
                disabled={isSubmitting || !Boolean(Object.keys(errors).length === 0)}
                type="submit"
              >
                {values.id ? t('Update') : t('Create')}
              </Button>
            </DialogActions>
          </form>
        )}
    </Formik>
    </>
  );

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className={classes.modal}
      >
        <DialogTitle>
          {values.id ? t('Edit rule') : t('Create rule')}
        </DialogTitle>
        <DialogContent>
          {form}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ModalForm;
