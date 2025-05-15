// src/components/authentication/two-factor/TwoFactorAuth.js
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    FormHelperText,
    TextField,
    Typography,
    Card,
    CardContent
} from '@material-ui/core';
import useAuth from '@hooks/useAuth';
import useMounted from '@hooks/useMounted';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode.react';
import axios from '@lib/axios';
import { app } from '@root/config';
import toast from 'react-hot-toast';

const TwoFactorAuth = () => {
    const mounted = useMounted();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { completeTwoFactor, twoFactorRegistrationRequired } = useAuth();
    const [qrCode, setQrCode] = useState('');
    const [showQrCode, setShowQrCode] = useState(false);
    const [isRegistrationMode, setIsRegistrationMode] = useState(false);

    // При загрузке компонента проверяем тип 2FA
    useEffect(() => {
        // Если требуется регистрация 2FA, автоматически генерируем QR-код
        if (twoFactorRegistrationRequired) {
            setIsRegistrationMode(true);
            generateQrCode();
        }
    }, [twoFactorRegistrationRequired]);

    const generateQrCode = async () => {
        try {
            const response = await axios.post(`${app.api}/2fa/google/create`);

            if (mounted.current) {
                setQrCode(response.data.qr);
                setShowQrCode(true);
                setIsRegistrationMode(true);
            }
        } catch (err) {
            console.error(err);
            toast.error(t('Failed to generate QR code'));
        }
    };

    const verifyCode = async (code) => {
        try {
            if (isRegistrationMode) {
                await axios.post(`${app.api}/2fa/google/confirm`, {
                    authCode: code
                });

                await axios.post(`${app.api}/2fa/check`, {
                    authCode: code
                });

                toast.success(t('Two-factor authentication has been enabled'));
                completeTwoFactor();

                setTimeout(() => {
                    navigate('/board');
                    window.location.reload();
                }, 500);
            } else {
                await axios.post(`${app.api}/2fa/check`, {
                    authCode: code
                });

                toast.success(t('Authentication successful'));
                completeTwoFactor();

                setTimeout(() => {
                    navigate('/board');
                    window.location.reload();
                }, 500);
            }
            return { success: true };
        } catch (err) {
            console.error(err);
            return {
                success: false,
                message: err.response?.data?.message || t('Failed to verify code')
            };
        }
    };

    return (
        <Card>
            <CardContent sx={{ p: 4 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography color="textPrimary" variant="h4">
                        {isRegistrationMode
                            ? t('Set Up Two-Factor Authentication')
                            : t('Two-Factor Authentication')}
                    </Typography>
                    <Typography color="textSecondary" sx={{ mt: 1 }} variant="body2">
                        {isRegistrationMode
                            ? t('Scan the QR code using your authenticator app and enter the verification code')
                            : t('Enter the authentication code from your authenticator app')}
                    </Typography>
                </Box>

                {isRegistrationMode && !showQrCode && (
                    <Box sx={{ mt: 3, mb: 3 }}>
                        <Button
                            color="primary"
                            fullWidth
                            size="large"
                            onClick={generateQrCode}
                            variant="contained"
                        >
                            {t('Generate QR Code')}
                        </Button>
                    </Box>
                )}

                {showQrCode && (
                    <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'center' }}>
                        <QRCode value={qrCode} size={200} />
                    </Box>
                )}

                <Formik
                    initialValues={{
                        code: '',
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        code: Yup.string().required(t('required')),
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            const result = await verifyCode(values.code);

                            if (!result.success) {
                                setStatus({ success: false });
                                setErrors({ submit: result.message });
                                setSubmitting(false);
                            }
                        } catch (err) {
                            console.error(err);
                            if (mounted.current) {
                                setStatus({ success: false });
                                setErrors({ submit: err.message });
                                setSubmitting(false);
                            }
                        }
                    }}
                >
                    {({
                          errors,
                          handleBlur,
                          handleChange,
                          handleSubmit,
                          isSubmitting,
                          touched,
                          values
                      }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <TextField
                                autoFocus
                                error={Boolean(touched.code && errors.code)}
                                fullWidth
                                helperText={touched.code && errors.code}
                                label={t('Verification Code')}
                                margin="normal"
                                name="code"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="text"
                                value={values.code}
                                variant="outlined"
                            />
                            {errors.submit && (
                                <Box sx={{ mt: 3 }}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Box>
                            )}
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    color="primary"
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                >
                                    {t('Verify')}
                                </Button>
                            </Box>
                            {isRegistrationMode && (
                                <Box sx={{ mt: 3 }}>
                                    <Button
                                        color="secondary"
                                        fullWidth
                                        size="large"
                                        onClick={generateQrCode}
                                        variant="outlined"
                                    >
                                        {t('Generate New QR Code')}
                                    </Button>
                                </Box>
                            )}
                        </form>
                    )}
                </Formik>
            </CardContent>
        </Card>
    );
};

export default TwoFactorAuth;
