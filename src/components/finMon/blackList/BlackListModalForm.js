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
  FormControlLabel,
  Switch,
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

const BlackListModalForm = ({entity, open, merchantId, onClose, onUpdate, ...props}) => {
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
    pan: entity.pan,
    token: entity.token,
    description: entity.description,
    iin: entity.iin,
  }
  :
  {
    id: null,
    pan: "",
    token: "",
    description: "",
    iin: "",
  };

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    console.log(values);
    setIsError(false);

    await axios({
      method: values.id ? 'put' : 'post',
      url:  `${app.api}/finMon/black_list` + (values.id ? `/${values.id}` : ''),
      data: {
        pan: values.pan,
        token: values.token,
        iin: values.iin,
        description: values.description,
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
        description: Yup.string().min(5).max(255),
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
                label={t('Pan')}
                value={values.pan}
                name="pan"
                fullWidth
                onBlur={handleBlur}
                onChange={handleChange}
                margin="normal"
                error={Boolean(errors.pan)}
            />
            <TextField 
                label={t('Token')}
                value={values.token}
                name="token"
                fullWidth
                onBlur={handleBlur}
                onChange={handleChange}
                margin="normal"
                error={Boolean(errors.token)}
            />
            <TextField 
                label={t('Iin')}
                value={values.iin}
                name="iin"
                fullWidth
                onBlur={handleBlur}
                onChange={handleChange}
                margin="normal"
                error={Boolean(errors.iin)}
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

export default BlackListModalForm;
