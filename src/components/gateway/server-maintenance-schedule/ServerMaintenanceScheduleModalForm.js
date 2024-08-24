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
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

import { useTranslation } from 'react-i18next';
import { SelectCheckbox } from '@comp/core/forms';


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

const ServerMaintenanceScheduleModalForm = ({entity, open, gatewayId, onClose, onUpdate, ...props}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isOpen, setIsOpen] = React.useState(open);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [tranType, setTranType] = useState([]);

  React.useEffect(() => {
    setIsOpen(open);
    const getData = async () => {
      await axios.get(`${app.api}/filter/tran_types`).then((response) => {
        setTranType(response.data);
      })
    }

    if (tranType.length === 0) {
      getData();
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

  const values = entity ?
  {
    id: entity.id,
    frequency: entity.frequency,
    startedAt: entity.startedAt,
    finishedAt: entity.finishedAt,
    tranTypeIds: typeof entity.tranTypeIds !== 'undefined' ? entity.tranTypeIds : []
  }
  :
  {
    id: null,
    frequency: 'once',
    startedAt: '',
    finishedAt: '',
    tranTypeIds: tranType.map((type) => type.id)
  };

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setIsError(false);

    await axios({
      method: values.id ? 'put' : 'post',
      url:  `${app.api}/gateways/${gatewayId}/server_maintenance_schedule` + (values.id ? `/${values.id}` : ''),
      data: {
        gatewayId: Number(gatewayId),
        frequency: values.frequency,
        startedAt: values.startedAt,
        finishedAt: values.finishedAt,
        tranTypeIds: values.tranTypeIds,
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
      frequency: Yup.string().oneOf(
        ['once'],
        t("Frequency must match")
      ),
      startedAt: Yup.string().required(t('required')),
      finishedAt: Yup.string().required(t('required')),
      tranTypeIds: Yup.array().min(1, t('required')),
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
              helperText={touched.frequency && errors.frequency}
              label={t('Frequency')}
              value={values.frequency}
              name="frequency"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              error={Boolean(errors.frequency)}
              InputLabelProps={{
                shrink: true
              }}
              disabled={true}
            />
            <TextField
              error={Boolean(touched.startedAt && errors.startedAt)}
              fullWidth
              helperText={touched.startedAt && errors.startedAt}
              label={t('Started At')}
              margin="normal"
              name="startedAt"
              onBlur={handleBlur}
              onChange={handleChange}
              type="datetime-local"
              value={values.startedAt}
              variant="outlined"
              size="small"
              InputLabelProps={{
                shrink: true
              }}
            />
            <TextField
              error={Boolean(touched.finishedAt && errors.finishedAt)}
              fullWidth
              helperText={touched.finishedAt && errors.finishedAt}
              label={t('Finished At')}
              margin="normal"
              name="finishedAt"
              onBlur={handleBlur}
              onChange={handleChange}
              type="datetime-local"
              value={values.finishedAt}
              variant="outlined"
              size="small"
              sx={{ mb: 3 }}
              InputLabelProps={{
                shrink: true
              }}
            />
            <SelectCheckbox
              error={Boolean(touched.tranTypeIds && errors.tranTypeIds)}
              labelId="tranTypeId"
              helperText={touched.tranTypeIds && errors.tranTypeIds}
              label={t('tranTypeId')}
              name="tranTypeIds"
              onBlur={handleBlur}
              value={values.tranTypeIds}
              onChange={(e) => {
                setFieldValue('tranTypeIds', e.target.value);
              }}
              items={tranType}
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
          <CardHeader title={values.id ? t('Edit schedule') : t('Create schedule')}/>
          <CardContent>
            {form}
          </CardContent>
        </Card>
      </Modal>
    </>
  );
}

export default ServerMaintenanceScheduleModalForm;
