import React from 'react';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import { Formik } from 'formik';
import axios from '@lib/axios';
import { app } from '@root/config';
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
  FormControlLabel,
  Switch,
  MenuItem
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

const AccountCronJobModalForm = ({entity, open, merchant, onClose, onUpdate, ...props}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isOpen, setIsOpen] = React.useState(open);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [accountList, setAccountList] = React.useState({
    items: []
  });

  React.useEffect(() => {
    setIsOpen(open);
    getAccounts(merchant);
  }, [open]);


  const getAccounts = (merchant) => {
    if (merchant) {
      axios.get(`${app.api}/merchant/${merchant}/account`,
        {
          params: {
            count: 100
          }
        }
      ).then((response) => {
        setAccountList(response.data);
      });
    }
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
    name: entity.name,
    description: entity.description,
    target: entity.target,
    source: entity.source,
    fee: entity.fee,
    cronExpression: entity.cronExpression,
    balanceTimeAdjustment: entity.balanceTimeAdjustment,
    enabled: entity.enabled,
  }
  :
  {
    id: null,
    name: "",
    description: "",
    target: "",
    source: "",
    fee: 0,
    cronExpression: "* * * * *",
    balanceTimeAdjustment: "now",
    enabled: false
  };

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setIsError(false);

    await axios({
      method: values.id ? 'put' : 'post',
      url:  `${app.api}/merchant/${merchant}/account_job` + (values.id ? `/${values.id}` : ''),
      data: {
        name: values.name,
        description: values.description,
        target: values.target,
        source: values.source,
        fee: values.fee,
        cronExpression: values.cronExpression,
        balanceTimeAdjustment: values.balanceTimeAdjustment,
        enabled: values.enabled,
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
      name: Yup.string().min(3).max(255),
      description: Yup.string().min(3).max(255),
      target: Yup.string().min(1),
      source: Yup.string().min(1),
      fee: Yup.number().min(0).max(100),
    });

  const form = (
    <>
    {isError &&
      <Alert severity='error'>
        <AlertTitle>{t('Error!')}</AlertTitle>
        {t('An error occurred during creating cron job. Please try again later.')}
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
            <TextField
              label={t('Name')}
              value={values.name}
              name="name"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              margin="normal"
              error={Boolean(errors.name)}
            />

            <TextField
              label={t('Description')}
              value={values.description}
              name="description"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              margin="normal"
              error={Boolean(errors.description)}
            />

            <Grid item xs={12}>
                <TextField
                    label={t('balanceTimeAdjustment')}
                    value={values.balanceTimeAdjustment}
                    name="balanceTimeAdjustment"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    margin="normal"
                    error={Boolean(errors.balanceTimeAdjustment)}
                />
            </Grid>

            <Grid container>

              <Grid item xs={6}>
                  <TextField
                      error={Boolean(touched.source && errors.source)}
                      fullWidth
                      helperText={touched.source && errors.source}
                      label="source"
                      name="source"
                      onChange={(e ,f) => {
                          if (f.props.value == values.target) {
                              values.target = "";
                          }
                          handleChange(e, f);
                      }}
                      onBlur={handleBlur}
                      select
                      value={values.source}
                      margin="normal"
                  >
                      <MenuItem value={""}>
                      {t("Select value")}
                      </MenuItem>
                      {accountList.items.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                              {item.name}
                          </MenuItem>
                      ))}
                  </TextField>
              </Grid>
              <Grid item xs={6}>
                  <TextField
                      error={Boolean(touched.target && errors.target)}
                      fullWidth
                      helperText={touched.target && errors.target}
                      label="target"
                      name="target"
                      onChange={(e ,f) => {
                          if (values.source == f.props.value) {
                              values.source = "";
                          }
                          handleChange(e, f);
                      }}
                      onBlur={handleBlur}
                      select
                      value={values.target}
                      margin="normal"
                  >
                      <MenuItem value={""}>
                      {t("Select value")}
                      </MenuItem>
                      {accountList.items.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                              {item.name}
                          </MenuItem>
                      ))}
                  </TextField>
              </Grid>
            </Grid>

            <Grid item xs={12}>
                <TextField
                    label={t('fee')}
                    value={values.fee}
                    name="fee"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    margin="normal"
                    type="number"
                    error={Boolean(errors.fee)}
                    helperText={errors.fee}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">&#37;</InputAdornment>,
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label={t('cronExpression')}
                    value={values.cronExpression}
                    name="cronExpression"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    margin="normal"
                    error={Boolean(errors.cronExpression)}
                />
            </Grid>

            <Grid item xs={12}>
                <FormControlLabel control={
                    <Switch
                        checked={values.enabled}
                        name="enabled"
                        onChange={handleChange}
                        color={values.enabled ? "success" : "error"}
                    />}
                    label={values.enabled ? "enabled" : "disabled"}
                />
            </Grid>

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
          <CardHeader title={values.id ? t('Edit cron job') : t('Create cron job')}/>
          <CardContent>
            {form}
          </CardContent>
        </Card>
      </Modal>
    </>
  );
}

export default AccountCronJobModalForm;
