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
  MenuItem
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

import { useTranslation } from 'react-i18next';
import useAuth from '@hooks/useAuth';


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

const WhiteListModalForm = ({open, onClose, onUpdate, ...props}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isOpen, setIsOpen] = React.useState(open);
  const [isError, setIsError] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const { user } = useAuth();

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

  const values = {
    merchant: '',
    documentRef: null,
    clientRef: null,
  };

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setIsError(false);

    await axios({
      method: 'post',
      url:  `${app.api}/sanction/exclusion`,
      data: {
        merchant: values.merchant,
        documentRef: values.documentRef,
        clientRef: values.clientRef
      }
    })
    .then(async (response) => {
      toast.success(t("Successfully created"));
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
      merchant: Yup.string().required(t('Merchant shoudn\'t be empty.')),
      documentRef: Yup.string().when('clientRef', {
          is: (clientRef) => !clientRef || clientRef.length === 0,
          then: Yup.string().required(),
          otherwise: Yup.string().nullable()
      }),
      clientRef:Yup.string().when('documentRef', {
          is: (documentRef) => !documentRef || documentRef.length === 0,
          then: Yup.string().required(),
          otherwise: Yup.string().nullable()
      })
    },
    [[ 'documentRef', 'clientRef' ]]
  );

  const form = (
    <>
    {isError &&
      <Alert severity='error'>
        <AlertTitle>{t('Error!')}</AlertTitle>
        {t('An error occurred during creating white list entity. Please try again later.')}
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
                  error={Boolean(touched.merchant && errors.merchant)}
                  fullWidth
                  helperText={touched.merchant && errors.merchant}
                  label={t('merchant')}
                  name="merchant"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  select
                  value={values.merchant}
                  margin="normal"
              >
                  <MenuItem value={""}>
                  {t("Select value")}
                  </MenuItem>
                  {user.merchants.map((item) => (
                      <MenuItem key={item.merchantId} value={item.merchantId}>
                          {item.merchantName}
                      </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <TextField
              label={t('customerId')}
              value={values.clientRef}
              name="clientRef"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              margin="normal"
              error={Boolean(errors.clientRef)}
            />
            <TextField 
              label={t('documentRef')}
              value={values.documentRef}
              name="documentRef"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              margin="normal"
              error={Boolean(errors.documentRef)}
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
          <CardHeader title={t('Create sanctions white list entities')}/>
          <CardContent>
            {form}
          </CardContent>
        </Card>
      </Modal>
    </>
  );
}

export default WhiteListModalForm;
