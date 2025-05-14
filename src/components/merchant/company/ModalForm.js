import React from 'react';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import { Formik } from 'formik';
import axios from '@lib/axios';
import { app } from '@root/config';
import { toast } from "react-hot-toast";

import {
  Grid,
  Button,
  TextField,
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
    email: entity.email,
    iin: entity.iin,
    bankAccountNumber: entity.bankAccountNumber,
  }
  :
  {
    id: null,
    name: null,
    email: null,
    iin: null,
    bankAccountNumber: null,
  };

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setIsError(false);

    await axios
    .request(
      {
        method: values.id ? 'put' : 'post',
        url: values.id ? `${app.api}/company/${values.id}` : `${app.api}/company/`,
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
      name: Yup.string().required(),
      email: Yup.string().nullable().notRequired(),
      iin: Yup.string().nullable().notRequired(),
      bankAccountNumber: Yup.string().nullable().notRequired(),
    });

  const form = (
    <>
    {isError &&
      <Alert severity='error'>
        <AlertTitle>{t('Error!')}</AlertTitle>
        {t('An error occurred during creating company. Please try again later.')}
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
              error={Boolean(touched.name && errors.name)}
              fullWidth
              helperText={touched.name && errors.name}
              label={t('name')}
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              type="text"
              variant="outlined"
              value={values.name}
              margin="normal"
            />
            <TextField
              error={Boolean(touched.companyEmail && errors.companyEmail)}
              fullWidth
              helperText={touched.companyEmail && errors.companyEmail}
              label={t('companyEmail')}
              name="companyEmail"
              onChange={handleChange}
              onBlur={handleBlur}
              type="text"
              variant="outlined"
              value={values.companyEmail}
              margin="normal"
            />
            <TextField
              error={Boolean(touched.iin && errors.iin)}
              fullWidth
              helperText={touched.iin && errors.iin}
              label={t('companyIin')}
              name="iin"
              onChange={handleChange}
              onBlur={handleBlur}
              type="text"
              variant="outlined"
              value={values.iin}
              margin="normal"
            />
            <TextField
              error={Boolean(touched.bankAccountNumber && errors.bankAccountNumber)}
              fullWidth
              helperText={touched.bankAccountNumber && errors.bankAccountNumber}
              label={t('companyBankAccountNumber')}
              name="bankAccountNumber"
              onChange={handleChange}
              onBlur={handleBlur}
              type="text"
              variant="outlined"
              value={values.bankAccountNumber}
              margin="normal"
            />
            <Grid item xs={12}>
              <DialogActions>
              <Button
                disabled={isSubmitting || !Boolean(Object.keys(errors).length === 0)}
                type="submit"
              >
                {values.id ? t('Update') : t('Create')}
              </Button>
            </DialogActions>
          </Grid>
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
        aria-labelledby="form-dialog-title"
        className={classes.modal}
      >
        <DialogTitle>
          {values.id ? t('Edit') : t('Create')}
        </DialogTitle>
        <DialogContent>
          {form}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ModalForm;
