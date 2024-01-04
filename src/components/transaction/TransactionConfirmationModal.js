import React from 'react';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import {
  AddCircle
} from '@material-ui/icons';
import { Formik } from 'formik';

import axios from '@lib/axios';
import { app } from '@root/config';
import useAuth from '@hooks/useAuth';

import {
  Box,
  Grid,
  Button,
  Modal,
  Card,
  CardHeader,
  IconButton,
  CardContent,
  TextareaAutosize
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

const TransactionConfirmationModal = (props) => {
  const { data, ...other } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const { user } = useAuth();
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const [merchId, setMerchId] = React.useState(
    localStorage.getItem('merchId') !== null
      ? localStorage.getItem('merchId')
      : user.merchantId
  );

  const values = {
    tranId: ''
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setOpen(false);
    setIsError(false);
  };

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setIsError(false);

    await axios
    .post(
      `${app.api}/merchant/${merchId}/document/transaction_confirmation_certificate`,
      {
        tranId: values.tranId.split(" ")
      }
    )
    .then(async (response) => {
      console.log(response.data);
      console.log(response);
      setIsSubmitted(true);
    })
    .catch(async (error) => {
      setIsError(true);
    });
  };

  const validationSchema = 
    Yup.object().shape({
      tranId: Yup.string().max(255).required('Required')
    });

  const form = (
    <>
    {isError && 
      <Alert severity='error'>
        <AlertTitle>{t('Error!')}</AlertTitle>
        {t('An error occurred during creating transaction. Please try again later.')}
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
            <TextareaAutosize
              label={t('TranId')}
              value={values.tranId}
              name="tranId"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              margin="normal"
              error={Boolean(errors.tranId)}
              helperText={errors.tranId}
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
                  {t('Create transaction confirmation')}
                </Button>
              </Box>
            </Grid>
          </form>
        )}
    </Formik>
    </>
  );

  const result = (
    <Alert
      severity="success"
    >
      <AlertTitle>Справка создана</AlertTitle>
    </Alert>
  );

  let content;
  if (isSubmitted) {
    content = result;
  } else {
    content = form;
  }

  return (
    <>
      <IconButton
        type="button" 
        color="primary"
        onClick={handleOpen}
      >
        <AddCircle />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className={classes.modal}
      >
        <Card className={classes.paper}>
          <CardHeader title={t('Create transaction confirmation')}/>
          <CardContent>
            {content}
          </CardContent>
        </Card>
      </Modal>
    </>
  );
}

export default TransactionConfirmationModal;
