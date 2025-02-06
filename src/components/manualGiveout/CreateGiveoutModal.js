import React, {useState} from 'react';
import * as Yup from 'yup';
import {makeStyles} from '@material-ui/core/styles';
import {Formik} from 'formik';
import axios from '@lib/axios';
import {app} from '@root/config';
import {toast} from "react-hot-toast";

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
} from '@material-ui/core';
import {Alert, AlertTitle} from '@material-ui/lab';

import {useTranslation} from 'react-i18next';
import useAuth from "@hooks/useAuth";

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
        boxShadow: theme.shadows[5],
        width: '80%',
    },
}));

const CreateGiveoutModal = ({entity, open, merchantId, onClose, onUpdate, ...props}) => {
    const {t} = useTranslation();
    const classes = useStyles();
    const [isOpen, setIsOpen] = React.useState(open);
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const {user} = useAuth();

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
        pan: "",
        amount: 110,
        merchant: user.merchantName,
        clientName: "",
        iin: "",
        phoneNumber: "",
        customerEmail: "",
        customerId: "",
        tranId: ""
    };

    const handleSubmit = async (values, {setErrors, setStatus, setSubmitting}) => {
        console.log(values);
        setIsError(false);

        await axios({
            method: 'post',
            url: `${app.api}/manual/giveout/`,
            data: {
                pan: values.pan,
                amount: values.amount * 100,
                merchant: user.merchantName,
                clientName: values.clientName,
                iin: values.iin,
                phoneNumber: values.phoneNumber,
                customerEmail: values.customerEmail,
                customerId: values.customerId,
                tranId: values.tranId
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
            tranId: Yup.string().max(255),
            customerId: Yup.number().required('Required'),
            pan: Yup.string().max(16).min(16).required('Required'),
            amount: Yup.number().min(110).required('Required'),
            clientName: Yup.string().max(300),
            iin: Yup.string().min(12).max(12),
            phoneNumber: Yup.string().min(12).max(12),
            email: Yup.string().email(t('email')).max(255),
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
                      values,
                  }) => (
                    <form noValidate onSubmit={handleSubmit} {...props}>
                        <TextField
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
                        <TextField
                            label={t('customerId')}
                            value={values.agreementId}
                            name="customerId"
                            fullWidth
                            onBlur={handleBlur}
                            onChange={handleChange}
                            margin="normal"
                            type="number"
                            error={Boolean(errors.customerId)}
                            helperText={errors.customerId}
                        />
                        <TextField
                            label={t('pan')}
                            value={values.pan}
                            name="pan"
                            fullWidth
                            onBlur={handleBlur}
                            onChange={handleChange}
                            margin="normal"
                            error={Boolean(errors.pan)}
                        />
                        <TextField
                            label={t('amount')}
                            value={values.amount}
                            name="amount"
                            fullWidth
                            onBlur={handleBlur}
                            onChange={handleChange}
                            margin="normal"
                            type="number"
                            error={Boolean(errors.amount)}
                            helperText={errors.amount}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">&#8376;</InputAdornment>,
                            }}
                        />
                        <TextField
                            label={t('clientName')}
                            value={values.clientName}
                            name="clientName"
                            fullWidth
                            onBlur={handleBlur}
                            onChange={handleChange}
                            margin="normal"
                            error={Boolean(errors.clientName)}
                            helperText={errors.clientName}
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
                            label={t('phoneNumber')}
                            value={values.phoneNumber}
                            name="phoneNumber"
                            fullWidth
                            onBlur={handleBlur}
                            onChange={handleChange}
                            margin="normal"
                            error={Boolean(errors.phoneNumber)}
                        />
                        <TextField
                            autoFocus
                            error={Boolean(touched.email && errors.email)}
                            fullWidth
                            helperText={touched.email && errors.email}
                            label={t('email')}
                            margin="normal"
                            name="customerEmail"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="email"
                            value={values.customerEmail}
                            variant="outlined"
                            size="small"
                            sx={{m: 0}}
                        />
                        <Grid item xs={12}>
                            <Box sx={{mt: 2}}>
                                <Button
                                    color="primary"
                                    disabled={isSubmitting || !Boolean(Object.keys(errors).length === 0)}
                                    type="submit"
                                    variant="contained"
                                    size="small"
                                >
                                    {t('Create Manual Giveout')}
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
                    <CardHeader title={t('Create Manual Giveout')}/>
                    <CardContent>
                        {form}
                    </CardContent>
                </Card>
            </Modal>
        </>
    );
}

export default CreateGiveoutModal;
