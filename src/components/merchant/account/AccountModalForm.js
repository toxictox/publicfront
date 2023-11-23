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
  InputAdornment
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

const AccountModalForm = ({entity, open, merchantId, onClose, onUpdate, ...props}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isOpen, setIsOpen] = React.useState(open);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(open);
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
    overdraftLimit: entity.overdraftLimit
  }
  :
  {
    id: null,
    fee: "",
    overdraftLimit: 0
  };

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setIsError(false);

    await axios({
      method: values.id ? 'put' : 'post',
      url:  `${app.api}/merchant/${merchantId}/account` + (values.id ? `/${values.id}` : ''),
      data: {
        name: values.name,
        overdraftLimit: values.overdraftLimit,
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
      name: Yup.string().min(5).max(255),
      overdraftLimit: Yup.number().min(0, 'Should be 0 or greater').required('Required'),
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
              label={t('overdraftLimit')}
              value={values.overdraftLimit}
              name="overdraftLimit"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              margin="normal"
              type="number"
              error={Boolean(errors.overdraftLimit)}
              helperText={errors.overdraftLimit}
              InputProps={{
                endAdornment: <InputAdornment position="end">&#8376;</InputAdornment>,
              }}
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

export default AccountModalForm;
