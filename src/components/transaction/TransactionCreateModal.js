import React from 'react';
import * as Yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  AddCircle,
  FileCopyOutlined
} from '@material-ui/icons';
import { Formik } from 'formik';

import axios from '@lib/axios';
import { app } from '@root/config';
import useAuth from '@hooks/useAuth';

import PropTypes from 'prop-types';
import {
  Box,
  Grid,
  Button,
  TextField,
  Modal,
  Card,
  CardHeader,
  IconButton,
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

const TransactionCreateModal = (props) => {
  const { data, ...other } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [paymentLink, setPaymentLink] = React.useState('');
  const { user } = useAuth();
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const moneyScale = 100;

  const [merchId, setMerchId] = React.useState(
    localStorage.getItem('merchId') !== null
      ? localStorage.getItem('merchId')
      : user.merchantId
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setPaymentLink('');
    setIsSubmitted(false);
    setIsCopied(false);
    setOpen(false);
    setIsError(false);
  };

  const values = {
    tranId: 't' + Date.now(),
    fee: 0,
    amount: 100,
    description: '',
    agreementId: '',
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(paymentLink);
    setIsCopied(true);
  };

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setIsError(false);
    const merchant = user.merchants.find(merch => merch.merchantId == merchId);
    console.log(merchant);
    await axios
    .post(
      `${app.api}/transactions/frame/`,
      {
        merchant: merchant.merchantName,
        tranId: values.tranId,
        fee: values.fee * moneyScale,
        amount: values.amount * moneyScale,
        type: 'c2a',
        description: values.description,
        options: {
          agreementId: values.agreementId,
          merchant: merchant.merchantName
        }
      }
    )
    .then(async (response) => {
      setPaymentLink(response.data.frameUrl);
      setIsSubmitted(true);
    })
    .catch(async (error) => {
      setIsError(true);
    });
  };

  const validationSchema = 
    Yup.object().shape({
      tranId: Yup.string().max(255),
      description: Yup.string().max(255),
      amount: Yup.number().min(100),
      fee: Yup.number().min(0)
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
            <TextField 
              label={t('TranId')}
              value={values.tranId}
              name="transId"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              margin="normal"
              error={Boolean(touched.tranId && errors.tranId)}
              helperText={touched.tranId && errors.tranId}
            />
            <TextField 
              label={t('Description')}
              value={values.description}
              name="description"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              margin="normal"
              error={Boolean(touched.description && errors.description)}
              helperText={touched.description && errors.description}
            />
            <TextField 
              label={t('Agreement number')}
              value={values.agreementId}
              name="agreementId"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              margin="normal"
              error={Boolean(touched.agreementId && errors.agreementId)}
              helperText={touched.agreementId && errors.agreementId}
            />
            <TextField 
              label={t('Fee')}
              value={values.fee}
              name="fee"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              margin="normal"
              type="number"
              error={Boolean(touched.fee && errors.fee)}
              helperText={touched.fee && errors.fee}
              InputProps={{
                startAdornment: <InputAdornment position="start">&#8376;</InputAdornment>,
              }}
            />
            <TextField 
              label={t('Amount')}
              value={values.amount}
              name="amount"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              margin="normal"
              type="number"
              error={Boolean(touched.amount && errors.amount)}
              helperText={touched.amount && errors.amount}
              InputProps={{
                startAdornment: <InputAdornment position="start">&#8376;</InputAdornment>,
              }}
            />
            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                  size="small"
                >
                  {t('Create transaction')}
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
      action={
        <IconButton color='primary' onClick={copyLinkToClipboard}><FileCopyOutlined /></IconButton>
      }
    >
      <AlertTitle>{t('Transaction frame ready')}</AlertTitle>
      {t('Payment link')}: 
      <br />{paymentLink}
      {isCopied && <p><strong>{t('Link copied')}</strong></p>}
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
          <CardHeader title={t('Create transaction')}/>
          <CardContent>
            {content}
          </CardContent>
        </Card>
      </Modal>
    </>
  );
}

export default TransactionCreateModal;
