import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Card,
    CardContent,
    Paper,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Collapse,
    Tooltip,
    useTheme
} from '@material-ui/core';
import useAuth from '@hooks/useAuth';
import useMounted from '@hooks/useMounted';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode.react';
import axios from '@lib/axios';
import { app } from '@root/config';
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/core/styles';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import AppleIcon from '@material-ui/icons/Apple';
import LooksTwoIcon from '@material-ui/icons/LooksTwo';
import Looks3Icon from '@material-ui/icons/Looks3';
import Looks4Icon from '@material-ui/icons/Looks4';
import LooksOneIcon from '@material-ui/icons/LooksOne';
import SecurityIcon from '@material-ui/icons/Security';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import WarningIcon from '@material-ui/icons/Warning';

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
    },
    helpIcon: {
        color: theme.palette.primary.main,
        fontSize: '2.5rem',
        cursor: 'pointer',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(66, 133, 244, 0.1)' : '#f1f7ff',
        padding: '10px',
        borderRadius: '50%',
        border: `2px solid ${theme.palette.primary.light}`,
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.mode === 'dark' ? '#000' : 'white',
            transform: 'scale(1.05)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
        }
    },
    instructionPaper: {
        padding: theme.spacing(3),
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'white',
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: '10px',
        boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
        color: theme.palette.text.primary
    },
    instructionHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: theme.spacing(2),
        borderRadius: '8px',
        boxShadow: '0 3px 5px rgba(0,0,0,0.1)'
    },
    securityIcon: {
        fontSize: '2rem',
        marginRight: theme.spacing(1),
        color: theme.palette.primary.contrastText
    },
    platformIcon: {
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        padding: '12px',
        borderRadius: '50%',
        marginRight: theme.spacing(1),
        boxShadow: '0 3px 5px rgba(0,0,0,0.2)'
    },
    stepIcon: {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(66, 133, 244, 0.1)' : '#f0f8ff',
        borderRadius: '50%',
        padding: '5px',
        minWidth: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    platformSection: {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(55, 65, 81, 0.5)' : '#f9f9f9',
        borderRadius: '8px',
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        border: theme.palette.mode === 'dark' ? '1px solid #4b5563' : '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column'
    },
    platformTitle: {
        fontWeight: 'bold',
        borderBottom: `2px solid ${theme.palette.primary.main}`,
        paddingBottom: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    instructionList: {
        padding: theme.spacing(0, 2),
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        '& .MuiListItem-root': {
            padding: '10px 0'
        }
    },
    divider: {
        margin: theme.spacing(2, 0),
        backgroundColor: theme.palette.primary.light
    },
    qrContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(3),
        border: `3px solid ${theme.palette.primary.main}`,
        borderRadius: '10px',
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'white',
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    },
    qrTitle: {
        color: theme.palette.primary.main,
        fontWeight: 'bold',
        marginBottom: theme.spacing(2)
    },
    qrSubtext: {
        marginTop: theme.spacing(2),
        fontSize: '1rem',
        color: theme.palette.text.secondary,
        textAlign: 'center',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(55, 65, 81, 0.7)' : '#f5f5f5',
        padding: theme.spacing(1),
        borderRadius: '5px',
        width: '100%'
    },
    warningBox: {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(220, 38, 38, 0.2)' : '#fff4f4',
        border: theme.palette.mode === 'dark' ? '2px solid #ef4444' : '2px solid #ff5252',
        borderRadius: '8px',
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),
        display: 'flex',
        alignItems: 'center'
    },
    warningIcon: {
        color: theme.palette.mode === 'dark' ? '#ef4444' : '#ff5252',
        marginRight: theme.spacing(2),
        fontSize: '2rem'
    },
    warningText: {
        color: theme.palette.mode === 'dark' ? '#ef4444' : '#d32f2f',
        fontWeight: 'bold'
    },
    instructionToggle: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: theme.spacing(2)
    },
    toggleButton: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
        borderRadius: '20px',
        padding: theme.spacing(1, 2),
        display: 'flex',
        alignItems: 'center',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }
    },
    stepText: {
        fontWeight: 'bold'
    },
    stepListItem: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        display: 'flex',
        alignItems: 'flex-start',
        flex: 1
    }
}));

const TwoFactorAuth = () => {
    const theme = useTheme();
    const classes = useStyles();
    const mounted = useMounted();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { completeTwoFactor, twoFactorRegistrationRequired } = useAuth();

    const [qrCode, setQrCode] = useState('');
    const [showQrCode, setShowQrCode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [codeValues, setCodeValues] = useState(['', '', '', '', '', '']);
    const [showInstructions, setShowInstructions] = useState(false);

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
            toast.error('Ошибка при создании QR-кода. Попробуйте еще раз.');
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
                await axios.post(`${app.api}/2fa/check`, {
                    authCode: code
                });

                toast.success('Двухфакторная аутентификация успешно подключена!');
            } else {
                const response = await axios.post(`${app.api}/2fa/check`, {
                    authCode: code
                });

                if (response.data && response.data.token) {
                    localStorage.setItem('accessToken', response.data.token);
                    axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
                }

                toast.success('Код подтверждён успешно!');
            }

            await completeTwoFactor();
            setTimeout(() => {
                navigate('/board');
                window.location.reload();
            }, 500);

            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Неверный код подтверждения'
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

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
    };

    return (
        <Card>
            <CardContent sx={{ p: 4 }}>
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                    <Typography color="textPrimary" variant="h4" gutterBottom>
                        Двухфакторная аутентификация
                    </Typography>

                    {twoFactorRegistrationRequired && (
                        <Typography color="textSecondary" variant="body2">
                            Настройте защиту вашего аккаунта с помощью Google Authenticator
                        </Typography>
                    )}
                </Box>

                {/* Кнопка показа инструкции */}
                {twoFactorRegistrationRequired && (
                    <Box className={classes.instructionToggle}>
                        <Tooltip title="Нажмите, чтобы открыть/закрыть инструкцию">
                            <button
                                className={classes.toggleButton}
                                onClick={toggleInstructions}
                            >
                                <HelpOutlineIcon style={{ marginRight: '8px' }} />
                                {showInstructions ? 'Скрыть инструкцию' : 'Как настроить Google Authenticator?'}
                                {showInstructions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </button>
                        </Tooltip>
                    </Box>
                )}

                {/* Инструкция для настройки 2FA - показывается при клике */}
                {twoFactorRegistrationRequired && (
                    <Collapse in={showInstructions}>
                        <Paper className={classes.instructionPaper} elevation={3}>
                            <Box className={classes.instructionHeader}>
                                <SecurityIcon className={classes.securityIcon} />
                                <Typography variant="h5">Инструкция по настройке Google Authenticator</Typography>
                            </Box>

                            <Typography variant="body1" style={{ fontWeight: 'bold', margin: '16px 0' }}>
                                Для повышения безопасности вашего аккаунта необходимо настроить двухфакторную аутентификацию:
                            </Typography>

                            <Divider className={classes.divider} />

                            <Grid container spacing={4}>
                                {/* Android инструкция */}
                                <Grid item xs={12} md={6}>
                                    <Box className={classes.platformSection} sx={{ height: '100%' }}>
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <PhoneAndroidIcon style={{ color: '#3ddc84', fontSize: '2rem', marginRight: '8px' }} />
                                            <Typography variant="h6" className={classes.platformTitle}>
                                                Для Android:
                                            </Typography>
                                        </Box>

                                        <List className={classes.instructionList} sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 50px)', justifyContent: 'space-between' }}>
                                            <ListItem className={classes.stepListItem} sx={{ flex: 1, alignItems: 'center' }}>
                                                <Box component={ListItemIcon} sx={{ minWidth: 'auto', mr: 1 }}>
                                                    <LooksOneIcon className={classes.stepIcon} />
                                                </Box>
                                                <ListItemText
                                                    primary={<span className={classes.stepText}>Скачайте Google Authenticator из Google Play</span>}
                                                />
                                            </ListItem>
                                            <ListItem className={classes.stepListItem} sx={{ flex: 1, alignItems: 'center' }}>
                                                <Box component={ListItemIcon} sx={{ minWidth: 'auto', mr: 1 }}>
                                                    <LooksTwoIcon className={classes.stepIcon} />
                                                </Box>
                                                <ListItemText
                                                    primary={<span className={classes.stepText}>Откройте приложение и нажмите + (плюс)</span>}
                                                />
                                            </ListItem>
                                            <ListItem className={classes.stepListItem} sx={{ flex: 1, alignItems: 'center' }}>
                                                <Box component={ListItemIcon} sx={{ minWidth: 'auto', mr: 1 }}>
                                                    <Looks3Icon className={classes.stepIcon} />
                                                </Box>
                                                <ListItemText
                                                    primary={<span className={classes.stepText}>Выберите "Сканировать QR-код"</span>}
                                                />
                                            </ListItem>
                                            <ListItem className={classes.stepListItem} sx={{ flex: 1, alignItems: 'center' }}>
                                                <Box component={ListItemIcon} sx={{ minWidth: 'auto', mr: 1 }}>
                                                    <Looks4Icon className={classes.stepIcon} />
                                                </Box>
                                                <ListItemText
                                                    primary={<span className={classes.stepText}>Наведите камеру на QR-код ниже</span>}
                                                />
                                            </ListItem>
                                        </List>
                                    </Box>
                                </Grid>

                                {/* iOS инструкция */}
                                <Grid item xs={12} md={6}>
                                    <Box className={classes.platformSection} sx={{ height: '100%' }}>
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <AppleIcon style={{
                                                color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                                                fontSize: '2rem',
                                                marginRight: '8px'
                                            }} />
                                            <Typography variant="h6" className={classes.platformTitle}>
                                                Для iPhone (iOS):
                                            </Typography>
                                        </Box>

                                        <List className={classes.instructionList} sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 50px)' }}>
                                            <ListItem className={classes.stepListItem} sx={{ flex: 1 }}>
                                                <ListItemIcon>
                                                    <LooksOneIcon className={classes.stepIcon} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={<span className={classes.stepText}>Скачайте Google Authenticator из App Store</span>}
                                                />
                                            </ListItem>
                                            <ListItem className={classes.stepListItem} sx={{ flex: 1 }}>
                                                <ListItemIcon>
                                                    <LooksTwoIcon className={classes.stepIcon} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={<span className={classes.stepText}>Откройте приложение и нажмите + (плюс)</span>}
                                                />
                                            </ListItem>
                                            <ListItem className={classes.stepListItem} sx={{ flex: 1 }}>
                                                <ListItemIcon>
                                                    <Looks3Icon className={classes.stepIcon} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={<span className={classes.stepText}>Выберите "Сканировать QR-код"</span>}
                                                />
                                            </ListItem>
                                            <ListItem className={classes.stepListItem} sx={{ flex: 1 }}>
                                                <ListItemIcon>
                                                    <Looks4Icon className={classes.stepIcon} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={<span className={classes.stepText}>Наведите камеру на QR-код ниже</span>}
                                                />
                                            </ListItem>
                                        </List>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Divider className={classes.divider} />

                            <Typography variant="body1" style={{ marginTop: '16px', marginBottom: '16px' }}>
                                После сканирования QR-кода, приложение Google Authenticator будет генерировать 6-значный код каждые 30 секунд.
                                Введите текущий код в поля ниже для завершения настройки.
                            </Typography>

                            <Box className={classes.warningBox}>
                                <WarningIcon className={classes.warningIcon} />
                                <Typography className={classes.warningText}>
                                    ВНИМАНИЕ! Не теряйте доступ к устройству с установленным Google Authenticator, иначе вы не сможете войти в систему!
                                </Typography>
                            </Box>
                        </Paper>
                    </Collapse>
                )}

                {/* QR код для сканирования */}
                {showQrCode && twoFactorRegistrationRequired && (
                    <Box className={classes.qrContainer}>
                        <Typography variant="h6" className={classes.qrTitle}>
                            Отсканируйте этот QR-код в приложении Google Authenticator
                        </Typography>
                        <QRCode
                            value={qrCode}
                            size={240}
                            level={"H"}
                            bgColor={theme.palette.mode === 'dark' ? '#ffffff' : '#ffffff'}
                            fgColor={theme.palette.mode === 'dark' ? '#000000' : '#000000'}
                            includeMargin={true}
                        />
                        <Typography className={classes.qrSubtext}>
                            После сканирования, приложение будет генерировать 6-значный код
                        </Typography>
                    </Box>
                )}

                {/* Поля для ввода кода */}
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
                        {isLoading ? "Проверка..." : "Подтвердить"}
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
                                {isLoading ? "Загрузка..." : "Создать новый QR-код"}
                            </Button>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default TwoFactorAuth;
