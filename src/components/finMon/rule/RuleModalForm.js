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
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

import { useTranslation } from 'react-i18next';
import { SelectCheckbox } from '@comp/core/forms';
import DynamicFieldsSet from '@comp/form/DynamicFieldsSet';


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

const RuleModalForm = ({entity, open, merchantId, onClose, onUpdate, ...props}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isOpen, setIsOpen] = React.useState(open);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const [tranTypes, setTranTypes] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [ruleTypes, setRuleTypes] = useState({});

  React.useEffect(() => {
    setIsOpen(open);
    if (open) {
      axios.get(`${app.api}/filter/tran_types`).then((response) => {
        setTranTypes(response.data.map((item) => {return {id: item.name, name: item.name}}));
      });
  
      axios.get(`${app.api}/filter/merchants`).then((response) => {
        setMerchants(response.data.data);
      });
  
      fetchRuleTypes();
    }
  }, [open]);

  const fetchRuleTypes = () => {
    axios.get(`${app.api}/finMon/rules/types`).then((response) => {
      setRuleTypes(response.data);
    });
  };

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
    type: entity.type,
    options: entity.options,
    filterMerchants: entity.filterMerchants,
    filterTransactionTypes: entity.filterTransactionTypes,
    critical: entity.critical,
    enabled: entity.enabled,
    transactionTypes: entity.transactionTypes,
    merchants: entity.merchants,
  }
  :
  {
    id: null,
    type: "",
    options: {},
    filterMerchants: false,
    filterTransactionTypes: false,
    critical: false,
    enabled: true,
    transactionTypes: [],
    merchants: [],
  };

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    console.log(values);
    setIsError(false);

    await axios({
      method: values.id ? 'put' : 'post',
      url:  `${app.api}/finMon/rules` + (values.id ? `/${values.id}` : ''),
      data: {
        type: values.type,
        options: values.options,
        filterMerchants: values.filterMerchants,
        filterTransactionTypes: values.filterTransactionTypes,
        critical: values.critical,
        enabled: values.enabled,
        transactionTypes: values.transactionTypes,
        merchants: values.merchants,
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
            <Grid item xs={12}>
                <TextField
                    error={Boolean(touched.type && errors.type)}
                    fullWidth
                    helperText={touched.type && errors.type}
                    label={t("ruleType")}
                    name="type"
                    onChange={(e ,f) => {
                        values.options = {};
                        handleChange(e, f);
                    }}
                    onBlur={handleBlur}
                    select
                    value={values.type}
                    margin="normal"
                >
                    <MenuItem value={""}>
                    {t("Select value")}
                    </MenuItem>
                    {Object.keys(ruleTypes).map((key) => (
                        <MenuItem key={key} value={key}>
                            {t(ruleTypes[key].label)}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>

            {Boolean(values.type) && values.type in ruleTypes &&
              <Grid item xs={12}>
                  <DynamicFieldsSet
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      name='options'
                      value={values.options}
                      fields={ruleTypes[values.type].form}
                  />
              </Grid>
            }

            <FormControlLabel control={
                <Switch
                    checked={values.filterTransactionTypes}
                    name='filterTransactionTypes'
                    onChange={handleChange}
                    color={values.filterTransactionTypes ? "success" : "error"}
                />}
                label={values.filterTransactionTypes ? t("Transaction types filter enabled") : t("Transaction types filter disabled")}
            />

            <Grid item xs={12}>
              <SelectCheckbox
                disabled={!values.filterTransactionTypes}
                error={Boolean(touched.transactionTypes && errors.transactionTypes)}
                labelId="transactionTypes"
                helperText={touched.transactionTypes && errors.transactionTypes}
                label={t('transactionTypes')}
                name="transactionTypes"
                onBlur={handleBlur}
                value={values.transactionTypes}
                sx={{ m: 0 }}
                onChange={(e) => {
                  setFieldValue('transactionTypes', e.target.value);
                }}
                items={tranTypes}
              />
            </Grid>

            <FormControlLabel control={
                <Switch
                    checked={values.filterMerchants}
                    name="filterMerchants"
                    onChange={handleChange}
                    color={values.filterMerchants ? "success" : "error"}
                />}
                label={values.filterMerchants ? t("Merchants filter enabled") : t("Merchants filter disabled")}
            />

            <Grid item xs={12}>
              <SelectCheckbox
                disabled={!values.filterMerchants}
                error={Boolean(touched.merchants && errors.merchants)}
                labelId="merchants"
                helperText={touched.merchants && errors.merchants}
                label={t('merchants')}
                name="merchants"
                onBlur={handleBlur}
                value={values.merchants}
                sx={{ m: 0 }}
                onChange={(e) => {
                  setFieldValue('merchants', e.target.value);
                }}
                items={merchants}
              />
            </Grid>

            <FormControlLabel control={
                <Switch
                    checked={values.critical}
                    name="critical"
                    onChange={handleChange}
                    color={values.critical ? "success" : "error"}
                />}
                label={values.critical ? t("Blocking check") : t("Alert only")}
            />

            <FormControlLabel control={
                <Switch
                    checked={values.enabled}
                    name="enabled"
                    onChange={handleChange}
                    color={values.enabled ? "success" : "error"}
                />}
                label={values.enabled ? t("Enabled") : t("Disabled")}
            />

            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Button
                  color="primary"
                  disabled={isSubmitting || !Boolean(Object.keys(errors).length === 0)}
                  type="submit"
                  variant="contained"
                  size="small"
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
          <CardHeader title={values.id ? t('Edit account') : t('Create account')}/>
          <CardContent>
            {form}
          </CardContent>
        </Card>
      </Modal>
    </>
  );
}

export default RuleModalForm;
