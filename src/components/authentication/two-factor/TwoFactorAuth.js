import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Card,
    CardContent,
} from '@material-ui/core';
import useAuth from '@hooks/useAuth';
import useMounted from '@hooks/useMounted';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode.react';
import axios from '@lib/axios';
import { app } from '@root/config';
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    codeInput: {
        width: '50px',
        height: '50px',
        textAlign: 'center',
        fontSize: '1.5rem',
        margin: '0 4px',
        '& input': {
            textAlign: 'center',
            fontSize: '1.5rem',
            padding: '8px 2px'
        }
    },
    codeInputContainer: {
        display: 'flex',
        justifyContent: 'center',
        margin: '20px 0'
    },
    verifyButton: {
        padding: '12px',
        borderRadius: '30px',
        fontWeight: 'bold',
        marginTop: '20px'
    }
}));

const TwoFactorAuth = () => {
    const classes = useStyles();
    const mounted = useMounted();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { completeTwoFactor, twoFactorRegistrationRequired } = useAuth();

    const [qrCode, setQrCode] = useState('');
    const [showQrCode, setShowQrCode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [codeValues, setCodeValues] = useState(['', '', '', '', '', '']);

    const inputRef0 = useRef(null);
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    const inputRef3 = useRef(null);
    const inputRef4 = useRef(null);
    const inputRef5 = useRef(null);

    const inputRefs = [inputRef0, inputRef1, inputRef2, inputRef3, inputRef4, inputRef5];

    useEffect(() => {
        if (twoFactorRegistrationRequired) {
            generateQrCode();
        }
    }, [twoFactorRegistrationRequired]);

    const generateQrCode = async () => {
        try {
            setIsLoading(true);

            const response = await axios.post(`${app.api}/2fa/google/create`);

            if (mounted.current && response.data.qr) {
                setQrCode(response.data.qr);
                setShowQrCode(true);
            }
        } catch (err) {
            toast.error(t('Failed to generate QR code'));
        } finally {
            setIsLoading(false);
        }
    };

    const verifyCode = async (code) => {
        try {
            setIsLoading(true);

            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('Токен авторизации не найден');
            }

            axios.defaults.headers.common.Authorization = `Bearer ${token}`;

            if (twoFactorRegistrationRequired) {
                await axios.post(`${app.api}/2fa/google/confirm`, {
                    authCode: code
                });

                await axios.post(`${app.api}/2fa/check`, {
                    authCode: code
                });

                toast.success(t('Two-factor authentication has been enabled'));
            } else {
                const response = await axios.post(`${app.api}/2fa/check`, {
                    authCode: code
                });

                if (response.data && response.data.token) {
                    localStorage.setItem('accessToken', response.data.token);
                    axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
                }

                toast.success(t('Authentication successful'));
            }

            completeTwoFactor();
            setTimeout(() => {
                navigate('/board');
                window.location.reload();
            }, 500);

            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || t('Failed to verify code')
            };
        } finally {
            setIsLoading(false);
        }
    };

    const handleCodeChange = (index, value) => {
        const newCodeValues = [...codeValues];

        if (value && !/^\d*$/.test(value)) {
            return;
        }

        if (value.length > 1) {
            if (value.length === 6 && /^\d{6}$/.test(value)) {
                for (let i = 0; i < 6; i++) {
                    newCodeValues[i] = value[i];
                }
                setCodeValues(newCodeValues);
                inputRefs[5].current?.focus();
                return;
            }

            value = value[0];
        }

        newCodeValues[index] = value;
        setCodeValues(newCodeValues);

        if (value !== '' && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && codeValues[index] === '' && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const isCodeComplete = codeValues.every((value) => value !== '');

    const submitCode = async () => {
        if (isCodeComplete) {
            const code = codeValues.join('');
            const result = await verifyCode(code);

            if (!result.success) {
                toast.error(result.message);
            }
        }
    };

    return (
        <Card>
            <CardContent sx={{ p: 4 }}>
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                    <Typography color="textPrimary" variant="h4" gutterBottom>
                        {t('Enter code from Google Authenticator')}
                    </Typography>

                    {twoFactorRegistrationRequired && (
                        <Typography color="textSecondary" variant="body2">
                            {t('Scan the QR code and enter the verification code')}
                        </Typography>
                    )}
                </Box>

                {showQrCode && twoFactorRegistrationRequired && (
                    <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'center' }}>
                        <QRCode value={qrCode} size={200} />
                    </Box>
                )}

                <Box className={classes.codeInputContainer}>
                    {codeValues.map((value, index) => (
                        <TextField
                            key={index}
                            className={classes.codeInput}
                            variant="outlined"
                            value={value}
                            inputRef={inputRefs[index]}
                            onChange={(e) => handleCodeChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            inputProps={{
                                maxLength: 1,
                                autoComplete: 'off'
                            }}
                        />
                    ))}
                </Box>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Button
                        color="primary"
                        disabled={!isCodeComplete || isLoading}
                        fullWidth
                        size="large"
                        onClick={submitCode}
                        variant="contained"
                        className={classes.verifyButton}
                    >
                        {isLoading ? t('Processing...') : t('Verify')}
                    </Button>

                    {twoFactorRegistrationRequired && (
                        <Box sx={{ mt: 3 }}>
                            <Button
                                color="secondary"
                                fullWidth
                                size="large"
                                onClick={generateQrCode}
                                variant="outlined"
                                disabled={isLoading}
                            >
                                {isLoading ? t('Loading...') : t('Generate New QR Code')}
                            </Button>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default TwoFactorAuth;
