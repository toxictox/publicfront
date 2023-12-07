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

const ModalForm = ({entity, open, terminalId, onClose, onUpdate, ...props}) => {
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
    fee: entity.fee,
    startDate: entity.startDate ?
        format(new Date(entity.startDate.date), 'yyyy-MM-dd') + 'T' + format(new Date(entity.startDate.date), 'hh:mm')
    : null,
    cardIssuer: entity.cardIssuer
  }
  :
  {
    id: null,
    fee: 0,
    startDate: null,
    cardIssuer: ''
  };

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setIsError(false);

    await axios
    .post(
      values.id ? `${app.api}/terminal/${terminalId}/fee/${values.id}` : `${app.api}/terminal/${terminalId}/fee/`,
      {
        fee: values.fee,
        startDate: values.startDate,
        cardIssuer: values.cardIssuer ? values.cardIssuer : ''
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
      cardIssuer: Yup.string().max(255),
      fee: Yup.number().min(0, 'Should be 0 or greater').required('Required'),
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
            <TextField
              label={t('Fee')}
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
            <TextField 
              label={t('Card Issuer Bank Name')}
              value={values.cardIssuer}
              name="cardIssuer"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              margin="normal"
              error={Boolean(errors.cardIssuer)}
              helperText={t('Leave empty to create wildcard rule')}
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
          <CardHeader title={values.id ? t('Edit rule') : t('Create rule')}/>
          <CardContent>
            {form}
          </CardContent>
        </Card>
      </Modal>
    </>
  );
}

export default ModalForm;
