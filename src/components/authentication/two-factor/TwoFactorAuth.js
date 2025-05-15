// src/components/authentication/two-factor/TwoFactorAuth.js
import { useState, useEffect, useRef } from 'react';
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
    CardContent,
    Grid
} from '@material-ui/core';
import useAuth from '@hooks/useAuth';
import useMounted from '@hooks/useMounted';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode.react';
import axios from '@lib/axios';
import { app } from '@root/config';
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/core/styles';

// Стили для полей ввода кода
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
    const [isRegistrationMode, setIsRegistrationMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Состояние для отслеживания значения каждого поля кода
    const [codeValues, setCodeValues] = useState(['', '', '', '', '', '']);

    // Рефы для полей ввода, чтобы переходить между ними
    const inputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null)
    ];

    // При загрузке компонента проверяем тип 2FA
    useEffect(() => {
        // Если требуется регистрация 2FA, автоматически генерируем QR-код
        if (twoFactorRegistrationRequired) {
            setIsRegistrationMode(true);
            generateQrCode();
        }
    }, [twoFactorRegistrationRequired]);

    // Проверяем, установлен ли токен при загрузке компонента
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            // Устанавливаем токен для всех запросов axios
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        }
    }, []);

    // Функция для генерации QR-кода
    const generateQrCode = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${app.api}/2fa/google/create`);

            if (mounted.current) {
                setQrCode(response.data.qr);
                setShowQrCode(true);
                setIsRegistrationMode(true);
            }
        } catch (err) {
            console.error('Ошибка генерации QR-кода:', err);
            toast.error(t('Failed to generate QR code'));
        } finally {
            setIsLoading(false);
        }
    };

    // Функция для проверки кода аутентификации
    const verifyCode = async (code) => {
        try {
            setIsLoading(true);

            // Проверяем, что токен есть в localStorage
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('Токен авторизации не найден');
            }

            // Устанавливаем токен для запроса
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;

            if (isRegistrationMode) {
                // Если мы в режиме регистрации, подтверждаем код через API регистрации 2FA
                await axios.post(`${app.api}/2fa/google/confirm`, {
                    authCode: code
                });

                await axios.post(`${app.api}/2fa/check`, {
                    authCode: code
                });

                toast.success(t('Two-factor authentication has been enabled'));
                completeTwoFactor(); // Обновляем состояние аутентификации

                setTimeout(() => {
                    navigate('/board');
                    window.location.reload();
                }, 500);
            } else {
                const response = await axios.post(`${app.api}/2fa/check`, {
                    authCode: code
                });

                if (response.data && response.data.token) {
                    localStorage.setItem('accessToken', response.data.token);
                    axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
                }

                toast.success(t('Authentication successful'));
                completeTwoFactor(); // Обновляем состояние аутентификации

                setTimeout(() => {
                    navigate('/board');
                    window.location.reload();
                }, 500);
            }
            return { success: true };
        } catch (err) {
            console.error('Ошибка проверки кода:', err);
            return {
                success: false,
                message: err.response?.data?.message || t('Failed to verify code')
            };
        } finally {
            setIsLoading(false);
        }
    };

    // Обработчик изменения значения в поле ввода кода
    const handleCodeChange = (index, value) => {
        // Обновляем состояние codeValues с новым значением
        const newCodeValues = [...codeValues];

        // Позволяем вводить только цифры
        if (value && !/^\d*$/.test(value)) {
            return;
        }

        // Берем только первый символ, если пользователь вставил несколько
        if (value.length > 1) {
            // Если вставили полный код, распределяем по полям
            if (value.length === 6 && /^\d{6}$/.test(value)) {
                for (let i = 0; i < 6; i++) {
                    newCodeValues[i] = value[i];
                }
                setCodeValues(newCodeValues);

                // Фокус на последнее поле
                inputRefs[5].current?.focus();
                return;
            }

            value = value[0];
        }

        newCodeValues[index] = value;
        setCodeValues(newCodeValues);

        // Если ввели цифру, переходим к следующему полю
        if (value !== '' && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

    // Обработчик нажатия клавиши Backspace
    const handleKeyDown = (index, e) => {
        // Если нажат Backspace и поле пустое, переходим к предыдущему полю
        if (e.key === 'Backspace' && codeValues[index] === '' && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    // Проверка, все ли поля кода заполнены
    const isCodeComplete = codeValues.every((value) => value !== '');

    // Функция для отправки кода
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

                    {isRegistrationMode && (
                        <Typography color="textSecondary" variant="body2">
                            {t('Scan the QR code and enter the verification code')}
                        </Typography>
                    )}
                </Box>

                {isRegistrationMode && !showQrCode && (
                    <Box sx={{ mt: 3, mb: 3 }}>
                        <Button
                            color="primary"
                            fullWidth
                            size="large"
                            onClick={generateQrCode}
                            variant="contained"
                            disabled={isLoading}
                        >
                            {isLoading ? t('Loading...') : t('Generate QR Code')}
                        </Button>
                    </Box>
                )}

                {showQrCode && isRegistrationMode && (
                    <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'center' }}>
                        <QRCode value={qrCode} size={200} />
                    </Box>
                )}

                {/* Сетка из 6 полей для ввода кода */}
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

                    {isRegistrationMode && (
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
